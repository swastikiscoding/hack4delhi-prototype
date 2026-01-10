// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "forge-std/Script.sol";
import "../src/UnifiedElectoralRoll.sol";

contract RegisterVoter is Script {
    function run() external {
        address uer = vm.envAddress("UER_ADDRESS");
        uint256 eroPk = vm.envUint("PRIVATE_KEY_ERO");

        bytes32 epicHash = keccak256("RQZ1655331");

        vm.startBroadcast(eroPk);

        UnifiedElectoralRoll(uer).registerVoter(
            epicHash,
            29, // Rajasthan
            62  // Behror
        );

        vm.stopBroadcast();
    }
}
