// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/UnifiedElectoralRoll.sol";

contract SetupUER is Script {
    function run() external {
        address uer = vm.envAddress("UER_ADDRESS");

        uint256 eciKey = vm.envUint("PRIVATE_KEY_ECI");
        uint256 stateKey = vm.envUint("PRIVATE_KEY_STATE");

        address stateAuth = vm.addr(stateKey);
        address ero = vm.addr(vm.envUint("PRIVATE_KEY_ERO"));
        address blo = vm.addr(vm.envUint("PRIVATE_KEY_BLO"));

        UnifiedElectoralRoll roll = UnifiedElectoralRoll(uer);

        // 1️⃣ ECI grants STATE_ROLE
        vm.startBroadcast(eciKey);
        roll.addStateAuthority(stateAuth);
        vm.stopBroadcast();

        // 2️⃣ STATE grants ERO + BLO
        vm.startBroadcast(stateKey);
        roll.addERO(ero);
        roll.addBLO(blo);
        vm.stopBroadcast();
    }
}
