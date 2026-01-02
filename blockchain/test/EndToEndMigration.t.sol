// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "forge-std/Test.sol";
import "../src/UnifiedElectoralRoll.sol";

contract EndToEndMigrationTest is Test {
    UnifiedElectoralRoll roll;

    address eci   = address(0xEC1);
    address state = address(0x100);
    address ero   = address(0x200);
    address blo   = address(0x300);

    bytes32 epic = keccak256("EPIC-INDIA-002");

    function setUp() public {
        // Deploy as ECI
        vm.prank(eci);
        roll = new UnifiedElectoralRoll();

        // Governance setup
        vm.prank(eci);
        roll.addStateAuthority(state);

        vm.startPrank(state);
        roll.addERO(ero);
        roll.addBLO(blo);
        vm.stopPrank();
    }

    function testCompleteMigrationFlow() public {
        // ERO registers voter
        vm.prank(ero);
        roll.registerVoter(epic, 1, 101);

        // Voter requests migration (handled by ERO in prototype)
        vm.prank(ero);
        roll.requestMigration(epic, 2, 201);

        // BLO verifies
        vm.prank(blo);
        roll.verifyByBLO(epic);

        // ERO approves
        vm.prank(ero);
        roll.approveMigration(epic);

        // Final assertions
        (
            uint256 stateCode,
            uint256 constituency,
            UnifiedElectoralRoll.Status status,
            ,
            address approvedBy
        ) = roll.getVoter(epic);

        assertEq(stateCode, 2);
        assertEq(constituency, 201);
        assertEq(uint8(status), uint8(UnifiedElectoralRoll.Status.ACTIVE));
        assertEq(approvedBy, ero);
    }
}
