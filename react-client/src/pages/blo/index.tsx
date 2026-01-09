import { useEffect, useMemo, useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { ethers } from "ethers";
import { toast } from "sonner";

import { ThemeSwitch } from "@/components/theme-switch";
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
  toState: string;
  constituency: string;
  timestamp: string;
  status: "PENDING" | "VERIFIED" | "REJECTED" | "IN TRANSIT";
  proofs: Array<{ name: string; date: string; url?: string }>;
  toStateNumber: number;
  toConstituency: number;
};

export default function BloDashboard() {
  const [walletAddress, setWalletAddress] = useState<string>("Connecting...");
  const [requests, setRequests] = useState<UiRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<UiRequest | null>(
    null,
  );
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isActing, setIsActing] = useState(false);

  const pendingCount = useMemo(() => requests.length, [requests]);

  const refresh = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/transfers/blo/pending");
      const raw = response.data?.data || [];

      const mapped: UiRequest[] = raw.map((r: any) => {
        const short =
          typeof r.epicHash === "string" && r.epicHash.length > 10
            ? `${r.epicHash.slice(0, 4)}...${r.epicHash.slice(-3)}`
            : r.epicHash;

        const toStateName = String(r.toState || "");
        const toConstituencyNumber = Number(r.toConstituency);
        const mapForState = (ASSEMBLY_CONSTITUENCY_MAP as Record<string, any>)[
          toStateName
        ] as Record<string, number> | undefined;

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
          toState: r.toState,
          constituency: toConstituencyName
            ? `${toConstituencyName} (${toConstituencyNumber})`
            : Number.isFinite(toConstituencyNumber)
              ? `AC-${toConstituencyNumber}`
              : "-",
          timestamp: new Date(r.createdAt).toLocaleString(),
          status: "PENDING",
          proofs: [
            {
              name: "Address Proof (PDF)",
              url: r.proof,
              date: new Date(r.createdAt).toLocaleDateString(),
            },
          ],
          toStateNumber: Number(r.toStateNumber),
          toConstituency: Number(r.toConstituency),
        };
      });

      setRequests(mapped);
      setSelectedRequest((prev) => {
        if (!mapped.length) return null;
        if (!prev) return mapped[0];
        const stillThere = mapped.find((x) => x.id === prev.id);

        return stillThere || mapped[0];
      });
    } catch (e) {
      void e;
      setRequests([]);
      setSelectedRequest(null);
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

  const verifyOnChainAndPersist = async () => {
    if (!selectedRequest) return;
    setIsActing(true);
    try {
      const provider = await getBrowserProvider();
      const signer = await provider.getSigner();
      const bloAddress = await signer.getAddress();

      // Quick balance check (estimateGas failures are confusing when balance is 0)
      const balance = await provider.getBalance(bloAddress);

      if (balance === 0n) {
        toast.error(
          "This wallet has 0 Sepolia ETH. Fund it first to sign transactions.",
        );

        return;
      }

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        UnifiedElectoralRollABI,
        signer,
      );

      // Preflight: decide whether we should request migration or only verify.
      // Contract Status enum: NONE=0, ACTIVE=1, IN_TRANSIT=2
      let shouldRequestMigration = false;
      let requestMigrationTxHash: string | undefined;

      try {
        const exists = await contract.exists(selectedRequest.fullHash);

        if (!exists) {
          toast.error(
            "This voter is not registered on-chain yet (exists=false). An ERO must call registerVoter on the contract first.",
          );

          return;
        }

        const voter = await contract.getVoter(selectedRequest.fullHash);
        const status = Number(voter[2]);

        if (status === 1) {
          // ACTIVE: migration has not been started on-chain
          shouldRequestMigration = true;
        } else if (status === 2) {
          // IN_TRANSIT: migration already started on-chain; BLO can only verify
          const migration = await contract.getMigration(
            selectedRequest.fullHash,
          );
          const toStateOnChain = Number(migration[1]);
          const toConstituencyOnChain = Number(migration[2]);
          const decisionOnChain = Number(migration[4]);

          if (decisionOnChain !== 0) {
            toast.error(
              `This migration is already decided on-chain (decision=${decisionOnChain}). Ask the ERO to resolve it before verifying again.`,
            );

            return;
          }

          if (
            toStateOnChain !== selectedRequest.toStateNumber ||
            toConstituencyOnChain !== selectedRequest.toConstituency
          ) {
            toast.error(
              `On-chain migration target doesn't match this DB request. On-chain: state=${toStateOnChain}, constituency=${toConstituencyOnChain}. DB: state=${selectedRequest.toStateNumber}, constituency=${selectedRequest.toConstituency}.`,
            );

            return;
          }

          shouldRequestMigration = false;
        } else {
          toast.error(
            `Voter is not eligible for verification right now (status=${status}). Expected ACTIVE (1) or IN_TRANSIT (2).`,
          );

          return;
        }
      } catch (e) {
        void e;
      }

      if (shouldRequestMigration) {
        const tx1 = await contract.requestMigration(
          selectedRequest.fullHash,
          selectedRequest.toStateNumber,
          selectedRequest.toConstituency,
        );

        await tx1.wait();
        requestMigrationTxHash = tx1.hash;
      }

      const tx2 = await contract.verifyByBLO(selectedRequest.fullHash);

      await tx2.wait();

      await api.post(`/transfers/${selectedRequest.id}/blo/verified`, {
        bloAddress,
        requestMigrationTxHash,
        bloTxHash: tx2.hash,
      });

      toast.success("BLO verification completed successfully!");
      setIsVerified(false);
      await refresh();
    } catch (e: any) {
      void e;
      const message =
        e?.reason ||
        e?.shortMessage ||
        e?.info?.error?.message ||
        e?.message ||
        "BLO verification failed";

      toast.error(message);
    } finally {
      setIsActing(false);
    }
  };

  const rejectOffChain = async () => {
    if (!selectedRequest) return;
    setIsActing(true);
    try {
      const bloAddress = await getSignerAddress();

      await api.post(`/transfers/${selectedRequest.id}/blo/reject`, {
        bloAddress,
      });
      toast.success("Request rejected successfully");
      setIsVerified(false);
      await refresh();
    } catch (e: any) {
      void e;
      toast.error(e?.message || "BLO reject failed");
    } finally {
      setIsActing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 font-sans text-foreground">
      {/* 1. Top Header */}
      <header className="sticky top-0 z-50 w-full border-b border-default-200 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-lg font-bold leading-tight">
              BLO Verification Dashboard
            </h1>
            <p className="text-xs text-default-500">
              ECTA – Official Portal
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeSwitch />
            <Chip
              className="uppercase font-bold text-xs"
              color="warning"
              size="sm"
              variant="flat"
            >
              Testnet
            </Chip>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-default-100 rounded-full border border-default-200">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-mono text-default-600">
                {walletAddress === "Connecting..." ||
                walletAddress === "Not Connected"
                  ? walletAddress
                  : `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-6 py-8 space-y-8">
        {/* 2. Audit Notice Banner */}
        <Card className="w-full bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 shadow-sm rounded-r-lg rounded-l-none">
          <CardBody className="flex flex-row items-center gap-4 py-4 px-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full text-blue-600 dark:text-blue-300">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
              All actions performed by BLOs are cryptographically signed and
              permanently recorded for audit. Ensure physical verification is
              complete before signing.
            </p>
          </CardBody>
        </Card>

        {/* 3. Metrics Summary Row */}
        <div className="grid grid-cols-1 gap-6">
          <Card className="border border-default-200 shadow-sm">
            <CardBody className="p-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-default-500">
                  Pending Requests
                </p>
                <Chip
                  className="text-xs"
                  color="danger"
                  size="sm"
                  variant="flat"
                >
                  High Priority
                </Chip>
              </div>
              <h3 className="text-3xl font-bold text-foreground">
                {isLoading ? "…" : pendingCount}
              </h3>
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 4. Pending Verification Requests (Main Table) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Pending Verification Requests
                </h2>
                <p className="text-sm text-default-500">
                  Select a request to view details and perform verification.
                </p>
              </div>
              <div className="flex gap-2">
                <Button isIconOnly size="sm" variant="light">
                  <svg
                    className="w-4 h-4 text-default-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </Button>
                <Button isIconOnly size="sm" variant="light">
                  <svg
                    className="w-4 h-4 text-default-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </Button>
              </div>
            </div>

            <Card className="border border-default-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-default-500 uppercase bg-default-50 border-b border-default-200">
                    <tr>
                      <th className="px-6 py-3 font-medium">EPIC Hash</th>
                      <th className="px-6 py-3 font-medium">Migration Route</th>
                      <th className="px-6 py-3 font-medium">
                        Target Constituency
                      </th>
                      <th className="px-6 py-3 font-medium">Timestamp</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-default-200">
                    {isLoading ? (
                      <tr>
                        <td
                          className="px-6 py-8 text-center text-default-500"
                          colSpan={5}
                        >
                          Loading requests…
                        </td>
                      </tr>
                    ) : requests.length === 0 ? (
                      <tr>
                        <td
                          className="px-6 py-8 text-center text-default-500"
                          colSpan={5}
                        >
                          No pending requests.
                        </td>
                      </tr>
                    ) : (
                      requests.map((req) => (
                        <tr
                          key={req.id}
                          className={`cursor-pointer transition-colors hover:bg-default-100 ${selectedRequest?.id === req.id ? "bg-blue-50/50 dark:bg-blue-900/10 border-l-4 border-l-blue-500" : ""}`}
                          onClick={() => {
                            setSelectedRequest(req);
                            setIsVerified(false);
                          }}
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
                          <td className="px-6 py-4 text-default-500 whitespace-nowrap">
                            {req.timestamp}
                          </td>
                          <td className="px-6 py-4">
                            <Chip
                              className="capitalize"
                              color={
                                req.status === "IN TRANSIT"
                                  ? "warning"
                                  : req.status === "VERIFIED"
                                    ? "success"
                                    : req.status === "REJECTED"
                                      ? "danger"
                                      : "default"
                              }
                              size="sm"
                              variant="flat"
                            >
                              {req.status.toLowerCase().replace("_", " ")}
                            </Chip>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-default-200 flex justify-between items-center bg-default-50">
                <span className="text-xs text-default-500">
                  Showing 5 of 12 requests
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

          {/* 5. Request Details Panel (Right Sidebar) */}
          <div className="lg:col-span-1">
            <Card className="border border-default-200 shadow-md h-full sticky top-24">
              <CardHeader className="px-6 py-4 border-b border-default-200 bg-default-50">
                <h3 className="font-bold text-lg">Request Details</h3>
              </CardHeader>
              <CardBody className="p-6 space-y-6">
                {/* Section: Request Details */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-default-500 uppercase tracking-wider">
                    EPIC Hash
                  </p>
                  <div className="p-3 bg-default-100 rounded-lg break-all font-mono text-xs text-default-700 border border-default-200">
                    {selectedRequest?.fullHash || "-"}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-xs font-semibold text-default-500 uppercase tracking-wider">
                        Current State
                      </p>
                      <p className="font-medium text-default-900 mt-1">
                        {selectedRequest?.fromState || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-default-500 uppercase tracking-wider">
                        Requested State
                      </p>
                      <p className="font-medium text-default-900 mt-1">
                        {selectedRequest?.toState || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                <Divider />

                {/* Section: Target Constituency */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-default-500 uppercase tracking-wider">
                    Target Constituency
                  </p>
                  <p className="font-medium text-lg text-default-900">
                    {selectedRequest?.constituency || "-"}
                  </p>
                </div>

                <Divider />

                {/* Section: Uploaded Proofs */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-default-500 uppercase tracking-wider">
                    Uploaded Proofs
                  </p>
                  <div className="space-y-2">
                    {selectedRequest?.proofs?.length ? (
                      selectedRequest.proofs.map((proof, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 border border-default-200 rounded-lg hover:bg-default-50 transition-colors"
                        >
                          <div className="p-2 bg-red-50 text-red-500 rounded">
                            <svg
                              className="w-5 h-5"
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
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-default-900 truncate">
                              {proof.name}
                            </p>
                            <p className="text-xs text-default-500">
                              {proof.date}
                            </p>
                            {proof.url && (
                              <a
                                className="text-xs text-primary underline"
                                href={proof.url}
                                rel="noreferrer"
                                target="_blank"
                              >
                                View PDF
                              </a>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-default-400 italic">
                        No proofs uploaded.
                      </p>
                    )}
                  </div>
                </div>

                <Divider />

                {/* Section: Verification Declaration */}
                <div className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input
                        checked={isVerified}
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-default-400 checked:border-primary checked:bg-primary transition-all"
                        type="checkbox"
                        onChange={(e) => setIsVerified(e.target.checked)}
                      />
                      <svg
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M5 13l4 4L19 7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                        />
                      </svg>
                    </div>
                    <span className="text-sm text-default-600 group-hover:text-default-900 transition-colors">
                      I certify that physical address verification has been
                      completed offline as per ECI guidelines.
                    </span>
                  </label>

                  <Button
                    className="w-full font-semibold shadow-lg shadow-primary/20"
                    color="primary"
                    isDisabled={!isVerified || !selectedRequest || isActing}
                    size="lg"
                    onPress={verifyOnChainAndPersist}
                  >
                    {isActing ? "Processing…" : "Verify Address"}
                  </Button>
                  <Button
                    className="w-full font-semibold"
                    color="danger"
                    isDisabled={!selectedRequest || isActing}
                    size="lg"
                    variant="flat"
                    onPress={rejectOffChain}
                  >
                    Reject Request
                  </Button>
                  <p className="text-xs text-center text-default-400">
                    This action will create a blockchain transaction and cannot
                    be reversed.
                  </p>
                </div>

                {/* 6. Request Timeline Section */}
                <div className="pt-4">
                  <div className="relative pl-6 border-l-2 border-default-200 space-y-8 ml-2">
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white dark:border-neutral-900" />
                      <p className="text-sm font-medium text-default-900">
                        Migration Requested
                      </p>
                      <p className="text-xs text-default-500">
                        Completed • {selectedRequest?.timestamp || "-"}
                      </p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-blue-500 border-2 border-white dark:border-neutral-900 animate-pulse" />
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        BLO Verification
                      </p>
                      <p className="text-xs text-blue-500/80">In Progress</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-default-300 border-2 border-white dark:border-neutral-900" />
                      <p className="text-sm font-medium text-default-400">
                        ERO Approval
                      </p>
                      <p className="text-xs text-default-400">Pending</p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
