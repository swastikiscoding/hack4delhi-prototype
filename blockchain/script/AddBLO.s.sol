// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/UnifiedElectoralRoll.sol";

contract AddBLO is Script {
    function run() external {
        address uer = vm.envAddress("UER_ADDRESS");
        address blo = vm.envAddress("BLO_ADDRESS");

        uint256 statePk = vm.envUint("PRIVATE_KEY_STATE");

        vm.startBroadcast(statePk);
        UnifiedElectoralRoll(uer).addBLO(blo);
        vm.stopBroadcast();
    }
}
