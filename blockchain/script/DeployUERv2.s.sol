// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/UnifiedElectoralRoll.sol";

contract DeployUERv2 is Script {
    function run() external returns (UnifiedElectoralRoll) {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY_ECI");

        vm.startBroadcast(deployerKey);

        UnifiedElectoralRoll roll = new UnifiedElectoralRoll();

        vm.stopBroadcast();

        return roll;
    }
}
