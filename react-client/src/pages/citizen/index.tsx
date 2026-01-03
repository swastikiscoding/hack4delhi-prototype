import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";
import { Chip } from "@heroui/chip";

import CitizenLayout from "@/layouts/citizen";
import { useVoterStore } from "@/store/voterStore";

export default function CitizenDashboard() {
  const { voter, isAuthenticated, fetchProfile } = useVoterStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    } else {
      fetchProfile();
    }
  }, [isAuthenticated, navigate, fetchProfile]);

  if (!isAuthenticated || !voter) {
    return null;
  }

  return (
    <CitizenLayout>
      <div className="flex flex-col gap-6">
        {/* Welcome Card */}
        <Card className="w-full bg-gradient-to-r from-blue-900 to-slate-900 text-white border-none shadow-xl">
          <CardBody className="p-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6">
              <Avatar
                isBordered
                className="w-20 h-20 text-large"
                color="primary"
                src={
                  voter.photo ||
                  "https://i.pravatar.cc/150?u=a04258114e29026708c"
                }
              />
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold">
                    Welcome back, {voter.name}
                  </h1>
                  <Chip
                    className="bg-green-500/20 text-green-300 border-green-500/30"
                    color="success"
                    variant="flat"
                  >
                    Active Voter
                  </Chip>
                </div>
                <p className="text-blue-200 font-mono">
                  EPIC ID: {voter.epicId}
                </p>
              </div>
            </div>
            <Button
              className="bg-white text-blue-900 font-semibold shadow-lg"
              endContent={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                  <path
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              }
              radius="full"
              size="lg"
            >
              View Digital Voter ID
            </Button>
          </CardBody>
        </Card>

        {/* Info Cards Row */}
        <div className="grid grid-cols-1 gap-6">
          {/* <Card className="border border-default-200 shadow-sm">
            <CardBody className="p-6 flex flex-row items-center gap-4">
              <div className="p-3 rounded-xl bg-success/5 text-success">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-default-500">Data Synchronization</p>
                <h3 className="text-lg font-bold text-foreground">Synced</h3>
                <p className="text-xs text-default-400">
                  Last updated 2 mins ago
                </p>
              </div>
            </CardBody>
          </Card> */}

          <Card className="border border-default-200 shadow-sm">
            <CardBody className="p-6 flex flex-row items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/5 text-primary">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-default-500">Constituency</p>
                <h3 className="text-lg font-bold text-foreground">
                  {voter.constituency_name}
                </h3>
                <p className="text-xs text-default-400">
                  Part {voter.part_number}, Station {voter.polling_station}
                </p>
              </div>
            </CardBody>
          </Card>

          {/* <Card className="border border-default-200 shadow-sm">
            <CardBody className="p-6 flex flex-row items-center gap-4">
              <div className="p-3 rounded-xl bg-warning/5 text-warning">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-default-500">Next Election</p>
                <h3 className="text-lg font-bold text-foreground">145 Days</h3>
                <p className="text-xs text-default-400">
                  General Assembly 2026
                </p>
              </div>
            </CardBody>
          </Card> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Services Section */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h3 className="text-xl font-bold text-foreground">
              Quick Services
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: "Transfer Constituency",
                  desc: "Shift residence & migrate vote",
                  icon: (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    </svg>
                  ),
                  color: "bg-blue-500/5 text-blue-500",
                },
                {
                  title: "Correction of Entries",
                  desc: "Update name, age, or address",
                  icon: (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    </svg>
                  ),
                  color: "bg-orange-500/5 text-orange-500",
                },
                {
                  title: "Deletion Request",
                  desc: "Request deletion of name",
                  icon: (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    </svg>
                  ),
                  color: "bg-red-500/5 text-red-500",
                },
                {
                  title: "Download e-EPIC",
                  desc: "Get your digital voter ID",
                  icon: (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    </svg>
                  ),
                  color: "bg-green-500/5 text-green-500",
                },
              ].map((service, idx) => (
                <Card
                  key={idx}
                  isPressable
                  className="border border-default-200 shadow-sm hover:shadow-md transition-all"
                >
                  <CardBody className="p-6 flex flex-col items-start gap-4">
                    <div className={`p-3 rounded-xl ${service.color}`}>
                      {service.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{service.title}</h4>
                      <p className="text-sm text-default-500">{service.desc}</p>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>

          {/* Side Card: Polling Station */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-foreground">
              Polling Station
            </h3>
            <Card className="h-full border border-default-200 shadow-sm">
              <CardBody className="p-0 flex flex-col h-full">
                <div className="h-48 bg-default-100 relative">
                  {/* Map Placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center text-default-400 bg-default-200/50">
                    <span className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-1.447-.894L15 7m0 13V7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        />
                      </svg>
                      Map View
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col gap-4 flex-grow">
                  <div>
                    <h4 className="font-bold text-lg">
                      {voter.polling_station}
                    </h4>
                    <p className="text-default-500 text-sm">
                      {voter.part_name}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <Chip size="sm" variant="flat">
                      Wheelchair Accessible
                    </Chip>
                    <Chip size="sm" variant="flat">
                      Parking Available
                    </Chip>
                  </div>
                  <Button className="w-full" variant="bordered">
                    Get Directions
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </CitizenLayout>
  );
}
