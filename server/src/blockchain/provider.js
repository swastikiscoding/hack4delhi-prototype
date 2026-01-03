import {ethers} from "ethers";

export const provider = new ethers.JsonRpcProvider(
  process.env.ALCHEMY_RPC_URL
);


