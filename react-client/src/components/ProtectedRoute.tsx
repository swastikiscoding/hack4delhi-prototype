import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

import UnifiedElectoralRollABI from "@/abi/UnifiedElectoralRoll.json";
import { CONTRACT_ADDRESS, ROLE_IDS } from "@/config/blockchain";
import { ensureSepolia } from "@/lib/wallet";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type RoleKey = keyof typeof ROLE_IDS;

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  role: RoleKey;
  /** If true, require an explicit disconnect+reconnect flow before role check. */
  forceReconnect?: boolean;
}

type GuardStage =
  | "checkingConnection"
  | "needsConnection"
  | "needsReconnect"
  | "checkingRole"
  | "authorized"
  | "unauthorized"
  | "error";

export const RoleProtectedRoute = ({
  children,
  role,
  forceReconnect = false,
}: RoleProtectedRouteProps) => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<GuardStage>("checkingConnection");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // React 18 StrictMode runs effects twice in dev; this ref prevents double MetaMask prompts.
  const isCheckingRef = useRef(false);

  const roleId = useMemo(() => ROLE_IDS[role], [role]);

  const checkRole = useCallback(async () => {
    if (isCheckingRef.current) return;
    isCheckingRef.current = true;
    setErrorMessage("");
    setStage("checkingRole");

    try {
      if (!window.ethereum) {
        setStage("error");
        setErrorMessage("MetaMask is not installed.");

        return;
      }

      // Network switch can require user gesture; by this point we already have one.
      await ensureSepolia();

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        UnifiedElectoralRollABI,
        provider,
      );

      const hasRole = await contract.hasRole(roleId, userAddress);

      if (hasRole) {
        setStage("authorized");
      } else {
        setStage("unauthorized");
        navigate("/");
      }
    } catch (e: any) {
      console.error("Authorization check failed", e);
      setStage("error");
      setErrorMessage(
        e?.reason || e?.message || "Failed to verify wallet role",
      );
    } finally {
      isCheckingRef.current = false;
    }
  }, [navigate, roleId]);

  const connectAndCheck = useCallback(async () => {
    setErrorMessage("");
    try {
      if (!window.ethereum?.request) {
        setStage("error");
        setErrorMessage("MetaMask is not installed.");

        return;
      }

      setStage("checkingConnection");

      if (forceReconnect) {
        // Best-effort disconnect. MetaMask may prompt the user.
        try {
          await window.ethereum.request({
            method: "wallet_revokePermissions",
            params: [{ eth_accounts: {} }],
          });
        } catch (e) {
          // Some MetaMask versions don't support revoke; fall back to just requesting accounts.
          console.warn("wallet_revokePermissions failed/unsupported:", e);
        }
      }

      try {
        const accounts = (await window.ethereum.request({
          method: "eth_requestAccounts",
        })) as string[];

        // MetaMask allows selecting multiple accounts. For officer portals we
        // enforce exactly one to avoid ambiguity about which account has the role.
        if (!accounts || accounts.length !== 1) {
          setStage("needsReconnect");
          setErrorMessage(
            "MetaMask allowed multiple accounts to connect. Please select exactly ONE account in the MetaMask popup, then click again.",
          );

          return;
        }
      } catch (e: any) {
        if (e?.code === -32002) {
          setStage(forceReconnect ? "needsReconnect" : "needsConnection");
          setErrorMessage(
            "A MetaMask request is already pending. Open MetaMask and complete it, then click Connect again.",
          );

          return;
        }
        if (e?.code === 4001) {
          setStage(forceReconnect ? "needsReconnect" : "needsConnection");
          setErrorMessage("Connection request was rejected.");

          return;
        }
        throw e;
      }

      await checkRole();
    } catch (e: any) {
      console.error("Connect failed", e);
      setStage("error");
      setErrorMessage(e?.message || "Failed to connect wallet");
    }
  }, [checkRole]);

  useEffect(() => {
    // On mount: just detect whether we already have a connected account.
    const detectConnection = async () => {
      try {
        if (!window.ethereum?.request) {
          setStage("error");
          setErrorMessage("MetaMask is not installed.");

          return;
        }

        const accounts = (await window.ethereum.request({
          method: "eth_accounts",
        })) as string[];

        if (!accounts || accounts.length === 0) {
          setStage("needsConnection");

          return;
        }

        if (accounts.length !== 1) {
          setStage("needsReconnect");
          setErrorMessage(
            "Multiple MetaMask accounts are connected to this site. Disconnect & reconnect, selecting exactly ONE account.",
          );

          return;
        }

        if (forceReconnect) {
          setStage("needsReconnect");

          return;
        }

        await checkRole();
      } catch (e: any) {
        console.error("Wallet detection failed", e);
        setStage("error");
        setErrorMessage(e?.message || "Failed to detect wallet");
      }
    };

    void detectConnection();

    const handleAccountsChanged = (accounts: string[]) => {
      if (!accounts || accounts.length === 0) {
        setStage("needsConnection");
        navigate("/");

        return;
      }
      void checkRole();
    };

    const handleChainChanged = () => {
      void sleep(200).then(checkRole);
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged,
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [checkRole, navigate]);

  if (stage === "authorized") return <>{children}</>;

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center gap-4">
        <div className="text-xl font-bold">
          Connecting to Wallet & Verifying Access...
        </div>

        {stage === "needsConnection" ? (
          <button
            className="px-4 py-2 rounded-lg bg-primary text-white font-semibold"
            type="button"
            onClick={() => void connectAndCheck()}
          >
            Connect MetaMask
          </button>
        ) : null}

        {stage === "needsReconnect" ? (
          <button
            className="px-4 py-2 rounded-lg bg-primary text-white font-semibold"
            type="button"
            onClick={() => void connectAndCheck()}
          >
            Disconnect & Reconnect MetaMask
          </button>
        ) : null}

        {stage === "checkingRole" || stage === "checkingConnection" ? (
          <div className="text-sm text-default-500">Waiting for wallet…</div>
        ) : null}

        {stage === "error" || errorMessage ? (
          <div className="text-sm text-danger max-w-lg text-center">
            {errorMessage}
          </div>
        ) : null}
      </div>
    </div>
  );
};

// Back-compat: existing imports protect ECI routes.
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => (
  <RoleProtectedRoute role="ECI">{children}</RoleProtectedRoute>
);

export default ProtectedRoute;
