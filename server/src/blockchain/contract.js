import { Contract } from "ethers";
import provider from "./provider.js";
import contractABI from "../abi/UnifiedElectoralRoll.json" with { type: "json" };

const contract = new Contract(
  process.env.CONTRACT_ADDRESS,
  contractABI,
  provider
);

export default contract;
