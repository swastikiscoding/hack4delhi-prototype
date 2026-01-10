import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import {
  DashboardSquare1,
  MapMarker1,
  FileMultiple,
  Gear1,
  Alarm1,
  Shield2,
  Wallet1,
  Exit,
  Key1,
  UserMultiple4,
  TrendUp1,
  Stopwatch,
  Search1,
  CheckCircle1,
  Plus,
  Link2AngularRight,
} from "lineicons-react";

import { ThemeSwitch } from "@/components/theme-switch";
import { CONTRACT_ADDRESS, ROLE_IDS } from "@/config/blockchain";
import { getBrowserProvider } from "@/lib/wallet";
import { api } from "@/lib/api";
import ABI from "@/abi/UnifiedElectoralRoll.json";

// State name to code mapping
const STATE_CODES: Record<string, string> = {
  "Andaman and Nicobar Islands": "AN",
  "Andhra Pradesh": "AP",
  "Arunachal Pradesh": "AR",
  Assam: "AS",
  Bihar: "BR",
  Chandigarh: "CH",
  Chhattisgarh: "CG",
  "Dadra and Nagar Haveli and Daman and Diu": "DD",
  Delhi: "DL",
  Goa: "GA",
  Gujarat: "GJ",
  Haryana: "HR",
  "Himachal Pradesh": "HP",
  "Jammu and Kashmir": "JK",
  Jharkhand: "JH",
  Karnataka: "KA",
  Kerala: "KL",
  Ladakh: "LA",
  Lakshadweep: "LD",
  "Madhya Pradesh": "MP",
  Maharashtra: "MH",
  Manipur: "MN",
  Meghalaya: "ML",
  Mizoram: "MZ",
  Nagaland: "NL",
  Odisha: "OD",
  Puducherry: "PY",
  Punjab: "PB",
  Rajasthan: "RJ",
  Sikkim: "SK",
  "Tamil Nadu": "TN",
  Telangana: "TS",
  Tripura: "TR",
  "Uttar Pradesh": "UP",
  Uttarakhand: "UK",
  "West Bengal": "WB",
};

interface StateEC {
  walletAddress: string;
  state: string;
  name: string;
  createdAt: string;
  status: string;
  txHash?: string;
}

interface Stats {
  stateECCount: number;
  eroCount: number;
  bloCount: number;
  activeStatesCount: number;
  totalStates: number;
}

interface AuditEvent {
  id: string;
  type: string;
  title: string;
  desc: string;
  time: string;
  txHash?: string;
}

