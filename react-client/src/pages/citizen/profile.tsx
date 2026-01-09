import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";
import { Divider } from "@heroui/divider";

import CitizenLayout from "@/layouts/citizen";
import { useVoterStore } from "@/store/voterStore";

export default function CitizenProfile() {
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
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Profile</h1>
        </div>

        {/* Digital Voter ID Card */}
        <Card className="w-full bg-background border border-default-200 shadow-lg overflow-hidden relative">
          {/* Decorative Header Strip */}
          <div className="h-4 bg-gradient-to-r from-orange-500 via-white to-green-500 opacity-80" />

          <CardBody className="p-8 md:p-12">
            <div className="flex flex-col items-center text-center mb-10">
              <div className="mb-4  p-3 rounded-xl">
                <Image
                  alt="ECI Logo"
                  className="h-16 w-auto"
                  src="https://www.eci.gov.in/newimg/eci-logo-white.svg"
                />
              </div>
              <h2 className="text-2xl font-bold uppercase tracking-widest text-default-900">
                Election Commission of India
              </h2>
              <p className="text-default-500 font-medium uppercase tracking-wide text-sm">
                Electoral Photo Identity Card
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-12 items-start">
              {/* Photo Section */}
              <div className="flex flex-col items-center gap-4 w-full md:w-auto shrink-0">
                <div className="w-48 h-60 bg-default-100 rounded-lg border-2 border-default-200 overflow-hidden relative shadow-inner">
                  <Image
                    alt="Voter Photo"
                    className="w-full h-full object-cover"
                    radius="none"
                    src={
                      voter.photo ||
                      "https://i.pravatar.cc/300?u=a04258114e29026708c"
                    }
                  />
                </div>
                <div className="text-center">
                  <p className="font-mono font-bold text-xl tracking-wider">
                    {voter.epicId}
                  </p>
                </div>
              </div>

              {/* Details Section */}
              <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 w-full">
                <div className="col-span-1 md:col-span-2">
                  <p className="text-xs text-default-400 uppercase font-semibold mb-1">
                    Name
                  </p>
                  <p className="text-xl font-bold text-default-900">
                    {voter.name}
                  </p>
                  {/* <p className="text-sm text-default-500">S/o Suresh Kumar</p> */}
                </div>

                <div>
                  <p className="text-xs text-default-400 uppercase font-semibold mb-1">
                    Date of Birth
                  </p>
                  <p className="text-lg font-medium">
                    {new Date(voter.dob).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-default-400 uppercase font-semibold mb-1">
                    Gender
                  </p>
                  <p className="text-lg font-medium">{voter.gender}</p>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <p className="text-xs text-default-400 uppercase font-semibold mb-1">
                    Address
                  </p>
                  <p className="text-lg font-medium leading-relaxed">
                    {voter.address}
                  </p>
                </div>

                <Divider className="col-span-1 md:col-span-2 my-2" />

                <div>
                  <p className="text-xs text-default-400 uppercase font-semibold mb-1">
                    Constituency
                  </p>
                  <p className="text-lg font-medium">
                    {voter.constituency_name}
                  </p>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="hidden md:flex flex-col items-center justify-center gap-2 w-32 shrink-0">
                <div className="w-32 h-32 bg-white p-2 rounded-lg border border-default-200">
                  <div className="w-full h-full bg-black/10 flex items-center justify-center">
                    {/* QR Placeholder */}
                    {voter.qr_code ? (
                      <Image
                        alt="Voter QR Code"
                        className="w-full h-full object-cover"
                        radius="none"
                        src={voter.qr_code}
                      />
                    ) : (
                      <svg
                        className="w-16 h-16 text-default-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12 4v1m6 11h2m-6 0h-2v4h2v-4zM6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <p className="text-[10px] text-default-400 text-center">
                  Scan to Verify
                </p>
              </div>
            </div>
          </CardBody>

          {/* Footer Strip */}
          <div className="bg-default-100 p-4 text-center border-t border-default-200">
            <p className="text-xs text-default-500 font-medium">
              This is a digitally generated voter identity card.
            </p>
          </div>
        </Card>
      </div>
    </CitizenLayout>
  );
}
