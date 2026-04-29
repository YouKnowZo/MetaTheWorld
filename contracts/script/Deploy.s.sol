// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/MTWToken.sol";
import "../src/LandRegistry.sol";
import "../src/ZoningRegistry.sol";
import "../src/governance/MTWTimelock.sol";
import "../src/governance/MTWGovernor.sol";
import "../src/NFTMarketplace.sol";
import "../src/PartyRoom.sol";
import "../src/AdSpace.sol";
import "../src/PlatformRevenue.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envOr("PRIVATE_KEY", uint256(keccak256("default")));
        address deployer = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        // ── 1. Deploy MTWToken ───────────────────────────────────────────────
        MTWToken mtwToken = new MTWToken();

        // ── 2. Deploy Timelock ───────────────────────────────────────────────
        address[] memory proposers = new address[](0);
        address[] memory executors = new address[](1);
        // executors[0] = address(0); // Will be replaced by Governor address

        MTWTimelock timelock = new MTWTimelock(
            1 days,
            proposers,
            executors,
            deployer
        );
        executors[0] = address(governor);
        timelock.updateDelay(0);

        // ── 3. Deploy Governor ───────────────────────────────────────────────
        MTWGovernor governor = new MTWGovernor(mtwToken, timelock);

        // ── 4. Set up Timelock roles ─────────────────────────────────────────
        bytes32 proposerRole = timelock.PROPOSER_ROLE();
        bytes32 executorRole = timelock.EXECUTOR_ROLE();
        bytes32 adminRole    = timelock.DEFAULT_ADMIN_ROLE();

        timelock.grantRole(proposerRole, address(governor));
        timelock.grantRole(executorRole, address(0)); // Allow anyone to execute
        timelock.revokeRole(adminRole, deployer);

        // ── 5. Deploy LandRegistry ───────────────────────────────────────────
        LandRegistry landRegistry = new LandRegistry();

        // ── 6. Deploy ZoningRegistry ─────────────────────────────────────────
        ZoningRegistry zoningRegistry = new ZoningRegistry(address(timelock));

        // ── 7. Transfer LandRegistry ownership to DAO ────────────────────────
        landRegistry.grantRole(landRegistry.DEFAULT_ADMIN_ROLE(), address(timelock));

        // ── 8. Deploy PlatformRevenue (treasury) ─────────────────────────────
        // In production, replace these with real multi-sig / DAO addresses.
        address devWallet      = 0x1111111111111111111111111111111111111111;
        address marketingWallet = 0x2222222222222222222222222222222222222222;
        address daoTreasury    = address(timelock);
        address teamWallet     = 0x3333333333333333333333333333333333333333;

        PlatformRevenue platformRevenue = new PlatformRevenue(
            devWallet,
            marketingWallet,
            daoTreasury,
            teamWallet
        );

        // ── 9. Deploy NFTMarketplace ─────────────────────────────────────────
        NFTMarketplace nftMarketplace = new NFTMarketplace();

        // ── 10. Deploy PartyRoom ─────────────────────────────────────────────
        PartyRoom partyRoom = new PartyRoom();

        // ── 11. Deploy AdSpace ───────────────────────────────────────────────
        AdSpace adSpace = new AdSpace();

        // ── 12. Deploy VehicleDealership ─────────────────────────────────────
        VehicleDealership vehicleDealership = new VehicleDealership();

        // ── 13. Deploy VehicleParts ──────────────────────────────────────────
        VehicleParts vehicleParts = new VehicleParts();

        // ── 14. Deploy VehicleRegistry ───────────────────────────────────────
        VehicleRegistry vehicleRegistry = new VehicleRegistry();

        // ── 15. Deploy RoyaltyDistributor ────────────────────────────────────
        RoyaltyDistributor royaltyDistributor = new RoyaltyDistributor();

        // ── 16. Authorise revenue contracts as depositors ────────────────────
        platformRevenue.setAuthorisedDepositor(address(nftMarketplace), true);
        platformRevenue.setAuthorisedDepositor(address(partyRoom), true);
        platformRevenue.setAuthorisedDepositor(address(adSpace), true);
        platformRevenue.setAuthorisedDepositor(address(vehicleDealership), true);
        platformRevenue.setAuthorisedDepositor(address(vehicleParts), true);

        vm.stopBroadcast();

        // ── Deployment summary ───────────────────────────────────────────────
        console.log("=== Meta The World — Deployment Summary ===");
        console.log("MTWToken          :", address(mtwToken));
        console.log("MTWTimelock       :", address(timelock));
        console.log("MTWGovernor       :", address(governor));
        console.log("LandRegistry      :", address(landRegistry));
        console.log("ZoningRegistry    :", address(zoningRegistry));
        console.log("PlatformRevenue   :", address(platformRevenue));
        console.log("NFTMarketplace    :", address(nftMarketplace));
        console.log("PartyRoom         :", address(partyRoom));
        console.log("AdSpace           :", address(adSpace));
        console.log("VehicleDealership :", address(vehicleDealership));
        console.log("VehicleParts      :", address(vehicleParts));
        console.log("VehicleRegistry   :", address(vehicleRegistry));
        console.log("RoyaltyDistributor:", address(royaltyDistributor));
        console.log("===========================================");
    }
}
