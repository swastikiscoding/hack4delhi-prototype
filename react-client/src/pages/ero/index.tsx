import { useEffect, useMemo, useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";

import { ThemeSwitch } from "@/components/theme-switch";
import { ethers } from "ethers";
import { toast } from "sonner";

import UnifiedElectoralRollABI from "@/abi/UnifiedElectoralRoll.json";
import { CONTRACT_ADDRESS } from "@/config/blockchain";
import { api } from "@/lib/api";
import { getBrowserProvider, getSignerAddress } from "@/lib/wallet";
import { ASSEMBLY_CONSTITUENCY_MAP } from "@/utils/constituencymap";

type UiRequest = {
  id: string;
  epicHash: string;
  fullHash: string;
  fromState: string;
  fromConstituencyNumber: number;
  toState: string;
  constituency: string;
  bloStatus: "VERIFIED" | "PENDING" | "REJECTED";
  timestamp: string;
  status: "PENDING_APPROVAL" | "PENDING_BLO" | "APPROVED" | "REJECTED";
  bloId: string | null;
  bloVerifiedAt: string | null;
  proof: string;
  toStateNumber: number;
  toConstituency: number;
};

export default function EroDashboard() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedRequest, setSelectedRequest] = useState<
    UiRequest | null
  >(null);
  const [filter, setFilter] = useState("ALL"); // ALL, PENDING, APPROVED, REJECTED
  const [walletAddress, setWalletAddress] = useState<string>("Connecting...");
  const [requests, setRequests] = useState<UiRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActing, setIsActing] = useState(false);

  const pendingCount = useMemo(
    () =>
      requests.filter(
        (r) => r.status === "PENDING_APPROVAL" || r.status === "PENDING_BLO",
      ).length,
    [requests],
  );

  const refresh = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/transfers/ero/queue");
      const raw = response.data?.data || [];

      const mapped: UiRequest[] = raw.map((r: any) => {
        const short =
          typeof r.epicHash === "string" && r.epicHash.length > 10
            ? `${r.epicHash.slice(0, 4)}...${r.epicHash.slice(-3)}`
            : r.epicHash;

        const status: UiRequest["status"] =
          r.status === "BLO_VERIFIED"
            ? "PENDING_APPROVAL"
            : r.status === "ERO_APPROVED"
              ? "APPROVED"
              : r.status === "BLO_REJECTED" || r.status === "ERO_REJECTED"
                ? "REJECTED"
                : "PENDING_BLO";

        const toStateName = String(r.toState || "");
        const toConstituencyNumber = Number(r.toConstituency);
        const mapForState =
          (ASSEMBLY_CONSTITUENCY_MAP as Record<string, Record<string, number>>)[
            toStateName
          ];

        let toConstituencyName: string | null = null;
        if (mapForState && Number.isFinite(toConstituencyNumber)) {
          for (const [name, num] of Object.entries(mapForState)) {
            if (Number(num) === toConstituencyNumber) {
              toConstituencyName = name;
              break;
            }
          }
        }

        return {
          id: r._id,
          epicHash: short,
          fullHash: r.epicHash,
          fromState: r.fromState,
          fromConstituencyNumber: Number(r.fromConstituency),
          toState: r.toState,
          constituency: toConstituencyName
            ? `${toConstituencyName} (${toConstituencyNumber})`
            : Number.isFinite(toConstituencyNumber)
              ? `AC-${toConstituencyNumber}`
              : "-",
          bloStatus:
            r.status === "BLO_REJECTED"
              ? "REJECTED"
              : r.status === "BLO_VERIFIED" || r.status === "ERO_REJECTED" || r.status === "ERO_APPROVED"
                ? "VERIFIED"
                : "PENDING",
          timestamp: new Date(r.createdAt).toLocaleString(),
          status,
          bloId: r.bloAddress || null,
          bloVerifiedAt: r.bloVerifiedAt ? new Date(r.bloVerifiedAt).toLocaleString() : null,
          proof: r.proof,
          toStateNumber: Number(r.toStateNumber),
          toConstituency: Number(r.toConstituency),
        };
      });

      setRequests(mapped);
    } catch (e) {
      console.error("Failed to load ERO queue", e);
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  useEffect(() => {
    const loadWallet = async () => {
      try {
        const addr = await getSignerAddress();
        setWalletAddress(addr);
      } catch {
        setWalletAddress("Not Connected");
      }
    };
    void loadWallet();
  }, []);

  const handleReview = (request: UiRequest) => {
    setSelectedRequest(request);
    onOpen();
  };

  const filteredRequests = requests.filter((req) => {
    if (filter === "ALL") return true;
    if (filter === "PENDING")
      return req.status === "PENDING_APPROVAL" || req.status === "PENDING_BLO";

    return req.status === filter;
  });

  const finalizeOnChainAndPersist = async (
    decision: "APPROVE" | "REJECT",
    onClose: () => void,
  ) => {
    if (!selectedRequest) return;
    if (selectedRequest.status !== "PENDING_APPROVAL") return;

    setIsActing(true);
    try {
      const provider = await getBrowserProvider();
      const signer = await provider.getSigner();
      const eroAddress = await signer.getAddress();

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        UnifiedElectoralRollABI,
        signer,
      );

      const tx =
        decision === "APPROVE"
          ? await contract.approveMigration(selectedRequest.fullHash)
          : await contract.rejectMigration(selectedRequest.fullHash);

      await tx.wait();

      await api.post(`/transfers/${selectedRequest.id}/ero/finalize`, {
        decision,
        eroAddress,
        eroTxHash: tx.hash,
      });

      toast.success(
        decision === "APPROVE"
          ? "Migration approved successfully"
          : "Migration rejected successfully",
      );

      onClose();
      setSelectedRequest(null);
      await refresh();
    } catch (e: any) {
      console.error("ERO finalize failed", e);
      toast.error(e?.reason || e?.message || "ERO action failed");
    } finally {
      setIsActing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 font-sans text-foreground">
      {/* 1. Top Header / Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-default-200 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <svg
                className="w-6 h-6"
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
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold leading-tight">ERO Portal</h1>
              <p className="text-xs text-default-500">
                Election Commission of India
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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span className="text-xs font-medium text-default-600">
              All ERO decisions are cryptographically signed and auditable.
            </span>
          </div>

          <div className="flex items-center gap-4">
            <ThemeSwitch />
            <Chip
              className="uppercase font-bold text-xs"
              color="secondary"
              size="sm"
              variant="flat"
            >
              Sepolia Testnet
            </Chip>
            <Chip className="pl-2" color="primary" size="sm" variant="dot">
              ERO Level 1
            </Chip>
            <Chip className="font-mono" size="sm" variant="flat">
              {walletAddress === "Connecting..." || walletAddress === "Not Connected"
                ? walletAddress
                : `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
            </Chip>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-6 py-8 space-y-8">
        {/* 2. Audit Notice Banner (Optional - included in header, but can add another if needed. Skipping to avoid clutter as per prompt "Center (optional)" in header) */}

        {/* 3. Metrics Summary Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-default-200 shadow-sm">
            <CardBody className="p-6">
              <p className="text-sm font-medium text-default-500 mb-2">
                Pending Review
              </p>
              <h3 className="text-3xl font-bold text-foreground">
                {isLoading ? "…" : pendingCount}
              </h3>
            </CardBody>
          </Card>
        </div>

        {/* 4. Request Filters & Search */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Migration Requests Queue
            </h2>
            <p className="text-default-500">
              Final authority for voter migration approvals. Review pending
              cases from BLOs.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex p-1 bg-default-100 rounded-lg">
              {["ALL", "PENDING", "APPROVED", "REJECTED"].map((f) => (
                <button
                  key={f}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    filter === f
                      ? "bg-white dark:bg-default-50 text-foreground shadow-sm"
                      : "text-default-500 hover:text-default-700"
                  }`}
                  onClick={() => setFilter(f)}
                >
                  {f === "ALL"
                    ? "All Requests"
                    : f.charAt(0) + f.slice(1).toLowerCase().replace("_", " ")}
                </button>
              ))}
            </div>
            <div className="w-full md:w-96">
              <Input
                placeholder="Search by EPIC Hash or Constituency Code..."
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
              />
            </div>
          </div>

          {/* 5. Migration Requests Table */}
          <Card className="border border-default-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-default-500 uppercase bg-default-50 border-b border-default-200">
                  <tr>
                    <th className="px-6 py-3 font-medium">EPIC Hash</th>
                    <th className="px-6 py-3 font-medium">Migration Route</th>
                    <th className="px-6 py-3 font-medium">
                      Destination Constituency
                    </th>
                    <th className="px-6 py-3 font-medium">BLO Status</th>
                    <th className="px-6 py-3 font-medium">Timestamp</th>
                    <th className="px-6 py-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-default-200">
                  {filteredRequests.map((req) => (
                    <tr
                      key={req.id}
                      className="hover:bg-default-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-mono text-default-600">
                        {req.epicHash}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {req.fromState.split(" ")[0]}
                          </span>
                          <svg
                            className="w-3 h-3 text-default-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                            />
                          </svg>
                          <span className="font-medium">
                            {req.toState.split(" ")[0]}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-default-600">
                        {req.constituency}
                      </td>
                      <td className="px-6 py-4">
                        <Chip
                          className="capitalize"
                          color={
                            req.bloStatus === "VERIFIED"
                              ? "success"
                              : req.bloStatus === "REJECTED"
                                ? "danger"
                                : "warning"
                          }
                          size="sm"
                          variant="flat"
                        >
                          {req.bloStatus.toLowerCase()}
                        </Chip>
                      </td>
                      <td className="px-6 py-4 text-default-500 whitespace-nowrap">
                        {req.timestamp}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {req.status === "PENDING_APPROVAL" ? (
                          <Button
                            color="primary"
                            size="sm"
                            onClick={() => handleReview(req)}
                          >
                            Review Case
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="flat"
                            onClick={() => handleReview(req)}
                          >
                            View Details
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-default-200 flex justify-between items-center bg-default-50">
              <span className="text-xs text-default-500">
                Showing {filteredRequests.length} requests
              </span>
              <div className="flex gap-2">
                <Button isDisabled size="sm" variant="flat">
                  Previous
                </Button>
                <Button size="sm" variant="flat">
                  Next
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* 6. Review Migration Request Modal */}
      <Modal
        isOpen={isOpen}
        scrollBehavior="inside"
        size="3xl"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 border-b border-default-200 bg-default-50">
                <h3 className="text-xl font-bold">Review Migration Request</h3>
                <p className="text-sm text-default-500 font-normal">
                  Ref ID: {selectedRequest?.epicHash} • Submitted{" "}
                  {selectedRequest?.timestamp}
                </p>
              </ModalHeader>
              <ModalBody className="p-6 bg-default-50/50">
                {selectedRequest && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left Column: Current Registration */}
                      <Card className="border border-default-200 shadow-sm">
                        <CardHeader className="pb-0">
                          <p className="text-xs font-bold text-default-500 uppercase tracking-wider">
                            Current Registration
                          </p>
                        </CardHeader>
                        <CardBody className="space-y-4">
                          <div>
                            <p className="text-xs text-default-400">State</p>
                            <p className="font-medium text-lg">
                              {selectedRequest.fromState}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-default-400">
                              Constituency
                            </p>
                            <p className="font-medium">
                              {(() => {
                                const state = selectedRequest.fromState;
                                const number = Number(
                                  selectedRequest.fromConstituencyNumber,
                                );

                                const mapForState =
                                  (ASSEMBLY_CONSTITUENCY_MAP as Record<
                                    string,
                                    Record<string, number>
                                  >)[state];

                                let name: string | null = null;
                                if (mapForState && Number.isFinite(number)) {
                                  for (const [candidate, num] of Object.entries(
                                    mapForState,
                                  )) {
                                    if (Number(num) === number) {
                                      name = candidate;
                                      break;
                                    }
                                  }
                                }

                                if (name) return `${name} (${number})`;
                                if (Number.isFinite(number)) return `AC-${number}`;
                                return "-";
                              })()}
                            </p>
                          </div>
                        </CardBody>
                      </Card>

                      {/* Right Column: Requested Migration */}
                      <Card className="border border-blue-200 dark:border-blue-800 shadow-sm bg-blue-50/50 dark:bg-blue-900/10">
                        <CardHeader className="pb-0">
                          <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                            Requested Migration
                          </p>
                        </CardHeader>
                        <CardBody className="space-y-4">
                          <div>
                            <p className="text-xs text-default-400">
                              New State
                            </p>
                            <p className="font-medium text-lg">
                              {selectedRequest.toState}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-default-400">
                              New Constituency
                            </p>
                            <p className="font-medium">
                              {selectedRequest.constituency}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-default-400">
                              Address Proof
                            </p>
                            <div className="flex items-center gap-2 mt-1 p-2 bg-white dark:bg-black rounded border border-default-200">
                              <svg
                                className="w-4 h-4 text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                />
                              </svg>
                              {selectedRequest.proof ? (
                                <a
                                  className="text-sm font-medium truncate text-primary underline"
                                  href={selectedRequest.proof}
                                  rel="noreferrer"
                                  target="_blank"
                                >
                                  View PDF
                                </a>
                              ) : (
                                <span className="text-sm font-medium truncate">
                                  -
                                </span>
                              )}
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </div>

                    {/* BLO Verification Section */}
                    <Card className="border-l-4 border-l-green-500 border-y border-r border-default-200 shadow-sm">
                      <CardBody className="flex flex-row items-start gap-4">
                        <div className="p-2 bg-green-100 text-green-600 rounded-full mt-1">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-bold text-green-700 dark:text-green-400">
                            Physically verified by BLO
                          </h4>
                          <p className="text-sm text-default-600 mt-1">
                            Physical address verification has been completed
                            offline as per Election Commission procedures.
                          </p>
                          <div className="flex gap-4 mt-3 text-xs text-default-500 font-mono">
                            <span>
                              ID: {selectedRequest.bloId || "PENDING"}
                            </span>
                            <span>
                              Time: {selectedRequest.bloVerifiedAt || "PENDING"}
                            </span>
                          </div>
                        </div>
                      </CardBody>
                    </Card>

                    <div className="flex items-center gap-2 justify-center text-xs text-default-400">
                      <svg
                        className="w-3 h-3"
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
                      This action is final and will be permanently recorded on
                      the blockchain.
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter className="border-t border-default-200 bg-default-50">
                <Button
                  color="danger"
                  isDisabled={
                    isActing ||
                    !selectedRequest ||
                    selectedRequest.status !== "PENDING_APPROVAL"
                  }
                  variant="flat"
                  onPress={() => finalizeOnChainAndPersist("REJECT", onClose)}
                >
                  Reject Migration
                </Button>
                <Button
                  className="text-white font-semibold shadow-lg shadow-green-500/20"
                  color="success"
                  isDisabled={
                    isActing ||
                    !selectedRequest ||
                    selectedRequest.status !== "PENDING_APPROVAL"
                  }
                  onPress={() => finalizeOnChainAndPersist("APPROVE", onClose)}
                >
                  {isActing ? "Processing…" : "Approve Migration"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
