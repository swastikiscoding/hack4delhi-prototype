import { keccak256, toUtf8Bytes } from "ethers";

export const ECI_ROLE   = keccak256(toUtf8Bytes("ECI_ROLE"));
export const STATE_ROLE = keccak256(toUtf8Bytes("STATE_ROLE"));
export const ERO_ROLE   = keccak256(toUtf8Bytes("ERO_ROLE"));
export const BLO_ROLE   = keccak256(toUtf8Bytes("BLO_ROLE"));
