// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/UnifiedElectoralRoll.sol";

contract RequestMigration is Script {
    function run() external {
        address rollAddress = vm.envAddress("UER_ADDRESS");
        UnifiedElectoralRoll roll = UnifiedElectoralRoll(rollAddress);

        // Same EPIC used during registration
        bytes32 epicHash = keccak256("EPIC-INDIA-002");

        uint256 newStateCode = 2;
        uint256 newConstituencyCode = 201;

        vm.startBroadcast();
        roll.requestMigration(epicHash, newStateCode, newConstituencyCode);
        vm.stopBroadcast();
    }
}
