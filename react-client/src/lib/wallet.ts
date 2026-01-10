import { ethers } from "ethers";

import { SEPOLIA_CHAIN_ID_HEX } from "@/config/blockchain";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const requireMetaMask = () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }
};

export const ensureConnectedAccount = async () => {
  requireMetaMask();

  let accounts = (await window.ethereum.request({
    method: "eth_accounts",
  })) as string[];

  if (!accounts || accounts.length === 0) {
    accounts = (await window.ethereum.request({
      method: "eth_requestAccounts",
    })) as string[];
  }

  if (!accounts || accounts.length === 0) {
    throw new Error("No MetaMask account connected");
  }

  return accounts[0];
};

export const ensureSepolia = async () => {
  requireMetaMask();

  const getChainIdHex = async () => {
    return (await window.ethereum.request({ method: "eth_chainId" })) as string;
  };

  const chainIdHex = await getChainIdHex();

  if (chainIdHex?.toLowerCase() === SEPOLIA_CHAIN_ID_HEX) return;

  await window.ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
  });

  for (let attempt = 0; attempt < 20; attempt++) {
    const newChainIdHex = await getChainIdHex();

    if (newChainIdHex?.toLowerCase() === SEPOLIA_CHAIN_ID_HEX) return;
    await sleep(150);
  }

  throw new Error("Timed out waiting for Sepolia network switch");
};

export const getBrowserProvider = async () => {
  requireMetaMask();
  await ensureConnectedAccount();
  await ensureSepolia();

  return new ethers.BrowserProvider(window.ethereum);
};

export const getSignerAddress = async () => {
  const provider = await getBrowserProvider();
  const signer = await provider.getSigner();

  return signer.getAddress();
};
