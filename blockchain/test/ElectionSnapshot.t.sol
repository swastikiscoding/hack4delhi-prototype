// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/UnifiedElectoralRoll.sol";

contract ElectionSnapshotTest is Test {
    UnifiedElectoralRoll roll;

    address eci = address(1);
    address stateEC = address(2);
    address ero = address(3);

    bytes32 epic = keccak256("EPIC-ELECTION");

    function setUp() public {
        // Deploy contract as ECI
        vm.prank(eci);
        roll = new UnifiedElectoralRoll();

        // Add State EC
        vm.prank(eci);
        roll.addStateAuthority(stateEC);

        // State assigns ERO
        vm.prank(stateEC);
        roll.addERO(ero);

        // Register voter using ERO
        vm.prank(ero);
        roll.registerVoter(epic, 29, 62);
    }

    function testElectionSnapshotPreventsVoteManipulation() public {
        // Declare election
        vm.prank(eci);
        roll.declareElection(block.timestamp);

        // Take snapshot
        vm.prank(eci);
        roll.snapshotVoter(epic);

        // Attempt migration after snapshot
        roll.requestMigration(epic, 30, 10);

        bool canVoteOld = roll.isEligibleToVote(epic, 29, 62);
        bool canVoteNew = roll.isEligibleToVote(epic, 30, 10);

        assertTrue(canVoteOld);
        assertFalse(canVoteNew);
    }
}
