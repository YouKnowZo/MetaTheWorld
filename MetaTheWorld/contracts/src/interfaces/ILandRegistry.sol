// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ILandRegistry {
    // Events
    event ParcelMinted(uint256 indexed tokenId, address indexed owner, string parcelId);
    event ParcelLeased(uint256 indexed tokenId, address indexed lessee, uint256 expiry);

    // Minting
    function mint(
        address to,
        string calldata parcelId,
        string calldata metadataCid
    ) external payable returns (uint256 tokenId);

    // Metadata
    function parcelIdOf(uint256 tokenId) external view returns (string memory);
    function tokenIdOfParcel(string calldata parcelId) external view returns (uint256);

    // Leasing
    function lease(
        uint256 tokenId,
        address lessee,
        uint256 duration
    ) external;
    function currentLessee(uint256 tokenId) external view returns (address, uint256 expiry);

    // Pricing
    function mintPrice(string calldata tier) external view returns (uint256);
}
