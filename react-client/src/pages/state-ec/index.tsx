import { useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";

import { ThemeSwitch } from "@/components/theme-switch";

// Mock Data
const eros = [
  {
    id: 1,
    wallet: "0x71C...9A2",
    constituency: "New Delhi AC-40",
    addedOn: "2023-11-15",
    status: "ACTIVE",
  },
  {
    id: 2,
    wallet: "0x82D...1B3",
    constituency: "Chandni Chowk AC-20",
    addedOn: "2023-11-20",
    status: "ACTIVE",
  },
  {
    id: 3,
    wallet: "0x93E...2C4",
    constituency: "East Delhi AC-55",
    addedOn: "2023-12-01",
    status: "CONFIRMED",
  },
  {
    id: 4,
    wallet: "0xA4F...3D5",
    constituency: "West Delhi AC-30",
    addedOn: "2023-10-10",
    status: "REVOKED",
  },
];

const blos = [
  {
    id: 1,
    wallet: "0xB5G...4E6",
    constituency: "New Delhi AC-40",
    addedOn: "2024-01-05",
    status: "ACTIVE",
  },
  {
    id: 2,
    wallet: "0xC6H...5F7",
    constituency: "New Delhi AC-40",
    addedOn: "2024-01-06",
    status: "ACTIVE",
  },
  {
    id: 3,
    wallet: "0xD7I...6G8",
    constituency: "Chandni Chowk AC-20",
    addedOn: "2024-01-08",
    status: "CONFIRMED",
  },
  {
    id: 4,
    wallet: "0xE8J...7H9",
    constituency: "East Delhi AC-55",
    addedOn: "2024-01-10",
    status: "ACTIVE",
  },
  {
    id: 5,
    wallet: "0xF9K...8I0",
    constituency: "West Delhi AC-30",
    addedOn: "2023-12-25",
    status: "REVOKED",
  },
];

export default function StateEcDashboard() {
  const [activeTab, setActiveTab] = useState<"eros" | "blos">("eros");
  const [searchQuery, setSearchQuery] = useState("");

  const currentData = activeTab === "eros" ? eros : blos;
  const filteredData = currentData.filter(
    (item) =>
      item.wallet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.constituency.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
                  MH
                </span>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-bold text-foreground">
                    Maharashtra (MH)
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
                  <span>Auth Date: 2023-01-15</span>
                  <span>Audit Hash: 0x7f...3a9</span>
                </div>
              </div>
            </div>
            <Button className="font-medium" color="warning" variant="bordered">
              View Audit Log
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
                  +2 this week
                </span>
              </div>
              <h3 className="text-3xl font-bold text-foreground">48</h3>
            </CardBody>
          </Card>
          <Card className="border border-default-200 shadow-sm">
            <CardBody className="p-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-default-500">
                  Total BLOs
                </p>
                <span className="text-xs font-medium text-default-500">
                  Across all constituencies
                </span>
              </div>
              <h3 className="text-3xl font-bold text-foreground">1,240</h3>
            </CardBody>
          </Card>
          <Card className="border border-default-200 shadow-sm">
            <CardBody className="p-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-default-500">
                  Active Constituencies
                </p>
                <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  100% Coverage
                </span>
              </div>
              <h3 className="text-3xl font-bold text-foreground">288</h3>
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
                placeholder="Search by Wallet Address or Constituency ID"
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
            <Button className="font-semibold" color="primary">
              {activeTab === "eros" ? "Add New ERO" : "Add New BLO"}
            </Button>
          </div>

          <Card className="border border-default-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-default-500 uppercase bg-default-50 border-b border-default-200">
                  <tr>
                    <th className="px-6 py-3 font-medium">Wallet Address</th>
                    <th className="px-6 py-3 font-medium">Constituency</th>
                    <th className="px-6 py-3 font-medium">Added On</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-default-200">
                  {filteredData.map((officer) => (
                    <tr
                      key={officer.id}
                      className="hover:bg-default-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-mono text-default-600 flex items-center gap-2">
                        {officer.wallet}
                        <button className="text-default-400 hover:text-default-600">
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
                      <td className="px-6 py-4 text-default-900 font-medium">
                        {officer.constituency}
                      </td>
                      <td className="px-6 py-4 text-default-500">
                        {officer.addedOn}
                      </td>
                      <td className="px-6 py-4">
                        <Chip
                          className="capitalize"
                          color={
                            officer.status === "ACTIVE"
                              ? "success"
                              : officer.status === "CONFIRMED"
                                ? "primary"
                                : "danger"
                          }
                          size="sm"
                          variant="flat"
                        >
                          {officer.status.toLowerCase()}
                        </Chip>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          isDisabled={officer.status === "REVOKED"}
                          size="sm"
                          variant="light"
                        >
                          View History
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-default-200 flex justify-between items-center bg-default-50">
              <span className="text-xs text-default-500">
                Showing {filteredData.length} officers
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

        {/* 5. Audit & Status Feedback */}
        <Card className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 shadow-sm">
          <CardBody className="flex flex-row items-center gap-4 py-3 px-4">
            <div className="p-1 bg-green-100 text-green-600 rounded-full">
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
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                Officer successfully authorized. The authority grant has been
                confirmed on the blockchain.
              </p>
            </div>
            <Button
              className="text-green-700 dark:text-green-300 font-medium"
              size="sm"
              variant="light"
            >
              View on Etherscan
            </Button>
          </CardBody>
        </Card>
      </main>
    </div>
  );
}
