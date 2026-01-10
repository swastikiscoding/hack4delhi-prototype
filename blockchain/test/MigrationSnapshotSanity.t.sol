// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/UnifiedElectoralRoll.sol";

contract MigrationSnapshotSanity is Test {
    UnifiedElectoralRoll roll;

    address eci = address(1);
    address stateEC = address(2);
    address ero = address(3);

    bytes32 epic = keccak256("EPIC-SNAPSHOT");

    function setUp() public {
        // Deploy contract as ECI
        vm.prank(eci);
        roll = new UnifiedElectoralRoll();

        // Give State EC authority
        vm.prank(eci);
        roll.addStateAuthority(stateEC);

        // State assigns ERO
        vm.prank(stateEC);
        roll.addERO(ero);

        // Register voter using ERO
        vm.prank(ero);
        roll.registerVoter(epic, 29, 62);
    }

    function testSnapshotDoesNotChangeOnMigration() public {
        // Declare election
        vm.prank(eci);
        roll.declareElection(block.timestamp);

        // Take snapshot BEFORE migration
        vm.prank(eci);
        roll.snapshotVoter(epic);

        vm.prank(eci);
        roll.snapshotMigrationCount(29);

        // Migration after snapshot
        roll.requestMigration(epic, 30, 10);

        bool eligibleOld = roll.isEligibleToVote(epic, 29, 62);
        bool eligibleNew = roll.isEligibleToVote(epic, 30, 10);

        assertTrue(eligibleOld);
        assertFalse(eligibleNew);
    }
}
