// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/UnifiedElectoralRoll.sol";

contract RegisterVoter is Script {
    function run() external {
        // Load deployed contract address
        address rollAddress = vm.envAddress("UER_ADDRESS");
        UnifiedElectoralRoll roll = UnifiedElectoralRoll(rollAddress);

        // Example EPIC hash (same logic frontend will use)
        bytes32 epicHash = keccak256("EPIC-INDIA-002");

        uint256 stateCode = 1;
        uint256 constituencyCode = 102;

        vm.startBroadcast();
        roll.registerVoter(epicHash, stateCode, constituencyCode);
        vm.stopBroadcast();
    }
}
