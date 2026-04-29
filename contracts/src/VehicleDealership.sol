// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "lib/openzeppelin-contracts/contracts/token/ERC721/IERC721.sol";
import "lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import "./VehicleRegistry.sol";
import "./RoyaltyDistributor.sol";

/**
 * @title VehicleDealership
 * @dev Handles buying and selling of MTW vehicles with royalty integration.
 */
contract VehicleDealership is Ownable {
    IERC20 public mtwToken;
    VehicleRegistry public vehicleRegistry;
    RoyaltyDistributor public royaltyDistributor;

    struct Listing {
        uint256 price;
        bool active;
        string parcelId;
    }

    mapping(uint256 => Listing) public listings;

    event VehicleListed(uint256 indexed tokenId, uint256 price, string parcelId);
    event VehicleSold(uint256 indexed tokenId, address indexed buyer, uint256 price);

    constructor(address _mtwToken, address _vehicleRegistry, address _royaltyDistributor) Ownable(msg.sender) {
        mtwToken = IERC20(_mtwToken);
        vehicleRegistry = VehicleRegistry(_vehicleRegistry);
        royaltyDistributor = RoyaltyDistributor(_royaltyDistributor);
    }

    function listVehicle(uint256 tokenId, uint256 price, string calldata parcelId) external {
        require(vehicleRegistry.ownerOf(tokenId) == msg.sender, "Not owner");
        require(
            vehicleRegistry.getApproved(tokenId) == address(this) || 
            vehicleRegistry.isApprovedForAll(msg.sender, address(this)), 
            "Not approved"
        );

        listings[tokenId] = Listing({
            price: price,
            active: true,
            parcelId: parcelId
        });

        emit VehicleListed(tokenId, price, parcelId);
    }

    function buyVehicle(uint256 tokenId) external {
        Listing storage listing = listings[tokenId];
        require(listing.active, "Not for sale");
        
        address seller = vehicleRegistry.ownerOf(tokenId);
        uint256 price = listing.price;

        require(mtwToken.transferFrom(msg.sender, address(this), price), "Payment failed");

        uint256 fee = (price * 5) / 100; // 5% dealership fee
        uint256 sellerAmount = price - fee;

        require(mtwToken.transfer(seller, sellerAmount), "Seller payment failed");

        // Send fee to royalty distributor
        mtwToken.approve(address(royaltyDistributor), fee);
        royaltyDistributor.distribute(fee, listing.parcelId);

        vehicleRegistry.safeTransferFrom(seller, msg.sender, tokenId);

        listing.active = false;

        emit VehicleSold(tokenId, msg.sender, price);
    }

    function cancelListing(uint256 tokenId) external {
        require(vehicleRegistry.ownerOf(tokenId) == msg.sender, "Not owner");
        listings[tokenId].active = false;
    }
}
