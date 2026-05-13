// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ZoningRegistry is Ownable {
    struct ZoningLaw {
        uint256 maxHeight;
        string allowedUses;
        bool exists;
    }

    // regionId could be a geohash prefix or a city name
    mapping(string => ZoningLaw) public regionalLaws;

    event ZoningLawUpdated(string regionId, uint256 maxHeight, string allowedUses);

    constructor(address initialOwner) Ownable(initialOwner) {}

    function updateZoningLaw(
        string calldata regionId,
        uint256 maxHeight,
        string calldata allowedUses
    ) external onlyOwner {
        regionalLaws[regionId] = ZoningLaw({
            maxHeight: maxHeight,
            allowedUses: allowedUses,
            exists: true
        });

        emit ZoningLawUpdated(regionId, maxHeight, allowedUses);
    }

    function getZoningLaw(string calldata regionId) external view returns (uint256 maxHeight, string memory allowedUses) {
        ZoningLaw memory law = regionalLaws[regionId];
        require(law.exists, "No zoning law for this region");
        return (law.maxHeight, law.allowedUses);
    }
}
