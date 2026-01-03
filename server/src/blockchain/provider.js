import { JsonRpcProvider } from "ethers";

const provider = new JsonRpcProvider(process.env.ALCHEMY_RPC_URL);

export default provider;
