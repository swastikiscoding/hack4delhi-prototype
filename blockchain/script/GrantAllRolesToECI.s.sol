// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/UnifiedElectoralRoll.sol";

contract GrantAllRolesToECI is Script {
    function run() external {
        address uer = vm.envAddress("UER_ADDRESS");
        address eci = vm.envAddress("ECI_ADDRESS");

        uint256 eciPk = vm.envUint("PRIVATE_KEY_ECI");

        vm.startBroadcast(eciPk);

        UnifiedElectoralRoll(uer).addStateAuthority(eci);
        UnifiedElectoralRoll(uer).addERO(eci);
        UnifiedElectoralRoll(uer).addBLO(eci);

        vm.stopBroadcast();
    }
}
