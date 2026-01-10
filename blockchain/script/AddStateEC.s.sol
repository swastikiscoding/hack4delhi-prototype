// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "forge-std/Script.sol";
import "../src/UnifiedElectoralRoll.sol";

contract AddStateEC is Script {
    function run() external {
        address uer = vm.envAddress("UER_ADDRESS");
        address stateEC = vm.envAddress("STATE_EC");

        uint256 eciPk = vm.envUint("PRIVATE_KEY_ECI");

        vm.startBroadcast(eciPk);
        UnifiedElectoralRoll(uer).addStateAuthority(stateEC);
        vm.stopBroadcast();
    }
}
