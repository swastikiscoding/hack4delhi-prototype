// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/UnifiedElectoralRoll.sol";

contract DeployUER is Script {
    function run() external returns (UnifiedElectoralRoll) {
        vm.startBroadcast();
        UnifiedElectoralRoll roll = new UnifiedElectoralRoll();
        vm.stopBroadcast();
        return roll;
    }
}
