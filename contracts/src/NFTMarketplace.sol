// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ReentrancyGuard} from "lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import {IERC721} from "lib/openzeppelin-contracts/contracts/token/ERC721/IERC721.sol";
import {IERC1155} from "lib/openzeppelin-contracts/contracts/token/ERC1155/IERC1155.sol";
import {IERC2981} from "lib/openzeppelin-contracts/contracts/interfaces/IERC2981.sol";
import {ERC721Holder} from "lib/openzeppelin-contracts/contracts/token/ERC721/utils/ERC721Holder.sol";
import {ERC1155Holder} from "lib/openzeppelin-contracts/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import {IERC165} from "lib/openzeppelin-contracts/contracts/utils/introspection/IERC165.sol";

/// @title NFTMarketplace
/// @notice Decentralised NFT marketplace supporting ERC-721 and ERC-1155 tokens.
///         Platform fee: 2.5 %. EIP-2981 royalty auto-distribution.
contract NFTMarketplace is ReentrancyGuard, Ownable, ERC721Holder, ERC1155Holder {
    // ─── Constants ───────────────────────────────────────────────────────────
    uint256 public constant FEE_BASIS = 10_000;
    uint256 public platformFeePercent = 250; // 2.5 %

    // ─── Types ───────────────────────────────────────────────────────────────
    struct Listing {
        address seller;
        address tokenAddress;
        uint256 tokenId;
        uint256 price;       // in wei
        bool    isERC1155;
        uint256 amount;      // always 1 for ERC-721
        bool    active;
    }

    struct Offer {
        address buyer;
        uint256 amount;      // ETH offered (in wei)
        uint256 expiry;      // unix timestamp
        bool    accepted;
    }

    // ─── State ───────────────────────────────────────────────────────────────
    uint256 public nextListingId;
    uint256 public nextOfferId;
    uint256 public accumulatedFees;

    mapping(uint256 => Listing) public listings;
    /// listingId => offerId => Offer
    mapping(uint256 => mapping(uint256 => Offer)) public offers;
    /// listingId => array of offer ids
    mapping(uint256 => uint256[]) public listingOffers;

    // ─── Events ──────────────────────────────────────────────────────────────
    event Listed(
        uint256 indexed listingId,
        address indexed seller,
        address tokenAddress,
        uint256 tokenId,
        uint256 price,
        bool isERC1155,
        uint256 amount
    );
    event Sold(
        uint256 indexed listingId,
        address indexed buyer,
        uint256 price
    );
    event Cancelled(uint256 indexed listingId);
    event OfferMade(
        uint256 indexed listingId,
        uint256 indexed offerId,
        address indexed buyer,
        uint256 amount,
        uint256 expiry
    );
    event OfferAccepted(
        uint256 indexed listingId,
        uint256 indexed offerId,
        address indexed buyer,
        uint256 amount
    );
    event FeesWithdrawn(address to, uint256 amount);

    // ─── Constructor ─────────────────────────────────────────────────────────
    constructor() Ownable(msg.sender) {}

    // ─── External: List ──────────────────────────────────────────────────────
    /// @notice List an NFT for sale.
    /// @param tokenAddress ERC-721 or ERC-1155 contract address.
    /// @param tokenId      Token ID to list.
    /// @param price        Sale price in wei.
    /// @param isERC1155    True if token is ERC-1155.
    /// @param amount       Quantity (must be 1 for ERC-721).
    function listNFT(
        address tokenAddress,
        uint256 tokenId,
        uint256 price,
        bool    isERC1155,
        uint256 amount
    ) external nonReentrant returns (uint256 listingId) {
        require(price > 0, "NFTMarketplace: price must be > 0");
        require(tokenAddress != address(0), "NFTMarketplace: zero address");
        if (isERC1155) {
            require(amount > 0, "NFTMarketplace: amount must be > 0");
            IERC1155(tokenAddress).safeTransferFrom(msg.sender, address(this), tokenId, amount, "");
        } else {
            require(amount == 1, "NFTMarketplace: ERC-721 amount must be 1");
            IERC721(tokenAddress).safeTransferFrom(msg.sender, address(this), tokenId);
        }

        listingId = nextListingId++;
        listings[listingId] = Listing({
            seller:       msg.sender,
            tokenAddress: tokenAddress,
            tokenId:      tokenId,
            price:        price,
            isERC1155:    isERC1155,
            amount:       amount,
            active:       true
        });

        emit Listed(listingId, msg.sender, tokenAddress, tokenId, price, isERC1155, amount);
    }

    // ─── External: Buy ───────────────────────────────────────────────────────
    /// @notice Purchase a listed NFT at the asking price.
    function buyNFT(uint256 listingId) external payable nonReentrant {
        Listing storage l = listings[listingId];
        require(l.active, "NFTMarketplace: listing not active");
        require(msg.value >= l.price, "NFTMarketplace: insufficient payment");
        require(msg.sender != l.seller, "NFTMarketplace: seller cannot buy");

        l.active = false;

        uint256 platformFee = (l.price * platformFeePercent) / FEE_BASIS;
        uint256 royaltyFee  = _payRoyalty(l.tokenAddress, l.tokenId, l.price);
        uint256 sellerProceeds = l.price - platformFee - royaltyFee;

        accumulatedFees += platformFee;

        // Transfer NFT to buyer
        if (l.isERC1155) {
            IERC1155(l.tokenAddress).safeTransferFrom(address(this), msg.sender, l.tokenId, l.amount, "");
        } else {
            IERC721(l.tokenAddress).safeTransferFrom(address(this), msg.sender, l.tokenId);
        }

        // Pay seller
        (bool ok,) = payable(l.seller).call{value: sellerProceeds}("");
        require(ok, "NFTMarketplace: seller payment failed");

        // Refund overpayment
        if (msg.value > l.price) {
            (bool refundOk,) = payable(msg.sender).call{value: msg.value - l.price}("");
            require(refundOk, "NFTMarketplace: refund failed");
        }

        emit Sold(listingId, msg.sender, l.price);
    }

    // ─── External: Cancel ────────────────────────────────────────────────────
    /// @notice Cancel a listing and return the NFT to the seller.
    function cancelListing(uint256 listingId) external nonReentrant {
        Listing storage l = listings[listingId];
        require(l.active, "NFTMarketplace: listing not active");
        require(l.seller == msg.sender || owner() == msg.sender, "NFTMarketplace: not authorised");

        l.active = false;

        if (l.isERC1155) {
            IERC1155(l.tokenAddress).safeTransferFrom(address(this), l.seller, l.tokenId, l.amount, "");
        } else {
            IERC721(l.tokenAddress).safeTransferFrom(address(this), l.seller, l.tokenId);
        }

        emit Cancelled(listingId);
    }

    // ─── External: Offers ────────────────────────────────────────────────────
    /// @notice Make an offer on a listing. ETH is held in escrow.
    function makeOffer(uint256 listingId, uint256 expiryTimestamp)
        external payable nonReentrant
        returns (uint256 offerId)
    {
        Listing storage l = listings[listingId];
        require(l.active, "NFTMarketplace: listing not active");
        require(msg.value > 0, "NFTMarketplace: offer must be > 0");
        require(expiryTimestamp > block.timestamp, "NFTMarketplace: expiry in the past");
        require(msg.sender != l.seller, "NFTMarketplace: seller cannot make offer");

        offerId = nextOfferId++;
        offers[listingId][offerId] = Offer({
            buyer:    msg.sender,
            amount:   msg.value,
            expiry:   expiryTimestamp,
            accepted: false
        });
        listingOffers[listingId].push(offerId);

        emit OfferMade(listingId, offerId, msg.sender, msg.value, expiryTimestamp);
    }

    /// @notice Accept an outstanding offer. NFT transferred; ETH distributed.
    function acceptOffer(uint256 listingId, uint256 offerId) external nonReentrant {
        Listing storage l = listings[listingId];
        Offer   storage o = offers[listingId][offerId];

        require(l.active, "NFTMarketplace: listing not active");
        require(l.seller == msg.sender, "NFTMarketplace: only seller");
        require(!o.accepted, "NFTMarketplace: offer already accepted");
        require(block.timestamp <= o.expiry, "NFTMarketplace: offer expired");

        l.active   = false;
        o.accepted = true;

        uint256 platformFee = (o.amount * platformFeePercent) / FEE_BASIS;
        uint256 royaltyFee  = _payRoyalty(l.tokenAddress, l.tokenId, o.amount);
        uint256 sellerProceeds = o.amount - platformFee - royaltyFee;

        accumulatedFees += platformFee;

        // Transfer NFT to buyer
        if (l.isERC1155) {
            IERC1155(l.tokenAddress).safeTransferFrom(address(this), o.buyer, l.tokenId, l.amount, "");
        } else {
            IERC721(l.tokenAddress).safeTransferFrom(address(this), o.buyer, l.tokenId);
        }

        // Pay seller
        (bool ok,) = payable(l.seller).call{value: sellerProceeds}("");
        require(ok, "NFTMarketplace: seller payment failed");

        emit OfferAccepted(listingId, offerId, o.buyer, o.amount);
    }

    // ─── Admin ───────────────────────────────────────────────────────────────
    /// @notice Withdraw accumulated platform fees to owner.
    function withdrawFees() external onlyOwner nonReentrant {
        uint256 amount = accumulatedFees;
        require(amount > 0, "NFTMarketplace: no fees");
        accumulatedFees = 0;
        (bool ok,) = payable(owner()).call{value: amount}("");
        require(ok, "NFTMarketplace: withdraw failed");
        emit FeesWithdrawn(owner(), amount);
    }

    /// @notice Update platform fee. Max 10 %.
    function setPlatformFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "NFTMarketplace: fee too high");
        platformFeePercent = newFee;
    }

    // ─── Internal ────────────────────────────────────────────────────────────
    /// @dev Attempts EIP-2981 royalty payment. Returns amount paid.
    function _payRoyalty(
        address tokenAddress,
        uint256 tokenId,
        uint256 salePrice
    ) internal returns (uint256 royaltyPaid) {
        try IERC165(tokenAddress).supportsInterface(type(IERC2981).interfaceId) returns (bool supported) {
            if (!supported) return 0;
        } catch {
            return 0;
        }

        try IERC2981(tokenAddress).royaltyInfo(tokenId, salePrice) returns (
            address receiver,
            uint256 royaltyAmount
        ) {
            if (receiver == address(0) || royaltyAmount == 0) return 0;
            // Cap royalty at 10 %
            uint256 maxRoyalty = (salePrice * 1000) / FEE_BASIS;
            royaltyAmount = royaltyAmount > maxRoyalty ? maxRoyalty : royaltyAmount;
            (bool ok,) = payable(receiver).call{value: royaltyAmount}("");
            if (ok) royaltyPaid = royaltyAmount;
        } catch {
            return 0;
        }
    }

    // ─── View helpers ────────────────────────────────────────────────────────
    function getListing(uint256 listingId) external view returns (Listing memory) {
        return listings[listingId];
    }

    function getOffer(uint256 listingId, uint256 offerId) external view returns (Offer memory) {
        return offers[listingId][offerId];
    }

    function getListingOfferIds(uint256 listingId) external view returns (uint256[] memory) {
        return listingOffers[listingId];
    }

    receive() external payable {}
}
