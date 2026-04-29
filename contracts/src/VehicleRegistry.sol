// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title VehicleRegistry
 * @dev ERC721 token representing vehicles in the MTW Metaverse.
 */
contract VehicleRegistry is ERC721, ERC721URIStorage, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    uint256 private _nextTokenId;

    // Mapping from vehicle tokenId to an array of slotted part IDs (ERC1155)
    mapping(uint256 => uint256[]) private _slottedParts;

    event PartSlotted(uint256 indexed vehicleId, uint256 partId);

    constructor() ERC721("MTW Vehicle", "VEHICLE") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    function mint(address to, string memory uri) public onlyRole(MINTER_ROLE) returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }

    /**
     * @dev "Slot" a part into a vehicle. For now, this is just recording the part ID.
     * In a full implementation, this might involve transferring the ERC1155 part to this contract.
     */
    function slotPart(uint256 tokenId, uint256 partId) public {
        _checkAuthorized(ownerOf(tokenId), msg.sender, tokenId);
        _slottedParts[tokenId].push(partId);
        emit PartSlotted(tokenId, partId);
    }

    function getSlottedParts(uint256 tokenId) public view returns (uint256[] memory) {
        _requireOwned(tokenId);
        return _slottedParts[tokenId];
    }

    // Overrides required by Solidity
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
