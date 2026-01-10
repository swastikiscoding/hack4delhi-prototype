import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Spinner } from "@heroui/spinner";

import { ThemeSwitch } from "@/components/theme-switch";
import { CONTRACT_ADDRESS, ROLE_IDS } from "@/config/blockchain";
import { getBrowserProvider } from "@/lib/wallet";
import { api } from "@/lib/api";
import ABI from "@/abi/UnifiedElectoralRoll.json";

// State code mapping
const STATE_CODES: Record<string, string> = {
  Delhi: "DL",
  Maharashtra: "MH",
  Karnataka: "KA",
  "Tamil Nadu": "TN",
  "Uttar Pradesh": "UP",
  "West Bengal": "WB",
  Gujarat: "GJ",
  Rajasthan: "RJ",
  Kerala: "KL",
  Punjab: "PB",
};

interface Officer {
  walletAddress: string;
  name: string;
  constituencyCode: string;
  constituencyName: string;
  createdAt: string;
  status: string;
  txHash?: string;
}

interface Stats {
  eroCount: number;
  bloCount: number;
  chainEroCount: number;
  chainBloCount: number;
  activeConstituencies: number;
}

export default function StateEcDashboard() {
  const navigate = useNavigate();

  // Wallet & auth state
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stateName, setStateName] = useState<string>("State");

  // Data state
  const [eros, setEros] = useState<Officer[]>([]);
  const [blos, setBlos] = useState<Officer[]>([]);
  const [stats, setStats] = useState<Stats>({
    eroCount: 0,
    bloCount: 0,
    chainEroCount: 0,
    chainBloCount: 0,
    activeConstituencies: 0,
  });

  // UI state
  const [activeTab, setActiveTab] = useState<"eros" | "blos">("eros");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Form state for adding officer
  const [newOfficerAddress, setNewOfficerAddress] = useState("");
  const [newOfficerName, setNewOfficerName] = useState("");
  const [newOfficerConstituencyCode, setNewOfficerConstituencyCode] =
    useState("");
  const [newOfficerConstituencyName, setNewOfficerConstituencyName] =
    useState("");

  // Initialize wallet and check authorization
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        const provider = await getBrowserProvider();
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        setWalletAddress(address);

        // Check if user has STATE_ROLE on-chain
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
        const hasStateRole = await contract.hasRole(ROLE_IDS.STATE, address);

        setIsAuthorized(hasStateRole);

        if (hasStateRole) {
          // Try to get state info from backend
          try {
            const response = await api.get(`/state-ec/officer/${address}`);

            if (response.data?.data?.state) {
              setStateName(response.data.data.state);
            }
          } catch {
            // State info not in DB yet, use default
            setStateName("Delhi"); // Default for demo
          }
        }
      } catch (error) {
        console.error("Initialization error:", error);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  // Fetch officers and stats when authorized
  const fetchData = useCallback(async () => {
    if (!walletAddress || !isAuthorized) return;

    try {
      // Fetch EROs and BLOs from blockchain
      const provider = await getBrowserProvider();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

      const [chainEros, chainBlos] = await Promise.all([
        contract.getEROsByState(walletAddress),
        contract.getBLOsByState(walletAddress),
      ]);

      // Fetch metadata from backend
      const [erosResponse, blosResponse, statsResponse] = await Promise.all([
        api
          .get(`/state-ec/officers/${walletAddress}?role=ERO`)
          .catch(() => ({ data: { data: { officers: [] } } })),
        api
          .get(`/state-ec/officers/${walletAddress}?role=BLO`)
          .catch(() => ({ data: { data: { officers: [] } } })),
        api
          .get(`/state-ec/stats/${walletAddress}`)
          .catch(() => ({ data: { data: null } })),
      ]);

      // Merge chain data with database metadata
      const eroList: Officer[] = chainEros.map((addr: string) => {
        const metadata = erosResponse.data?.data?.officers?.find(
          (o: Officer) => o.walletAddress.toLowerCase() === addr.toLowerCase(),
        );

        return {
          walletAddress: addr,
          name: metadata?.name || "",
          constituencyCode: metadata?.constituencyCode || "",
          constituencyName: metadata?.constituencyName || "",
          createdAt: metadata?.createdAt || new Date().toISOString(),
          status: "ACTIVE",
          txHash: metadata?.txHash,
        };
      });

      const bloList: Officer[] = chainBlos.map((addr: string) => {
        const metadata = blosResponse.data?.data?.officers?.find(
          (o: Officer) => o.walletAddress.toLowerCase() === addr.toLowerCase(),
        );

        return {
          walletAddress: addr,
          name: metadata?.name || "",
          constituencyCode: metadata?.constituencyCode || "",
          constituencyName: metadata?.constituencyName || "",
          createdAt: metadata?.createdAt || new Date().toISOString(),
          status: "ACTIVE",
          txHash: metadata?.txHash,
        };
      });

      setEros(eroList);
      setBlos(bloList);

      if (statsResponse.data?.data) {
        setStats(statsResponse.data.data);
      } else {
        setStats({
          eroCount: eroList.length,
          bloCount: bloList.length,
          chainEroCount: chainEros.length,
          chainBloCount: chainBlos.length,
          activeConstituencies: new Set(
            eroList.map((e) => e.constituencyCode).filter(Boolean),
          ).size,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [walletAddress, isAuthorized]);

  useEffect(() => {
    if (isAuthorized && walletAddress) {
      fetchData();
    }
  }, [isAuthorized, walletAddress, fetchData]);

  // Add new officer (ERO or BLO)
  const handleAddOfficer = async () => {
    if (!newOfficerAddress || !ethers.isAddress(newOfficerAddress)) {
      setFeedback({
        type: "error",
        message: "Please enter a valid wallet address",
      });

      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const provider = await getBrowserProvider();
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      // Call the appropriate contract function
      const tx =
        activeTab === "eros"
          ? await contract.addERO(newOfficerAddress)
          : await contract.addBLO(newOfficerAddress);

      setFeedback({
        type: "success",
        message: "Transaction submitted. Waiting for confirmation...",
      });

      await tx.wait();

      // Save metadata to backend
      try {
        await api.post("/state-ec/officer", {
          walletAddress: newOfficerAddress,
          role: activeTab === "eros" ? "ERO" : "BLO",
          name: newOfficerName,
          state: stateName,
          constituencyCode: newOfficerConstituencyCode,
          constituencyName: newOfficerConstituencyName,
          addedBy: walletAddress,
          txHash: tx.hash,
        });
      } catch (apiError) {
        console.warn("Failed to save metadata to backend:", apiError);
      }

      setFeedback({
        type: "success",
        message: `${activeTab === "eros" ? "ERO" : "BLO"} added successfully! Tx: ${tx.hash.slice(0, 10)}...`,
      });

      // Reset form and close modal
      setNewOfficerAddress("");
      setNewOfficerName("");
      setNewOfficerConstituencyCode("");
      setNewOfficerConstituencyName("");
      setIsAddModalOpen(false);

      // Refresh data
      await fetchData();
    } catch (error: any) {
      console.error("Error adding officer:", error);
      let errorMessage = "Failed to add officer";

      if (error.reason) {
        errorMessage = error.reason;
      } else if (error.message?.includes("Already ERO")) {
        errorMessage = "This address is already an ERO";
      } else if (error.message?.includes("Already BLO")) {
        errorMessage = "This address is already a BLO";
      } else if (error.message?.includes("user rejected")) {
        errorMessage = "Transaction was rejected";
      }

      setFeedback({ type: "error", message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      if (window.ethereum?.request) {
        await window.ethereum.request({
          method: "wallet_revokePermissions",
          params: [{ eth_accounts: {} }],
        });
      }
    } catch (error) {
      console.warn("wallet_revokePermissions failed/unsupported:", error);
    } finally {
      navigate("/");
    }
  };

  const currentData = activeTab === "eros" ? eros : blos;
  const filteredData = currentData.filter(
    (item) =>
      item.walletAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.constituencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const stateCode =
    STATE_CODES[stateName] || stateName.slice(0, 2).toUpperCase();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Spinner color="warning" size="lg" />
          <p className="text-default-500">Connecting to wallet...</p>
        </div>
      </div>
    );
  }

  // Unauthorized state
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 flex items-center justify-center">
        <Card className="max-w-md">
          <CardBody className="text-center space-y-4 p-8">
            <div className="p-4 bg-danger/10 rounded-full w-fit mx-auto">
              <svg
                className="w-12 h-12 text-danger"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-foreground">Access Denied</h2>
            <p className="text-default-500">
              Your wallet (
              {walletAddress
                ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                : "Not connected"}
              ) does not have State EC authority.
            </p>
            <p className="text-sm text-default-400">
              Contact the Election Commission of India to get authorized.
            </p>
            <Button color="primary" onPress={() => navigate("/")}>
              Go Back Home
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 font-sans text-foreground">
      {/* 1. Top Header / Authority Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-default-200 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning/10 rounded-lg text-warning">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold leading-tight">
                State Election Commission
              </h1>
              <p className="text-xs text-default-500">
                Dashboard & Officer Oversight
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-default-100 rounded-full border border-default-200">
            <svg
              className="w-4 h-4 text-default-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span className="text-xs font-medium text-default-600">
              State EC actions are cryptographically signed and auditable.
            </span>
          </div>

          <div className="flex items-center gap-4">
            <ThemeSwitch />
            <Chip
              className="uppercase font-bold text-xs"
              color="warning"
              size="sm"
              variant="flat"
            >
              Sepolia Testnet
            </Chip>
            <Chip className="pl-2" color="danger" size="sm" variant="dot">
              State EC
            </Chip>
            <Button
              color="danger"
              size="sm"
              variant="light"
              onPress={handleDisconnect}
            >
              Disconnect
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-6 py-8 space-y-8">
        {/* 2. State Identity & Authorization Card */}
        <Card className="w-full bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10 border-l-4 border-orange-500 shadow-sm">
          <CardBody className="flex flex-col md:flex-row justify-between items-center gap-6 p-6">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-white dark:bg-orange-950 rounded-full shadow-sm border border-orange-200 dark:border-orange-800">
                <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {stateCode}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-bold text-foreground">
                    {stateName} ({stateCode})
                  </h2>
                  <Chip
                    className="uppercase font-bold"
                    color="success"
                    size="sm"
                    variant="flat"
                  >
                    Authorized
                  </Chip>
                </div>
                <p className="text-sm text-default-600">
                  Authority granted by Election Commission of India
                </p>
                <div className="flex gap-4 mt-2 text-xs text-default-500 font-mono">
                  <span>
                    Wallet: {walletAddress.slice(0, 6)}...
                    {walletAddress.slice(-4)}
                  </span>
                  <span>
                    Chain EROs: {stats.chainEroCount} | BLOs:{" "}
                    {stats.chainBloCount}
                  </span>
                </div>
              </div>
            </div>
            <Button
              className="font-medium"
              color="warning"
              variant="bordered"
              onPress={() =>
                window.open(
                  `https://sepolia.etherscan.io/address/${walletAddress}`,
                  "_blank",
                )
              }
            >
              View on Etherscan
            </Button>
          </CardBody>
        </Card>

        {/* 3. Metrics Summary Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border border-default-200 shadow-sm">
            <CardBody className="p-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-default-500">
                  Total EROs
                </p>
                <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  On-chain: {stats.chainEroCount}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-foreground">
                {stats.eroCount}
              </h3>
            </CardBody>
          </Card>
          <Card className="border border-default-200 shadow-sm">
            <CardBody className="p-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-default-500">
                  Total BLOs
                </p>
                <span className="text-xs font-medium text-default-500">
                  On-chain: {stats.chainBloCount}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-foreground">
                {stats.bloCount}
              </h3>
            </CardBody>
          </Card>
          <Card className="border border-default-200 shadow-sm">
            <CardBody className="p-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-default-500">
                  Active Constituencies
                </p>
                <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  With Officers
                </span>
              </div>
              <h3 className="text-3xl font-bold text-foreground">
                {stats.activeConstituencies}
              </h3>
            </CardBody>
          </Card>
        </div>

        {/* 4. Officer Management Section */}
        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-foreground">
              Officer Management
            </h2>

            {/* Custom Tabs */}
            <div className="flex p-1 bg-default-100 rounded-lg w-fit">
              <button
                className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
                  activeTab === "eros"
                    ? "bg-white dark:bg-default-50 text-foreground shadow-sm"
                    : "text-default-500 hover:text-default-700"
                }`}
                onClick={() => setActiveTab("eros")}
              >
                Electoral Registration Officers (EROs)
              </button>
              <button
                className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
                  activeTab === "blos"
                    ? "bg-white dark:bg-default-50 text-foreground shadow-sm"
                    : "text-default-500 hover:text-default-700"
                }`}
                onClick={() => setActiveTab("blos")}
              >
                Booth Level Officers (BLOs)
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="w-full md:w-96">
              <Input
                placeholder="Search by Wallet Address, Name or Constituency"
                startContent={
                  <svg
                    className="w-4 h-4 text-default-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                }
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
            </div>
            <Button
              className="font-semibold"
              color="primary"
              onPress={() => setIsAddModalOpen(true)}
            >
              {activeTab === "eros" ? "Add New ERO" : "Add New BLO"}
            </Button>
          </div>

          <Card className="border border-default-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-default-500 uppercase bg-default-50 border-b border-default-200">
                  <tr>
                    <th className="px-6 py-3 font-medium">Wallet Address</th>
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Constituency</th>
                    <th className="px-6 py-3 font-medium">Added On</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-default-200">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td
                        className="px-6 py-8 text-center text-default-500"
                        colSpan={6}
                      >
                        {currentData.length === 0
                          ? `No ${activeTab === "eros" ? "EROs" : "BLOs"} added yet. Click the button above to add one.`
                          : "No officers match your search."}
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((officer) => (
                      <tr
                        key={officer.walletAddress}
                        className="hover:bg-default-50 transition-colors"
                      >
                        <td className="px-6 py-4 font-mono text-default-600 flex items-center gap-2">
                          {officer.walletAddress.slice(0, 6)}...
                          {officer.walletAddress.slice(-4)}
                          <button
                            className="text-default-400 hover:text-default-600"
                            title="Copy full address"
                            onClick={() =>
                              navigator.clipboard.writeText(
                                officer.walletAddress,
                              )
                            }
                          >
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                              />
                            </svg>
                          </button>
                        </td>
                        <td className="px-6 py-4 text-default-900">
                          {officer.name || "-"}
                        </td>
                        <td className="px-6 py-4 text-default-900 font-medium">
                          {officer.constituencyName ||
                            officer.constituencyCode ||
                            "-"}
                        </td>
                        <td className="px-6 py-4 text-default-500">
                          {new Date(officer.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <Chip
                            className="capitalize"
                            color={
                              officer.status === "ACTIVE" ? "success" : "danger"
                            }
                            size="sm"
                            variant="flat"
                          >
                            {officer.status.toLowerCase()}
                          </Chip>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            size="sm"
                            variant="light"
                            onPress={() => {
                              if (officer.txHash) {
                                window.open(
                                  `https://sepolia.etherscan.io/tx/${officer.txHash}`,
                                  "_blank",
                                );
                              } else {
                                window.open(
                                  `https://sepolia.etherscan.io/address/${officer.walletAddress}`,
                                  "_blank",
                                );
                              }
                            }}
                          >
                            View on Chain
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-default-200 flex justify-between items-center bg-default-50">
              <span className="text-xs text-default-500">
                Showing {filteredData.length} of {currentData.length} officers
              </span>
              <Button size="sm" variant="flat" onPress={fetchData}>
                Refresh
              </Button>
            </div>
          </Card>
        </div>

        {/* 5. Feedback Card */}
        {feedback && (
          <Card
            className={`${
              feedback.type === "success"
                ? "bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800"
            } shadow-sm`}
          >
            <CardBody className="flex flex-row items-center gap-4 py-3 px-4">
              <div
                className={`p-1 ${
                  feedback.type === "success"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                } rounded-full`}
              >
                {feedback.type === "success" ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M5 13l4 4L19 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M6 18L18 6M6 6l12 12"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    feedback.type === "success"
                      ? "text-green-800 dark:text-green-200"
                      : "text-red-800 dark:text-red-200"
                  }`}
                >
                  {feedback.message}
                </p>
              </div>
              <Button
                className={`${
                  feedback.type === "success"
                    ? "text-green-700 dark:text-green-300"
                    : "text-red-700 dark:text-red-300"
                } font-medium`}
                size="sm"
                variant="light"
                onPress={() => setFeedback(null)}
              >
                Dismiss
              </Button>
            </CardBody>
          </Card>
        )}
      </main>

      {/* Add Officer Modal */}
      <Modal
        isOpen={isAddModalOpen}
        size="lg"
        onClose={() => {
          if (!isSubmitting) {
            setIsAddModalOpen(false);
            setNewOfficerAddress("");
            setNewOfficerName("");
            setNewOfficerConstituencyCode("");
            setNewOfficerConstituencyName("");
          }
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Add New {activeTab === "eros" ? "ERO" : "BLO"}
            <p className="text-sm font-normal text-default-500">
              This will grant the{" "}
              {activeTab === "eros" ? "ERO_ROLE" : "BLO_ROLE"} to the specified
              wallet address on the blockchain.
            </p>
          </ModalHeader>
          <ModalBody className="gap-4">
            <Input
              isRequired
              description="The Ethereum wallet address of the officer"
              isDisabled={isSubmitting}
              label="Wallet Address"
              placeholder="0x..."
              value={newOfficerAddress}
              onValueChange={setNewOfficerAddress}
            />
            <Input
              description="Optional: Name for identification"
              isDisabled={isSubmitting}
              label="Officer Name"
              placeholder="Enter officer's name"
              value={newOfficerName}
              onValueChange={setNewOfficerName}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                description="Optional: Constituency code"
                isDisabled={isSubmitting}
                label="Constituency Code"
                placeholder="e.g., AC-40"
                value={newOfficerConstituencyCode}
                onValueChange={setNewOfficerConstituencyCode}
              />
              <Input
                description="Optional: Constituency name"
                isDisabled={isSubmitting}
                label="Constituency Name"
                placeholder="e.g., New Delhi"
                value={newOfficerConstituencyName}
                onValueChange={setNewOfficerConstituencyName}
              />
            </div>

            <div className="p-3 bg-warning-50 dark:bg-warning-900/20 rounded-lg border border-warning-200 dark:border-warning-800">
              <p className="text-xs text-warning-700 dark:text-warning-300">
                <strong>Note:</strong> This action will send a transaction to
                the blockchain. You will need to confirm it in MetaMask and pay
                gas fees.
              </p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              isDisabled={isSubmitting}
              variant="light"
              onPress={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              isLoading={isSubmitting}
              onPress={handleAddOfficer}
            >
              {isSubmitting
                ? "Processing..."
                : `Add ${activeTab === "eros" ? "ERO" : "BLO"}`}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
