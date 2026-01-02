// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "forge-std/Test.sol";
import "../src/UnifiedElectoralRoll.sol";

contract AuthorityHierarchyTest is Test {
    UnifiedElectoralRoll roll;

    address eci   = address(0xEC1);
    address state = address(0x100);
    address ero   = address(0x200);
    address blo   = address(0x300);

    function setUp() public {
        vm.prank(eci);
        roll = new UnifiedElectoralRoll();
    }

    function testECICanAddStateAuthority() public {
        vm.prank(eci);
        roll.addStateAuthority(state);

        assertTrue(roll.hasRole(roll.STATE_ROLE(), state));
    }

    function testStateCanAddEROAndBLO() public {
        // ECI adds State
        vm.prank(eci);
        roll.addStateAuthority(state);

        // State adds ERO + BLO
        vm.startPrank(state);
        roll.addERO(ero);
        roll.addBLO(blo);
        vm.stopPrank();

        // Role checks
        assertTrue(roll.hasRole(roll.ERO_ROLE(), ero));
        assertTrue(roll.hasRole(roll.BLO_ROLE(), blo));

        // Mapping checks
        address[] memory eros = roll.getEROsByState(state);
        address[] memory blos = roll.getBLOsByState(state);

        assertEq(eros.length, 1);
        assertEq(eros[0], ero);

        assertEq(blos.length, 1);
        assertEq(blos[0], blo);

        // Reverse mapping
        assertEq(roll.officerToState(ero), state);
        assertEq(roll.officerToState(blo), state);
    }

    function testNonECICannotAddState() public {
        vm.prank(state);
        vm.expectRevert();
        roll.addStateAuthority(address(0x999));
    }

    function testNonStateCannotAddERO() public {
        vm.expectRevert();
        roll.addERO(ero);
    }
}
