// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/UnifiedElectoralRoll.sol";

contract DeployUER_Extended is Script {
    function run() external {
        uint256 key = vm.envUint("PRIVATE_KEY_ECI");
        vm.startBroadcast(key);

        UnifiedElectoralRoll roll = new UnifiedElectoralRoll();

        vm.stopBroadcast();
    }
}
