// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/MTWToken.sol";
import "../src/ZoningRegistry.sol";
import "../src/governance/MTWTimelock.sol";
import "../src/governance/MTWGovernor.sol";

contract GovernanceTest is Test {
    MTWToken public token;
    MTWTimelock public timelock;
    MTWGovernor public governor;
    ZoningRegistry public zoningRegistry;

    address public admin;
    address public voter;

    function setUp() public {
        admin = makeAddr("admin");
        voter = makeAddr("voter");

        vm.startPrank(admin);
        
        token = new MTWToken();
        
        address[] memory proposers = new address[](0);
        address[] memory executors = new address[](1);
        executors[0] = address(0);

        timelock = new MTWTimelock(1 days, proposers, executors, admin);
        governor = new MTWGovernor(token, timelock);

        timelock.grantRole(timelock.PROPOSER_ROLE(), address(governor));
        timelock.grantRole(timelock.EXECUTOR_ROLE(), address(0));
        
        zoningRegistry = new ZoningRegistry(address(timelock));
        
        // Give some tokens to voter and delegate
        token.transfer(voter, 50000000 * 10**token.decimals());
        
        vm.stopPrank();

        vm.prank(voter);
        token.delegate(voter);
    }

    function testGovernanceUpdateZoning() public {
        string memory regionId = "NYC";
        uint256 maxHeight = 500;
        string memory allowedUses = "Commercial";

        bytes memory callData = abi.encodeWithSelector(
            ZoningRegistry.updateZoningLaw.selector,
            regionId,
            maxHeight,
            allowedUses
        );

        address[] memory targets = new address[](1);
        targets[0] = address(zoningRegistry);
        uint256[] memory values = new uint256[](1);
        values[0] = 0;
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = callData;
        string memory description = "Update NYC zoning law";

        // 1. Propose
        vm.prank(voter);
        uint256 proposalId = governor.propose(targets, values, calldatas, description);

        uint256 delay = governor.votingDelay();
        vm.roll(block.number + delay + 1);

        // 2. Vote
        vm.prank(voter);
        governor.castVote(proposalId, 1); // 1 = For

        uint256 period = governor.votingPeriod();
        vm.roll(block.number + period + 1);

        // 3. Queue
        bytes32 descriptionHash = keccak256(abi.encodePacked(description));
        governor.queue(targets, values, calldatas, descriptionHash);

        uint256 minDelay = timelock.getMinDelay();
        vm.warp(block.timestamp + minDelay + 1);

        // 4. Execute
        governor.execute(targets, values, calldatas, descriptionHash);

        (uint256 height, string memory uses) = zoningRegistry.getZoningLaw(regionId);
        assertEq(height, maxHeight);
        assertEq(uses, allowedUses);
    }
}
