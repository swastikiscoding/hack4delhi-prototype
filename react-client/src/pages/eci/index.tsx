import { useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import { Input } from "@heroui/input";
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
  Ban2,
  Link2AngularRight,
  Plus,
} from "lineicons-react";

import { ThemeSwitch } from "@/components/theme-switch";

// Mock Data
const states = [
  {
    id: 1,
    name: "Maharashtra",
    code: "MH",
    status: "AUTHORIZED",
    wallet: "0x71C...9A2",
    authorizedSince: "2023-01-15 10:30 AM",
  },
  {
    id: 2,
    name: "Delhi",
    code: "DL",
    status: "AUTHORIZED",
    wallet: "0x82D...1B3",
    authorizedSince: "2023-02-20 09:15 AM",
  },
  {
    id: 3,
    name: "Karnataka",
    code: "KA",
    status: "AUTHORIZED",
    wallet: "0x93E...2C4",
    authorizedSince: "2023-03-05 14:45 PM",
  },
  {
    id: 4,
    name: "Uttar Pradesh",
    code: "UP",
    status: "PENDING",
    wallet: "0xA4F...3D5",
    authorizedSince: "-",
  },
  {
    id: 5,
    name: "Tamil Nadu",
    code: "TN",
    status: "AUTHORIZED",
    wallet: "0xB5G...4E6",
    authorizedSince: "2023-04-10 11:20 AM",
  },
];

const auditLogs = [
  {
    id: 1,
    title: "Inter-State Sync Initiated",
    desc: "Data synchronization between MH and DL nodes.",
    time: "2 mins ago",
    type: "sync",
  },
  {
    id: 2,
    title: "New State Authority Granted",
    desc: "Karnataka (KA) State EC authorized.",
    time: "1 hour ago",
    type: "auth",
  },
  {
    id: 3,
    title: "Verification Anomaly Alert",
    desc: "Multiple requests flagged in Constituency AC-40.",
    time: "3 hours ago",
    type: "alert",
  },
  {
    id: 4,
    title: "Protocol Update",
    desc: "Smart contract v2.1 deployed successfully.",
    time: "1 day ago",
    type: "update",
  },
];

export default function EciDashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStates = states.filter(
    (state) =>
      state.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      state.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
            <Avatar
              isBordered
              className="w-8 h-8"
              color="primary"
              size="sm"
              src="https://i.pravatar.cc/150?u=eci"
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-6 py-8 space-y-8">
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
                National Authority for Unified Electoral Roll Governance
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
                  <span className="font-mono text-sm">0x12...89A</span>
                </div>
                <div className="flex gap-3">
                  <Button
                    className="flex-1 bg-white text-blue-900 font-semibold"
                    size="sm"
                  >
                    <Key1 height={16} width={16} /> Manage Keys
                  </Button>
                  <Button
                    className="flex-1 text-white border-white/30 hover:bg-white/10"
                    size="sm"
                    variant="bordered"
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
                36{" "}
                <span className="text-lg text-default-400 font-normal">
                  / 36
                </span>
              </h3>
              <p className="text-xs text-green-600 mt-2 font-medium">
                100% Coverage
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
              <h3 className="text-3xl font-bold text-foreground">4,820</h3>
              <p className="text-xs text-green-600 mt-2 font-medium">
                +12 this week
              </p>
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
              <h3 className="text-3xl font-bold text-foreground">124k</h3>
              <p className="text-xs text-default-500 mt-2">Active Workforce</p>
            </CardBody>
          </Card>

          <Card className="border border-default-200 shadow-sm">
            <CardBody className="p-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-default-500">
                  Active Migrations
                </p>
                <div className="p-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
                  <Stopwatch height={18} width={18} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-foreground">892</h3>
              <p className="text-xs text-warning-600 mt-2 font-medium">
                Pending Approval
              </p>
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
              >
                Grant New Authority
              </Button>
            </div>

            <div className="w-full">
              <Input
                className="max-w-md"
                placeholder="Search State or Code..."
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
                    {filteredStates.map((state) => (
                      <tr
                        key={state.id}
                        className="hover:bg-default-50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-default-100 flex items-center justify-center text-xs font-bold text-default-600">
                              {state.code}
                            </div>
                            <span className="font-medium text-default-900">
                              {state.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Chip
                            className="capitalize font-medium"
                            color={
                              state.status === "AUTHORIZED"
                                ? "success"
                                : "warning"
                            }
                            size="sm"
                            startContent={
                              state.status === "AUTHORIZED" ? (
                                <CheckCircle1
                                  className="ml-1"
                                  height={14}
                                  width={14}
                                />
                              ) : (
                                <Stopwatch
                                  className="ml-1"
                                  height={14}
                                  width={14}
                                />
                              )
                            }
                            variant="flat"
                          >
                            {state.status.toLowerCase()}
                          </Chip>
                        </td>
                        <td className="px-6 py-4 font-mono text-default-600 text-xs">
                          {state.wallet}
                        </td>
                        <td className="px-6 py-4 text-default-500">
                          {state.authorizedSince}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {state.status === "PENDING" ? (
                            <Button color="primary" size="sm" variant="flat">
                              Grant Authority
                            </Button>
                          ) : (
                            <Button
                              className="text-default-500 group-hover:text-default-900"
                              size="sm"
                              variant="light"
                            >
                              Manage
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
                  Showing {filteredStates.length} states
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
                  {auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-4 hover:bg-default-50 transition-colors"
                    >
                      <div className="flex gap-4">
                        <div
                          className={`mt-1 p-2 rounded-lg h-fit ${
                            log.type === "sync"
                              ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                              : log.type === "auth"
                                ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                : log.type === "alert"
                                  ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                                  : "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                          }`}
                        >
                          {log.type === "sync" && (
                            <TrendUp1 height={18} width={18} />
                          )}
                          {log.type === "auth" && (
                            <Shield2 height={18} width={18} />
                          )}
                          {log.type === "alert" && (
                            <Ban2 height={18} width={18} />
                          )}
                          {log.type === "update" && (
                            <FileMultiple height={18} width={18} />
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-start">
                            <h4 className="text-sm font-semibold text-foreground">
                              {log.title}
                            </h4>
                            <span className="text-xs text-default-400 whitespace-nowrap">
                              {log.time}
                            </span>
                          </div>
                          <p className="text-xs text-default-500 leading-relaxed">
                            {log.desc}
                          </p>
                          <button className="flex items-center gap-1 text-xs text-primary hover:underline mt-2">
                            <Link2AngularRight height={12} width={12} /> View on
                            Explorer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
