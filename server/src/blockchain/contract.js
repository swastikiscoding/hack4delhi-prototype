import { Contract } from "ethers";
import provider from "./provider.js";
import contractABI from "../abi/UnifiedElectoralRoll.json" with { type: "json" };

const getContract = () => {
  const address = process.env.CONTRACT_ADDRESS;

  if (!address) {
    throw new Error(
      "CONTRACT_ADDRESS is not set (required to use blockchain endpoints)"
    );
  }

  return new Contract(address, contractABI, provider);
};

export default getContract;
