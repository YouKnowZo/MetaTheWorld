// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/LandRegistry.sol";

contract LandRegistryTest is Test {
    LandRegistry public registry;
    address public admin = address(1);
    address public user = address(2);

    function setUp() public {
        vm.prank(admin);
        registry = new LandRegistry();
    }

    function testMint() public {
        string memory parcelId = "dr5rsnm"; // NYC geohash prefix
        string memory metadataCid = "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco";
        
        uint256 expectedTokenId = uint256(keccak256(abi.encodePacked(parcelId)));
        
        vm.prank(user);
        uint256 tokenId = registry.mint(user, parcelId, metadataCid);
        
        assertEq(tokenId, expectedTokenId);
        assertEq(registry.ownerOf(tokenId), user);
        assertEq(registry.tokenURI(tokenId), string(abi.encodePacked("ipfs://", metadataCid)));
        assertEq(registry.parcelIdOf(tokenId), parcelId);
    }

    function testLease() public {
        string memory parcelId = "dr5rsnm";
        vm.prank(user);
        uint256 tokenId = registry.mint(user, parcelId, "cid");
        
        address lessee = address(3);
        uint256 duration = 3600;
        
        vm.prank(user);
        registry.lease(tokenId, lessee, duration);
        
        (address current, uint256 expiry) = registry.currentLessee(tokenId);
        assertEq(current, lessee);
        assertEq(expiry, block.timestamp + duration);
    }

    function testLeaseExpiry() public {
        string memory parcelId = "dr5rsnm";
        vm.prank(user);
        uint256 tokenId = registry.mint(user, parcelId, "cid");
        
        vm.prank(user);
        registry.lease(tokenId, address(3), 3600);
        
        vm.warp(block.timestamp + 3601);
        
        (address current, ) = registry.currentLessee(tokenId);
        assertEq(current, address(0));
    }
}
