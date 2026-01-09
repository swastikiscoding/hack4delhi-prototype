import { ethers } from "ethers";

export const CONTRACT_ADDRESS =
  "0xa394e56d184a5f9FdCe0cE2fe7341e0E9de9560E";

export const SEPOLIA_CHAIN_ID_HEX = "0xaa36a7";

export const ROLE_IDS = {
  ECI: ethers.id("ECI_ROLE"),
  STATE: ethers.id("STATE_ROLE"),
  ERO: ethers.id("ERO_ROLE"),
  BLO: ethers.id("BLO_ROLE"),
} as const;
