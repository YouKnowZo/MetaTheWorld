// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./interfaces/ILandRegistry.sol";

/**
 * @title RoyaltyDistributor
 * @dev Handles the distribution of MTWToken fees from various economic activities.
 */
contract RoyaltyDistributor is AccessControl {
    bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");

    IERC20 public mtwToken;
    ILandRegistry public landRegistry;

    uint256 public landOwnerShare = 40; // 40%
    uint256 public stakerShare = 40;    // 40%
    uint256 public daoShare = 20;       // 20%

    address public daoTreasury;
    address public stakerPool;

    event RoyaltiesDistributed(uint256 amount, string parcelId);
    event SharesUpdated(uint256 landOwner, uint256 staker, uint256 dao);

    constructor(address _mtwToken, address _landRegistry, address _daoTreasury, address _stakerPool) {
        mtwToken = IERC20(_mtwToken);
        landRegistry = ILandRegistry(_landRegistry);
        daoTreasury = _daoTreasury;
        stakerPool = _stakerPool;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function setShares(uint256 _landOwner, uint256 _staker, uint256 _dao) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_landOwner + _staker + _dao == 100, "Total must be 100");
        landOwnerShare = _landOwner;
        stakerShare = _staker;
        daoShare = _dao;
        emit SharesUpdated(_landOwner, _staker, _dao);
    }

    function setTreasury(address _daoTreasury) external onlyRole(DEFAULT_ADMIN_ROLE) {
        daoTreasury = _daoTreasury;
    }

    function setStakerPool(address _stakerPool) external onlyRole(DEFAULT_ADMIN_ROLE) {
        stakerPool = _stakerPool;
    }

    /**
     * @dev Distribute royalties from an economic event.
     * @param amount Amount of MTW to distribute.
     * @param parcelId The ID of the parcel where the event occurred.
     */
    function distribute(uint256 amount, string calldata parcelId) external onlyRole(DISTRIBUTOR_ROLE) {
        require(mtwToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        uint256 toLandOwner = (amount * landOwnerShare) / 100;
        uint256 toStakers = (amount * stakerShare) / 100;
        uint256 toDao = amount - toLandOwner - toStakers;

        // Find land owner
        uint256 tokenId = landRegistry.tokenIdOfParcel(parcelId);
        address owner = IERC721(address(landRegistry)).ownerOf(tokenId);

        if (toLandOwner > 0) {
            require(mtwToken.transfer(owner, toLandOwner), "Land owner transfer failed");
        }
        if (toStakers > 0) {
            require(mtwToken.transfer(stakerPool, toStakers), "Staker transfer failed");
        }
        if (toDao > 0) {
            require(mtwToken.transfer(daoTreasury, toDao), "DAO transfer failed");
        }

        emit RoyaltiesDistributed(amount, parcelId);
    }
}