export default function EciDashboard() {
  const navigate = useNavigate();

  // Wallet & auth state
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Data state
  const [stateECs, setStateECs] = useState<StateEC[]>([]);
  const [stats, setStats] = useState<Stats>({
    stateECCount: 0,
    eroCount: 0,
    bloCount: 0,
    activeStatesCount: 0,
    totalStates: 36,
  });
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);

  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Form state
  const [newStateECAddress, setNewStateECAddress] = useState("");
  const [newStateECState, setNewStateECState] = useState("");
  const [newStateECName, setNewStateECName] = useState("");

  // Initialize wallet and check authorization
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        const provider = await getBrowserProvider();
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        setWalletAddress(address);

        // Check if user has ECI_ROLE on-chain
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
        const hasECIRole = await contract.hasRole(ROLE_IDS.ECI, address);

        setIsAuthorized(hasECIRole);
      } catch (error) {
        console.error("Initialization error:", error);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  // Fetch data when authorized
  const fetchData = useCallback(async () => {
    if (!isAuthorized) return;

    try {
      // Fetch State ECs from backend
      const [stateECsResponse, statsResponse, eventsResponse] =
        await Promise.all([
          api
            .get("/eci/state-authorities")
            .catch(() => ({ data: { data: { stateECs: [] } } })),
          api.get("/eci/stats").catch(() => ({ data: { data: null } })),
          api
            .get("/eci/events?limit=10")
            .catch(() => ({ data: { data: { events: [] } } })),
        ]);

      if (stateECsResponse.data?.data?.stateECs) {
        setStateECs(stateECsResponse.data.data.stateECs);
      }

      if (statsResponse.data?.data) {
        setStats(statsResponse.data.data);
      }

      if (eventsResponse.data?.data?.events) {
        setAuditEvents(eventsResponse.data.data.events);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [isAuthorized]);

  useEffect(() => {
    if (isAuthorized) {
      fetchData();
    }
  }, [isAuthorized, fetchData]);

  // Add new State EC
  const handleAddStateEC = async () => {
    if (!newStateECAddress || !ethers.isAddress(newStateECAddress)) {
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

      // Call addStateAuthority on the contract
      const tx = await contract.addStateAuthority(newStateECAddress);

      setFeedback({
        type: "success",
        message: "Transaction submitted. Waiting for confirmation...",
      });

      await tx.wait();

      // Save metadata to backend
      try {
        await api.post("/eci/state-authority", {
          walletAddress: newStateECAddress,
          state: newStateECState,
          name: newStateECName,
          txHash: tx.hash,
          addedBy: walletAddress,
        });
      } catch (apiError) {
        console.warn("Failed to save metadata to backend:", apiError);
      }

      setFeedback({
        type: "success",
        message: `State Authority granted successfully! Tx: ${tx.hash.slice(0, 10)}...`,
      });

      // Reset form and close modal
      setNewStateECAddress("");
      setNewStateECState("");
      setNewStateECName("");
      setIsAddModalOpen(false);

      // Refresh data
      await fetchData();
    } catch (error: any) {
      console.error("Error granting state authority:", error);
      let errorMessage = "Failed to grant state authority";

      if (error.reason) {
        errorMessage = error.reason;
      } else if (error.message?.includes("Already State EC")) {
        errorMessage = "This address already has State EC authority";
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

  const filteredStates = stateECs.filter(
    (stateEC) =>
      stateEC.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stateEC.walletAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stateEC.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;

    return `${diffDays} days ago`;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Spinner color="primary" size="lg" />
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
              <Shield2 className="w-12 h-12 text-danger" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Access Denied</h2>
            <p className="text-default-500">
              Your wallet (
              {walletAddress
                ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                : "Not connected"}
              ) does not have ECI authority.
            </p>
            <p className="text-sm text-default-400">
              Only the Election Commission of India root authority can access
              this dashboard.
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
      {/* 1. Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-default-200 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-900 text-white rounded-lg">
              <Shield2 height={24} width={24} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold leading-tight">
                Election Commission of India
              </h1>
              <p className="text-xs text-default-500">
                Confidential Government Portal
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a
              className="flex items-center gap-2 text-sm font-medium text-primary"
              href="#"
            >
              <DashboardSquare1 height={18} width={18} /> Dashboard
            </a>
            <a
              className="flex items-center gap-2 text-sm font-medium text-default-500 hover:text-foreground transition-colors"
              href="#"
            >
              <MapMarker1 height={18} width={18} /> State Management
            </a>
            <a
              className="flex items-center gap-2 text-sm font-medium text-default-500 hover:text-foreground transition-colors"
              href="#"
            >
              <FileMultiple height={18} width={18} /> Audit Logs
            </a>
            <a
              className="flex items-center gap-2 text-sm font-medium text-default-500 hover:text-foreground transition-colors"
              href="#"
            >
              <Gear1 height={18} width={18} /> Settings
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <button className="text-default-500 hover:text-foreground transition-colors">
              <Alarm1 height={20} width={20} />
            </button>
            <ThemeSwitch />
            <Chip
              className="uppercase font-bold text-xs"
              color="primary"
              size="sm"
              variant="flat"
            >
              Sepolia
            </Chip>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-6 py-8 space-y-8">
        {/* Feedback Card */}
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
                  <CheckCircle1 height={16} width={16} />
                ) : (
                  <Alarm1 height={16} width={16} />
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
                size="sm"
                variant="light"
                onPress={() => setFeedback(null)}
              >
                Dismiss
              </Button>
            </CardBody>
          </Card>
        )}

        {/* 2. Root Authority Hero Section */}
        <Card className="w-full bg-gradient-to-r from-blue-900 to-slate-900 text-white border-none shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <CardBody className="flex flex-col md:flex-row justify-between items-center gap-8 p-8 relative z-10">
            <div className="flex-1 space-y-4">
              <Chip
                className="font-bold text-black"
                color="warning"
                size="sm"
                variant="solid"
              >
                ROOT AUTHORITY ACCESS
              </Chip>
              <h2 className="text-3xl font-bold leading-tight">
                National Authority for ECTA Governance
              </h2>
              <p className="text-blue-100 max-w-2xl text-lg">
                Oversee state commissions, authorize electoral officers, and
                monitor real-time voter migration across the blockchain network.
              </p>
            </div>

            <Card className="bg-white/10 backdrop-blur-md border border-white/20 text-white w-full md:w-auto min-w-[300px]">
              <CardBody className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm uppercase tracking-wider opacity-80">
                    Connected Identity
                  </h3>
                  <Chip
                    className="bg-blue-500/20 border border-blue-400/30 text-blue-200"
                    size="sm"
                  >
                    ECI – National Admin
                  </Chip>
                </div>
                <div className="flex items-center gap-3 p-3 bg-black/20 rounded-lg border border-white/10">
                  <Wallet1 className="text-blue-300" height={20} width={20} />
                  <span
                    className="font-mono text-sm truncate max-w-[200px]"
                    title={walletAddress}
                  >
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </span>
                </div>
                <div className="flex gap-3">
                  <Button
                    className="flex-1 bg-white text-blue-900 font-semibold"
                    size="sm"
                    onPress={() =>
                      window.open(
                        `https://sepolia.etherscan.io/address/${walletAddress}`,
                        "_blank",
                      )
                    }
                  >
                    <Key1 height={16} width={16} /> View on Chain
                  </Button>
                  <Button
                    className="flex-1 text-white border-white/30 hover:bg-white/10"
                    size="sm"
                    variant="bordered"
                    onPress={handleDisconnect}
                  >
                    <Exit height={16} width={16} /> Disconnect
                  </Button>
                </div>
              </CardBody>
            </Card>
          </CardBody>
        </Card>

        {/* 3. National Metrics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border border-default-200 shadow-sm">
            <CardBody className="p-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-default-500">
                  States Authorized
                </p>
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                  <MapMarker1 height={18} width={18} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-foreground">
                {stats.stateECCount}{" "}
                <span className="text-lg text-default-400 font-normal">
                  / {stats.totalStates}
                </span>
              </h3>
              <p className="text-xs text-green-600 mt-2 font-medium">
                {Math.round((stats.stateECCount / stats.totalStates) * 100)}%
                Coverage
              </p>
            </CardBody>
          </Card>

          <Card className="border border-default-200 shadow-sm">
            <CardBody className="p-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-default-500">
                  Total EROs
                </p>
                <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                  <UserMultiple4 height={18} width={18} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-foreground">
                {stats.eroCount}
              </h3>
              <p className="text-xs text-default-500 mt-2">Across all states</p>
            </CardBody>
          </Card>

          <Card className="border border-default-200 shadow-sm">
            <CardBody className="p-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-default-500">
                  Total BLOs
                </p>
                <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
                  <TrendUp1 height={18} width={18} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-foreground">
                {stats.bloCount}
              </h3>
              <p className="text-xs text-default-500 mt-2">Active Workforce</p>
            </CardBody>
          </Card>

          <Card className="border border-default-200 shadow-sm">
            <CardBody className="p-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-default-500">
                  Contract Address
                </p>
                <div className="p-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
                  <Stopwatch height={18} width={18} />
                </div>
              </div>
              <h3
                className="text-sm font-mono font-bold text-foreground truncate"
                title={CONTRACT_ADDRESS}
              >
                {CONTRACT_ADDRESS.slice(0, 10)}...{CONTRACT_ADDRESS.slice(-8)}
              </h3>
              <button
                className="text-xs text-primary mt-2 font-medium hover:underline"
                onClick={() =>
                  window.open(
                    `https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`,
                    "_blank",
                  )
                }
              >
                View Contract →
              </button>
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 4. State Election Commissions Table */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  State Election Commissions
                </h2>
                <p className="text-sm text-default-500">
                  Manage and authorize state-level election bodies.
                </p>
              </div>
              <Button
                className="font-semibold"
                color="primary"
                startContent={<Plus height={18} width={18} />}
                onPress={() => setIsAddModalOpen(true)}
              >
                Grant New Authority
              </Button>
            </div>

            <div className="w-full">
              <Input
                className="max-w-md"
                placeholder="Search State, Name or Wallet..."
                startContent={
                  <Search1
                    className="text-default-400"
                    height={18}
                    width={18}
                  />
                }
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
            </div>

            <Card className="border border-default-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-default-500 uppercase bg-default-50 border-b border-default-200">
                    <tr>
                      <th className="px-6 py-3 font-medium">
                        State Name / Code
                      </th>
                      <th className="px-6 py-3 font-medium">Status</th>
                      <th className="px-6 py-3 font-medium">Wallet Address</th>
                      <th className="px-6 py-3 font-medium">
                        Authorized Since
                      </th>
                      <th className="px-6 py-3 font-medium text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-default-200">
                    {filteredStates.length === 0 ? (
                      <tr>
                        <td
                          className="px-6 py-8 text-center text-default-500"
                          colSpan={5}
                        >
                          {stateECs.length === 0
                            ? "No State ECs authorized yet. Click 'Grant New Authority' to add one."
                            : "No states match your search."}
                        </td>
                      </tr>
                    ) : (
                      filteredStates.map((stateEC) => (
                        <tr
                          key={stateEC.walletAddress}
                          className="hover:bg-default-50 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-default-100 flex items-center justify-center text-xs font-bold text-default-600">
                                {STATE_CODES[stateEC.state] ||
                                  stateEC.state.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <span className="font-medium text-default-900 block">
                                  {stateEC.state || "Unknown State"}
                                </span>
                                {stateEC.name && (
                                  <span className="text-xs text-default-500">
                                    {stateEC.name}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Chip
                              className="capitalize font-medium"
                              color={
                                stateEC.status === "ACTIVE"
                                  ? "success"
                                  : "warning"
                              }
                              size="sm"
                              startContent={
                                <CheckCircle1
                                  className="ml-1"
                                  height={14}
                                  width={14}
                                />
                              }
                              variant="flat"
                            >
                              {stateEC.status.toLowerCase()}
                            </Chip>
                          </td>
                          <td className="px-6 py-4 font-mono text-default-600 text-xs">
                            {stateEC.walletAddress.slice(0, 6)}...
                            {stateEC.walletAddress.slice(-4)}
                            <button
                              className="ml-2 text-default-400 hover:text-default-600"
                              title="Copy address"
                              onClick={() =>
                                navigator.clipboard.writeText(
                                  stateEC.walletAddress,
                                )
                              }
                            >
                              📋
                            </button>
                          </td>
                          <td className="px-6 py-4 text-default-500">
                            {new Date(stateEC.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              size="sm"
                              variant="light"
                              onPress={() => {
                                if (stateEC.txHash) {
                                  window.open(
                                    `https://sepolia.etherscan.io/tx/${stateEC.txHash}`,
                                    "_blank",
                                  );
                                } else {
                                  window.open(
                                    `https://sepolia.etherscan.io/address/${stateEC.walletAddress}`,
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
                  Showing {filteredStates.length} of {stateECs.length} state
                  authorities
                </span>
                <Button size="sm" variant="flat" onPress={fetchData}>
                  Refresh
                </Button>
              </div>
            </Card>
          </div>

          {/* 5. Audit & Transparency Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Audit & Transparency
              </h2>
              <p className="text-sm text-default-500">
                Recent system-wide events and logs.
              </p>
            </div>

            <Card className="border border-default-200 shadow-sm h-full max-h-[600px] overflow-y-auto">
              <CardBody className="p-0">
                <div className="divide-y divide-default-200">
                  {auditEvents.length === 0 ? (
                    <div className="p-8 text-center text-default-500">
                      No recent events
                    </div>
                  ) : (
                    auditEvents.map((event) => (
                      <div
                        key={event.id}
                        className="p-4 hover:bg-default-50 transition-colors"
                      >
                        <div className="flex gap-4">
                          <div
                            className={`mt-1 p-2 rounded-lg h-fit ${
                              event.type === "auth"
                                ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                : event.type === "ero"
                                  ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                                  : "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                            }`}
                          >
                            {event.type === "auth" && (
                              <Shield2 height={18} width={18} />
                            )}
                            {event.type === "ero" && (
                              <UserMultiple4 height={18} width={18} />
                            )}
                            {event.type === "blo" && (
                              <TrendUp1 height={18} width={18} />
                            )}
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex justify-between items-start">
                              <h4 className="text-sm font-semibold text-foreground">
                                {event.title}
                              </h4>
                              <span className="text-xs text-default-400 whitespace-nowrap">
                                {formatTimeAgo(event.time)}
                              </span>
                            </div>
                            <p className="text-xs text-default-500 leading-relaxed">
                              {event.desc}
                            </p>
                            {event.txHash && (
                              <button
                                className="flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                                onClick={() =>
                                  window.open(
                                    `https://sepolia.etherscan.io/tx/${event.txHash}`,
                                    "_blank",
                                  )
                                }
                              >
                                <Link2AngularRight height={12} width={12} />{" "}
                                View on Explorer
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </main>

      {/* Add State EC Modal */}
      <Modal
        isOpen={isAddModalOpen}
        size="lg"
        onClose={() => {
          if (!isSubmitting) {
            setIsAddModalOpen(false);
            setNewStateECAddress("");
            setNewStateECState("");
            setNewStateECName("");
          }
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Grant State Authority
            <p className="text-sm font-normal text-default-500">
              This will grant STATE_ROLE to the specified wallet address on the
              blockchain.
            </p>
          </ModalHeader>
          <ModalBody className="gap-4">
            <Input
              isRequired
              description="The Ethereum wallet address of the State EC"
              isDisabled={isSubmitting}
              label="Wallet Address"
              placeholder="0x..."
              value={newStateECAddress}
              onValueChange={setNewStateECAddress}
            />
            <Input
              description="The state or union territory this authority represents"
              isDisabled={isSubmitting}
              label="State/UT Name"
              placeholder="e.g., Maharashtra, Delhi, Karnataka"
              value={newStateECState}
              onValueChange={setNewStateECState}
            />
            <Input
              description="Optional: Name or designation"
              isDisabled={isSubmitting}
              label="Authority Name"
              placeholder="e.g., State Election Commissioner"
              value={newStateECName}
              onValueChange={setNewStateECName}
            />

            <div className="p-3 bg-warning-50 dark:bg-warning-900/20 rounded-lg border border-warning-200 dark:border-warning-800">
              <p className="text-xs text-warning-700 dark:text-warning-300">
                <strong>Note:</strong> This action will send a transaction to
                the blockchain. You will need to confirm it in MetaMask and pay
                gas fees. Only the ECI root authority can grant State EC
                permissions.
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
              onPress={handleAddStateEC}
            >
              {isSubmitting ? "Processing..." : "Grant Authority"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
