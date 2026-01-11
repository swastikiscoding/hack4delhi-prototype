import { ethers } from "ethers";

export const CONTRACT_ADDRESS = "0x7e336F90F55330631767D398b8efaF84A70E2FaF";

export const SEPOLIA_CHAIN_ID_HEX = "0xaa36a7";

export const ROLE_IDS = {
  ECI: ethers.id("ECI_ROLE"),
  STATE: ethers.id("STATE_ROLE"),
  ERO: ethers.id("ERO_ROLE"),
  BLO: ethers.id("BLO_ROLE"),
} as const;
