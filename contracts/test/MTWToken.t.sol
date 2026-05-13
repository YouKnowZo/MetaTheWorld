// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/MTWToken.sol";

contract MTWTokenTest is Test {
    MTWToken public token;
    address public admin;
    address public user;

    function setUp() public {
        admin = makeAddr("admin");
        user = makeAddr("user");
        vm.prank(admin);
        token = new MTWToken();
    }

    function testInitialSupply() public view {
        assertEq(token.totalSupply(), 1000000000 * 10**token.decimals());
        assertEq(token.balanceOf(admin), 1000000000 * 10**token.decimals());
    }

    function testWhoHasRole() public view {
        assertTrue(token.hasRole(token.MINTER_ROLE(), admin));
        assertFalse(token.hasRole(token.MINTER_ROLE(), user));
        assertTrue(token.hasRole(bytes32(0), admin));
    }

    function testMinting() public {
        uint256 amount = 1000 * 10**token.decimals();
        vm.prank(admin);
        token.mint(user, amount);
        assertEq(token.balanceOf(user), amount);
    }

    function testMintingFailNonAdmin() public {
        uint256 amount = 1000 * 10**token.decimals();
        vm.prank(user);
        vm.expectRevert();
        token.mint(user, amount);
    }

    function testVotingPower() public {
        uint256 amount = 1000 * 10**token.decimals();
        vm.prank(admin);
        token.transfer(user, amount);
        
        assertEq(token.getVotes(user), 0);
        
        vm.prank(user);
        token.delegate(user);
        
        assertEq(token.getVotes(user), amount);
    }
}
