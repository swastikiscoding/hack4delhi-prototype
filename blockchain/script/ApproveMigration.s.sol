// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/UnifiedElectoralRoll.sol";

contract ApproveMigration is Script {
    function run() external {
        address rollAddress = vm.envAddress("UER_ADDRESS");
        UnifiedElectoralRoll roll = UnifiedElectoralRoll(rollAddress);

        bytes32 epicHash = keccak256("EPIC-INDIA-002");
        uint256 eroKey = vm.envUint("PRIVATE_KEY_ERO");

        vm.startBroadcast(eroKey);
        roll.approveMigration(epicHash);
        vm.stopBroadcast();
    }
}
