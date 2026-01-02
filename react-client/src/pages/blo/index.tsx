import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Avatar } from "@heroui/avatar";

import { ThemeSwitch } from "@/components/theme-switch";

// Mock Data
const requests = [
  {
    id: 1,
    epicHash: "0x3c...9b2",
    fullHash:
      "0x3c7f8a9b2d1e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9",
    fromState: "Uttar Pradesh (UP)",
    toState: "Delhi (DL)",
    constituency: "New Delhi AC-40",
    pollingStation: "PS-12, Govt Boys Sr Sec School",
    timestamp: "2024-01-02 10:30 AM",
    status: "IN TRANSIT",
    proofs: [
      { name: "Rent_Agreement.pdf", date: "2024-01-01" },
      { name: "Electricity_Bill.pdf", date: "2024-01-01" },
    ],
  },
  {
    id: 2,
    epicHash: "0x4a...8c1",
    fullHash:
      "0x4a7f8a9b2d1e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9",
    fromState: "Maharashtra (MH)",
    toState: "Delhi (DL)",
    constituency: "Chandni Chowk AC-20",
    pollingStation: "PS-05, Community Centre",
    timestamp: "2024-01-02 09:15 AM",
    status: "PENDING",
    proofs: [{ name: "Aadhaar_Card.pdf", date: "2024-01-02" }],
  },
  {
    id: 3,
    epicHash: "0x1b...2d4",
    fullHash:
      "0x1b7f8a9b2d1e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9",
    fromState: "Karnataka (KA)",
    toState: "Delhi (DL)",
    constituency: "East Delhi AC-55",
    pollingStation: "PS-22, MCD Primary School",
    timestamp: "2024-01-01 16:45 PM",
    status: "VERIFIED",
    proofs: [],
  },
  {
    id: 4,
    epicHash: "0x9d...4e1",
    fullHash:
      "0x9d7f8a9b2d1e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9",
    fromState: "Punjab (PB)",
    toState: "Delhi (DL)",
    constituency: "West Delhi AC-30",
    pollingStation: "PS-10, Govt Girls Sr Sec School",
    timestamp: "2024-01-01 14:20 PM",
    status: "REJECTED",
    proofs: [],
  },
  {
    id: 5,
    epicHash: "0x2f...1a8",
    fullHash:
      "0x2f7f8a9b2d1e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9",
    fromState: "Haryana (HR)",
    toState: "Delhi (DL)",
    constituency: "South Delhi AC-45",
    pollingStation: "PS-15, Community Hall",
    timestamp: "2024-01-01 11:10 AM",
    status: "IN TRANSIT",
    proofs: [],
  },
];

export default function BloDashboard() {
  const [selectedRequest, setSelectedRequest] = useState(requests[0]);
  const [isVerified, setIsVerified] = useState(false);

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
              Unified Electoral Roll System – Official Portal
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
                0x12...89A
              </span>
            </div>
            <Avatar
              isBordered
              className="w-8 h-8"
              color="primary"
              size="sm"
              src="https://i.pravatar.cc/150?u=blo"
            />
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <h3 className="text-3xl font-bold text-foreground">12</h3>
            </CardBody>
          </Card>
          <Card className="border border-default-200 shadow-sm">
            <CardBody className="p-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-default-500">
                  Verified Today
                </p>
                <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  +2 from yesterday
                </span>
              </div>
              <h3 className="text-3xl font-bold text-foreground">45</h3>
            </CardBody>
          </Card>
          <Card className="border border-default-200 shadow-sm">
            <CardBody className="p-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-default-500">
                  Avg. Verification Time
                </p>
              </div>
              <h3 className="text-3xl font-bold text-foreground">2.5h</h3>
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
                    {requests.map((req) => (
                      <tr
                        key={req.id}
                        className={`cursor-pointer transition-colors hover:bg-default-100 ${selectedRequest.id === req.id ? "bg-blue-50/50 dark:bg-blue-900/10 border-l-4 border-l-blue-500" : ""}`}
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
                    ))}
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
                    {selectedRequest.fullHash}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-xs font-semibold text-default-500 uppercase tracking-wider">
                        Current State
                      </p>
                      <p className="font-medium text-default-900 mt-1">
                        {selectedRequest.fromState}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-default-500 uppercase tracking-wider">
                        Requested State
                      </p>
                      <p className="font-medium text-default-900 mt-1">
                        {selectedRequest.toState}
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
                    {selectedRequest.constituency}
                  </p>
                  <div className="flex items-start gap-2 mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                    <svg
                      className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                      <path
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Assigned Polling Station
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
                        {selectedRequest.pollingStation}
                      </p>
                    </div>
                  </div>
                </div>

                <Divider />

                {/* Section: Uploaded Proofs */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-default-500 uppercase tracking-wider">
                    Uploaded Proofs
                  </p>
                  <div className="space-y-2">
                    {selectedRequest.proofs.length > 0 ? (
                      selectedRequest.proofs.map((proof, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 border border-default-200 rounded-lg hover:bg-default-50 transition-colors cursor-pointer"
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
                    isDisabled={!isVerified}
                    size="lg"
                  >
                    Verify Address
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
                        Completed • {selectedRequest.timestamp}
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
