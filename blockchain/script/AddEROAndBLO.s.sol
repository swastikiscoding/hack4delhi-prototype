// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "forge-std/Script.sol";
import "../src/UnifiedElectoralRoll.sol";

contract AddEROAndBLO is Script {
    function run() external {
        address uer = vm.envAddress("UER_ADDRESS");
        address ero = vm.envAddress("ERO");
        address blo = vm.envAddress("BLO");

        uint256 statePk = vm.envUint("PRIVATE_KEY_STATE");

        vm.startBroadcast(statePk);

        UnifiedElectoralRoll(uer).addERO(ero);
        UnifiedElectoralRoll(uer).addBLO(blo);

        vm.stopBroadcast();
    }
}
