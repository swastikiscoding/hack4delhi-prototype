// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/UnifiedElectoralRoll.sol";

contract VerifyByBLO is Script {
    function run() external {
        address rollAddress = vm.envAddress("UER_ADDRESS");
        UnifiedElectoralRoll roll = UnifiedElectoralRoll(rollAddress);

        // Same EPIC used earlier
        bytes32 epicHash = keccak256("EPIC-INDIA-002");

        uint256 bloKey = vm.envUint("PRIVATE_KEY_BLO");

        vm.startBroadcast(bloKey);
        roll.verifyByBLO(epicHash);
        vm.stopBroadcast();
    }
}
