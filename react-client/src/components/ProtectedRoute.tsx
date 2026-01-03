import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

import UnifiedElectoralRollABI from "../abi/UnifiedElectoralRoll.json";

const CONTRACT_ADDRESS = "0xa394e56d184a5f9FdCe0cE2fe7341e0E9de9560E";
const ECI_ROLE = ethers.id("ECI_ROLE");
const SEPOLIA_CHAIN_ID_HEX = "0xaa36a7";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let mounted = true;

    let isChecking = false;

    const getChainIdHex = async () => {
      return (await window.ethereum.request({ method: "eth_chainId" })) as string;
    };

    const ensureSepolia = async () => {
      const chainIdHex = await getChainIdHex();

      if (chainIdHex?.toLowerCase() === SEPOLIA_CHAIN_ID_HEX) return;

      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
      });

      // Wait for MetaMask to actually finish switching chains.
      for (let attempt = 0; attempt < 20; attempt++) {
        const newChainIdHex = await getChainIdHex();
        if (newChainIdHex?.toLowerCase() === SEPOLIA_CHAIN_ID_HEX) return;
        await sleep(150);
      }

      throw new Error("Timed out waiting for Sepolia network switch");
    };

    const checkAuth = async () => {
      if (isChecking) return;
      isChecking = true;

      try {
        if (!window.ethereum) {
          console.error("MetaMask not installed");
          alert("Please install MetaMask to access this page.");
          if (mounted) navigate("/");

          return;
        }

        // 1) Ensure we are connected (persisted connections show up here)
        let accounts = (await window.ethereum.request({
          method: "eth_accounts",
        })) as string[];

        if (!accounts || accounts.length === 0) {
          try {
            accounts = (await window.ethereum.request({
              method: "eth_requestAccounts",
            })) as string[];
          } catch (error) {
            console.error("User rejected connection", error);
            if (mounted) navigate("/");
            return;
          }
        }

        // 2) Ensure Sepolia (switch + wait). Chain changes often emit events; do NOT reload.
        try {
          await ensureSepolia();
        } catch (switchError: any) {
          console.error("Failed to switch network", switchError);
          if (switchError?.code === 4902) {
            alert("Please add Sepolia Testnet to your MetaMask.");
          } else {
            alert("Please switch to Sepolia Testnet.");
          }
          if (mounted) navigate("/");
          return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);

        // MetaMask may briefly return stale accounts during chain switches; prefer getSigner.
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();

        console.log("Checking role for:", userAddress);

        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          UnifiedElectoralRollABI,
          provider,
        );

        const hasRole = await contract.hasRole(ECI_ROLE, userAddress);

        console.log("Has ECI_ROLE:", hasRole);

        if (mounted) {
          if (hasRole) {
            setIsAuthorized(true);
          } else {
            console.error("User does not have ECI_ROLE");
            alert(
              "Access Denied: Your account is not authorized as an ECI official.",
            );
            navigate("/");
          }
        }
      } catch (error) {
        console.error("Error checking authorization:", error);
        if (mounted) navigate("/");
      } finally {
        if (mounted) setIsLoading(false);
        isChecking = false;
      }
    };

    checkAuth();

    // Listen for account/network changes without reloading (reload causes flapping)
    const handleAccountsChanged = (accounts: string[]) => {
      if (!mounted) return;
      setIsAuthorized(false);
      setIsLoading(true);

      if (!accounts || accounts.length === 0) {
        navigate("/");
        return;
      }

      // Re-check authorization for the new account.
      void checkAuth();
    };

    const handleChainChanged = (_chainId: string) => {
      if (!mounted) return;
      setIsAuthorized(false);
      setIsLoading(true);
      // Give MetaMask a moment to settle before re-check.
      void sleep(200).then(checkAuth);
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }

    return () => {
      mounted = false;
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged,
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-bold">
          Connecting to Wallet & Verifying Access...
        </div>
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
};

export default ProtectedRoute;
