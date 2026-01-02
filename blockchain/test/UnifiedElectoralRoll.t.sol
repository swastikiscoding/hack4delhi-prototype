// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "forge-std/Test.sol";
import "../src/UnifiedElectoralRoll.sol";

contract UnifiedElectoralRollTest is Test {
    UnifiedElectoralRoll roll;

    address eci   = address(0xEC1);
    address state = address(0x100);
    address ero   = address(0x200);
    address blo   = address(0x300);

    bytes32 epic = keccak256("EPIC-INDIA-001");

    function setUp() public {
        // Deploy as ECI
        vm.prank(eci);
        roll = new UnifiedElectoralRoll();

        // Setup governance
        vm.prank(eci);
        roll.addStateAuthority(state);

        vm.startPrank(state);
        roll.addERO(ero);
        roll.addBLO(blo);
        vm.stopPrank();
    }

    function testDuplicateRegistrationFails() public {
        vm.prank(ero);
        roll.registerVoter(epic, 1, 101);

        vm.prank(ero);
        vm.expectRevert("Already registered");
        roll.registerVoter(epic, 1, 101);
    }

    function testOnlyBLOCanVerify() public {
        vm.prank(ero);
        roll.registerVoter(epic, 1, 101);

        vm.prank(ero);
        roll.requestMigration(epic, 2, 201);

        vm.prank(ero);
        vm.expectRevert();
        roll.verifyByBLO(epic);
    }

    function testCannotApproveWithoutBLOVerification() public {
        vm.prank(ero);
        roll.registerVoter(epic, 1, 101);

        vm.prank(ero);
        roll.requestMigration(epic, 2, 201);

        vm.prank(ero);
        vm.expectRevert("BLO not verified");
        roll.approveMigration(epic);
    }

    function testMigrationHappyPath() public {
        vm.prank(ero);
        roll.registerVoter(epic, 1, 101);

        vm.prank(ero);
        roll.requestMigration(epic, 2, 201);

        vm.prank(blo);
        roll.verifyByBLO(epic);

        vm.prank(ero);
        roll.approveMigration(epic);

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

    function testRejectionFlowRestoresActiveState() public {
        vm.prank(ero);
        roll.registerVoter(epic, 1, 101);

        vm.prank(ero);
        roll.requestMigration(epic, 2, 201);

        vm.prank(blo);
        roll.verifyByBLO(epic);

        vm.prank(ero);
        roll.rejectMigration(epic);

        (, , UnifiedElectoralRoll.Status status,,) = roll.getVoter(epic);
        assertEq(uint8(status), uint8(UnifiedElectoralRoll.Status.ACTIVE));
    }
}
