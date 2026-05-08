pragma solidity ^0.8.18;

import {ForgeVMCustomErrors} from "forge-std/Vm.sol";
import {Test, console} from "forge-std/Test.sol";
import {AdSpace} from "../src/AdSpace.sol";
import {LandRegistry} from "../src/LandRegistry.sol";
import {MTWToken} from "../src/MTWToken.sol";
import {ERC721} from "lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";

contract AdSpaceTest is Test {
    AdSpace adSpace;
    LandRegistry landRegistry;
    MTWToken mtwToken;

    address deployer = makeAddr("deployer");
    address user1 = makeAddr("user1");
    address user2 = makeAddr("user2");
    address royaltyRecipient = makeAddr("royaltyRecipient");

    uint256 parcelId1 = 1;
    uint256 parcelId2 = 2;
    uint256 listingPrice = 1 ether;
    uint256 rentalPeriod = 30 days;

    function setUp() public {
        vm.startPrank(deployer);

        mtwToken = new MTWToken();
        landRegistry = new LandRegistry();
        adSpace = new AdSpace(address(landRegistry), address(mtwToken), royaltyRecipient);

        // Mint MTW tokens for users
        mtwToken.mint(user1, 10 ether);
        mtwToken.mint(user2, 10 ether);

        // Mint parcels for users
        landRegistry.mint(user1, parcelId1);
        landRegistry.mint(user2, parcelId2);

        vm.stopPrank();
    }

    function testListAdSpace() public {
        vm.startPrank(user1);
        landRegistry.approve(address(adSpace), parcelId1);
        mtwToken.approve(address(adSpace), listingPrice);
        adSpace.listAdSpace(parcelId1, listingPrice, rentalPeriod);
        vm.stopPrank();

        AdSpace.AdSpaceListing memory listing = adSpace.getListing(parcelId1);
        assertEq(listing.parcelId, parcelId1, "Parcel ID should match");
        assertEq(listing.seller, user1, "Seller should be user1");
        assertEq(listing.pricePerPeriod, listingPrice, "Price should match");
        assertEq(listing.rentalPeriod, rentalPeriod, "Rental period should match");
        assertEq(listing.isListed, true, "Should be listed");

        assertEq(landRegistry.ownerOf(parcelId1), address(adSpace), "AdSpace contract should own the parcel");
    }

    function testRevertListAdSpace_NotOwner() public {
        vm.startPrank(user2);
        vm.expectRevert("ERC721: approve caller is not owner nor approved for all");
        landRegistry.approve(address(adSpace), parcelId1);
        adSpace.listAdSpace(parcelId1, listingPrice, rentalPeriod);
        vm.stopPrank();
    }

    function testRevertListAdSpace_InsufficientAllowance() public {
        vm.startPrank(user1);
        landRegistry.approve(address(adSpace), parcelId1);
        // Do not approve MTWToken
        vm.expectRevert("ERC20: insufficient allowance");
        adSpace.listAdSpace(parcelId1, listingPrice, rentalPeriod);
        vm.stopPrank();
    }

    function testRentAdSpace() public {
        vm.startPrank(user1);
        landRegistry.approve(address(adSpace), parcelId1);
        mtwToken.approve(address(adSpace), listingPrice);
        adSpace.listAdSpace(parcelId1, listingPrice, rentalPeriod);
        vm.stopPrank();

        vm.startPrank(user2);
        mtwToken.approve(address(adSpace), listingPrice);
        adSpace.rentAdSpace(parcelId1);
        vm.stopPrank();

        AdSpace.AdSpaceListing memory listing = adSpace.getListing(parcelId1);
        assertEq(listing.renter, user2, "Renter should be user2");
        assertTrue(listing.rentedUntil > block.timestamp, "Rented until should be in the future");

        assertEq(mtwToken.balanceOf(user1), 10 ether + listingPrice, "Seller should receive payment");
        assertEq(mtwToken.balanceOf(user2), 10 ether - listingPrice, "Renter should pay");
    }

    function testRevertRentAdSpace_NotListed() public {
        vm.startPrank(user2);
        mtwToken.approve(address(adSpace), listingPrice);
        vm.expectRevert(abi.encodeWithSelector(AdSpace.AdSpace__NotListed.selector));
        adSpace.rentAdSpace(parcelId1);
        vm.stopPrank();
    }

    function testRevertRentAdSpace_AlreadyRented() public {
        vm.startPrank(user1);
        landRegistry.approve(address(adSpace), parcelId1);
        mtwToken.approve(address(adSpace), listingPrice);
        adSpace.listAdSpace(parcelId1, listingPrice, rentalPeriod);
        vm.stopPrank();

        vm.startPrank(user2);
        mtwToken.approve(address(adSpace), listingPrice);
        adSpace.rentAdSpace(parcelId1);
        vm.stopPrank();

        vm.startPrank(user1);
        vm.expectRevert(abi.encodeWithSelector(AdSpace.AdSpace__AlreadyRented.selector));
        adSpace.rentAdSpace(parcelId1);
        vm.stopPrank();
    }

    function testCancelListing() public {
        vm.startPrank(user1);
        landRegistry.approve(address(adSpace), parcelId1);
        mtwToken.approve(address(adSpace), listingPrice);
        adSpace.listAdSpace(parcelId1, listingPrice, rentalPeriod);
        adSpace.cancelListing(parcelId1);
        vm.stopPrank();

        AdSpace.AdSpaceListing memory listing = adSpace.getListing(parcelId1);
        assertEq(listing.isListed, false, "Should not be listed");
        assertEq(landRegistry.ownerOf(parcelId1), user1, "Seller should get parcel back");
    }

    function testRevertCancelListing_NotOwner() public {
        vm.startPrank(user1);
        landRegistry.approve(address(adSpace), parcelId1);
        mtwToken.approve(address(adSpace), listingPrice);
        adSpace.listAdSpace(parcelId1, listingPrice, rentalPeriod);
        vm.stopPrank();

        vm.startPrank(user2);
        vm.expectRevert(abi.encodeWithSelector(AdSpace.AdSpace__NotSeller.selector));
        adSpace.cancelListing(parcelId1);
        vm.stopPrank();
    }

    function testEndRental() public {
        vm.startPrank(user1);
        landRegistry.approve(address(adSpace), parcelId1);
        mtwToken.approve(address(adSpace), listingPrice);
        adSpace.listAdSpace(parcelId1, listingPrice, rentalPeriod);
        vm.stopPrank();

        vm.startPrank(user2);
        mtwToken.approve(address(adSpace), listingPrice);
        adSpace.rentAdSpace(parcelId1);
        vm.stopPrank();

        // Fast forward time to after rental period
        vm.warp(block.timestamp + rentalPeriod + 1);

        vm.startPrank(user1);
        adSpace.endRental(parcelId1);
        vm.stopPrank();

        AdSpace.AdSpaceListing memory listing = adSpace.getListing(parcelId1);
        assertEq(listing.renter, address(0), "Renter should be cleared");
        assertEq(listing.rentedUntil, 0, "Rented until should be cleared");
    }

    function testRevertEndRental_NotExpired() public {
        vm.startPrank(user1);
        landRegistry.approve(address(adSpace), parcelId1);
        mtwToken.approve(address(adSpace), listingPrice);
        adSpace.listAdSpace(parcelId1, listingPrice, rentalPeriod);
        vm.stopPrank();

        vm.startPrank(user2);
        mtwToken.approve(address(adSpace), listingPrice);
        adSpace.rentAdSpace(parcelId1);
        vm.stopPrank();

        vm.startPrank(user1);
        vm.expectRevert(abi.encodeWithSelector(AdSpace.AdSpace__RentalNotExpired.selector));
        adSpace.endRental(parcelId1);
        vm.stopPrank();
    }

    function testRevertEndRental_NotListed() public {
        vm.startPrank(user1);
        vm.expectRevert(abi.encodeWithSelector(AdSpace.AdSpace__NotListed.selector));
        adSpace.endRental(parcelId1);
        vm.stopPrank();
    }
}