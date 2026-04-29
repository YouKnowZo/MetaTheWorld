// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Votes.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "./interfaces/ILandRegistry.sol";

contract LandRegistry is ILandRegistry, ERC721Enumerable, ERC721URIStorage, ERC721Votes, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    mapping(uint256 => string) private _tokenParcelIds;
    mapping(string => uint256) private _parcelIdTokens;

    struct LeaseInfo {
        address lessee;
        uint256 expiry;
    }

    mapping(uint256 => LeaseInfo) private _leases;
    mapping(string => uint256) public tierPrices;

    constructor() ERC721("MTW Land", "LAND") EIP712("MTW Land", "1") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);

        tierPrices["PLOT"] = 0.01 ether;
        tierPrices["DISTRICT"] = 0.1 ether;
        tierPrices["REGION"] = 1 ether;
        tierPrices["TERRITORY"] = 10 ether;
    }

    function setTierPrice(string calldata tier, uint256 price) external onlyRole(DEFAULT_ADMIN_ROLE) {
        tierPrices[tier] = price;
    }

    function mintPrice(string calldata tier) public view override returns (uint256) {
        return tierPrices[tier];
    }

    function mint(
        address to,
        string calldata parcelId,
        string calldata metadataCid
    ) external payable override returns (uint256) {
        // Deriving tokenId from parcelId
        uint256 tokenId = uint256(keccak256(abi.encodePacked(parcelId)));
        
        require(_parcelIdTokens[parcelId] == 0, "Parcel already minted");
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, string(abi.encodePacked("ipfs://", metadataCid)));
        
        _tokenParcelIds[tokenId] = parcelId;
        _parcelIdTokens[parcelId] = tokenId;

        emit ParcelMinted(tokenId, to, parcelId);
        
        return tokenId;
    }

    function parcelIdOf(uint256 tokenId) external view override returns (string memory) {
        _requireOwned(tokenId);
        return _tokenParcelIds[tokenId];
    }

    function tokenIdOfParcel(string calldata parcelId) external view override returns (uint256) {
        uint256 tokenId = _parcelIdTokens[parcelId];
        require(tokenId != 0, "Parcel not minted");
        return tokenId;
    }

    function lease(
        uint256 tokenId,
        address lessee,
        uint256 duration
    ) external override {
        address owner = ownerOf(tokenId);
        require(msg.sender == owner || isApprovedForAll(owner, msg.sender) || getApproved(tokenId) == msg.sender, "Not authorized to lease");
        
        uint256 expiry = block.timestamp + duration;
        _leases[tokenId] = LeaseInfo({
            lessee: lessee,
            expiry: expiry
        });

        emit ParcelLeased(tokenId, lessee, expiry);
    }

    function currentLessee(uint256 tokenId) external view override returns (address, uint256 expiry) {
        LeaseInfo memory info = _leases[tokenId];
        if (block.timestamp >= info.expiry) {
            return (address(0), 0);
        }
        return (info.lessee, info.expiry);
    }

    // Overrides required by Solidity
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable, ERC721Votes)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable, ERC721Votes)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
