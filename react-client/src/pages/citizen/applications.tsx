import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Input, Textarea } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { Select, SelectItem } from "@heroui/select";
import { toast } from "sonner";

import CitizenLayout from "@/layouts/citizen";
import { api, authHeaders } from "@/lib/api";
import { useVoterStore } from "@/store/voterStore";
import { ASSEMBLY_CONSTITUENCY_MAP } from "@/utils/constituencymap";

export default function CitizenApplications() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const navigate = useNavigate();
  const { accessToken, isAuthenticated } = useVoterStore();

  const [toAddress, setToAddress] = useState("");
  const [toState, setToState] = useState<string>("");
  const [toConstituency, setToConstituency] = useState<string>("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofUrl, setProofUrl] = useState<string>("");

  const [states, setStates] = useState<Array<{ name: string; code: number }>>(
    [],
  );
  const [currentRequest, setCurrentRequest] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusLabel = useMemo(() => {
    if (!currentRequest) return null;
    switch (currentRequest.status) {
      case "PENDING_BLO":
        return { text: "Pending BLO Verification", color: "warning" as const };
      case "BLO_VERIFIED":
        return { text: "Verified by BLO", color: "success" as const };
      case "BLO_REJECTED":
        return { text: "Rejected by BLO", color: "danger" as const };
      case "ERO_REJECTED":
        return { text: "Rejected by ERO", color: "danger" as const };
      default:
        return { text: currentRequest.status, color: "default" as const };
    }
  }, [currentRequest]);

  const hasActiveAddressChange = useMemo(() => {
    const status = currentRequest?.status;
    return status === "PENDING_BLO" || status === "BLO_VERIFIED";
  }, [currentRequest]);

  const activeRequestDetails = useMemo(() => {
    if (!currentRequest) return null;

    const toStateName = String(currentRequest.toState || "");
    const toConstituencyNumber = Number(currentRequest.toConstituency);
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

    const submittedAt = currentRequest.createdAt
      ? new Date(currentRequest.createdAt).toLocaleString()
      : null;

    return {
      toStateName,
      toConstituencyNumber: Number.isFinite(toConstituencyNumber)
        ? toConstituencyNumber
        : null,
      toConstituencyName,
      submittedAt,
    };
  }, [currentRequest]);

  const constituencyOptions = useMemo(() => {
    if (!toState) return [] as Array<{ name: string; number: number }>;
    const mapForState =
      (ASSEMBLY_CONSTITUENCY_MAP as Record<string, Record<string, number>>)[
        toState
      ];
    if (!mapForState) return [] as Array<{ name: string; number: number }>;
    return Object.entries(mapForState)
      .map(([name, number]) => ({ name, number: Number(number) }))
      .sort((a, b) => a.number - b.number);
  }, [toState]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const load = async () => {
      try {
        const s = await api.get("/meta/states");
        setStates(s.data?.data || []);
      } catch (e) {
        void e;
      }

      if (!accessToken) return;

      try {
        const r = await api.get("/transfers/me", {
          headers: authHeaders(accessToken),
        });
        setCurrentRequest(r.data?.data || null);
      } catch (e) {
        void e;
      }
    };

    void load();
  }, [accessToken]);

  const submitApplication = async (onClose: () => void) => {
    if (!accessToken) {
      navigate("/login");
      return;
    }

    if (!toAddress || !toState || !toConstituency || !proofFile) {
      toast.error("Please fill all fields and upload a PDF proof");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1) Upload proof PDF to Cloudinary via server
      const formData = new FormData();
      formData.append("file", proofFile);

      const uploaded = await api.post("/uploads/proof", formData, {
        headers: {
          ...authHeaders(accessToken),
        },
      });

      const uploadedUrl = String(uploaded.data?.data?.url || "");
      if (!uploadedUrl) {
        throw new Error("Upload failed: missing URL");
      }
      setProofUrl(uploadedUrl);

      // 2) Submit migration request with proof URL
      const response = await api.post(
        "/transfers/apply",
        {
          toAddress,
          toState,
          toConstituency: Number(toConstituency),
          proof: uploadedUrl,
        },
        {
          headers: authHeaders(accessToken),
        },
      );

      setCurrentRequest(response.data?.data || null);
      onClose();
      toast.success("Application submitted successfully");
    } catch (e: any) {
      void e;
      toast.error(e?.response?.data?.message || e?.message || "Submit failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CitizenLayout>
      <div className="flex flex-col gap-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Applications</h1>
          <Button
            color="primary"
            isDisabled={hasActiveAddressChange}
            startContent={<span>+</span>}
            variant="flat"
          >
            New Application
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Address Change Application Card */}
          <Card
            className={
              hasActiveAddressChange
                ? "border border-warning/40 bg-warning/5 shadow-sm"
                : "border border-default-200 shadow-sm hover:shadow-md transition-all"
            }
          >
            <CardHeader className="flex gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <p className="text-md font-bold">Address Change Application</p>
                <p className="text-small text-default-500">Form 8</p>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-default-500 text-sm mb-4">
                Apply for shifting of residence within or outside constituency.
                Requires valid address proof document.
              </p>

              {hasActiveAddressChange && (
                <div className="mb-4 rounded-xl border border-warning/30 bg-warning/10 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold text-default-900">
                        Address change in progress
                      </p>
                      <p className="text-xs text-default-600">
                        Your request is under verification. You can’t submit a
                        new request until this is resolved.
                      </p>
                    </div>
                    {statusLabel && (
                      <Chip
                        className="font-semibold"
                        color={statusLabel.color}
                        size="sm"
                        variant="flat"
                      >
                        {statusLabel.text}
                      </Chip>
                    )}
                  </div>

                  {activeRequestDetails && (
                    <div className="mt-3 text-xs text-default-700">
                      <div className="flex flex-wrap gap-x-6 gap-y-2">
                        <span>
                          <span className="text-default-500">New State/UT:</span>{" "}
                          {activeRequestDetails.toStateName || "-"}
                        </span>
                        <span>
                          <span className="text-default-500">New Constituency:</span>{" "}
                          {activeRequestDetails.toConstituencyName
                            ? `${activeRequestDetails.toConstituencyName} (${activeRequestDetails.toConstituencyNumber ?? "-"})`
                            : activeRequestDetails.toConstituencyNumber ?? "-"}
                        </span>
                        {activeRequestDetails.submittedAt && (
                          <span>
                            <span className="text-default-500">Submitted:</span>{" "}
                            {activeRequestDetails.submittedAt}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2 mb-4">
                {statusLabel ? (
                  <Chip color={statusLabel.color} size="sm" variant="flat">
                    {statusLabel.text}
                  </Chip>
                ) : (
                  <Chip color="warning" size="sm" variant="flat">
                    No active application
                  </Chip>
                )}
              </div>
            </CardBody>
            <CardFooter>
              <Button
                className="w-full font-medium"
                color="primary"
                isDisabled={hasActiveAddressChange}
                onPress={onOpen}
              >
                Apply Now
              </Button>
            </CardFooter>
          </Card>

          {/* Other Placeholder Cards */}
          <Card className="border border-default-200 shadow-sm opacity-60">
            <CardHeader className="flex gap-3">
              <div className="p-2 bg-default-100 rounded-lg text-default-500">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <p className="text-md font-bold">Correction of Entries</p>
                <p className="text-small text-default-500">Form 8</p>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-default-500 text-sm">
                Correction of particulars entered in electoral roll.
              </p>
            </CardBody>
            <CardFooter>
              <Button isDisabled className="w-full" variant="bordered">
                Coming Soon
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Address Change Modal */}
        <Modal
          backdrop="blur"
          isOpen={isOpen}
          placement="center"
          size="2xl"
          onOpenChange={onOpenChange}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Address Change Request
                  <span className="text-sm font-normal text-default-500">
                    Please provide your new address details and proof.
                  </span>
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-col gap-6 py-4">
                    <Textarea
                      label="New Address"
                      minRows={3}
                      placeholder="Enter your full new address including pincode"
                      variant="bordered"
                      value={toAddress}
                      onValueChange={setToAddress}
                    />

                    <Select
                      label="New State/UT"
                      placeholder="Select state"
                      selectedKeys={toState ? [toState] : []}
                      variant="bordered"
                      onSelectionChange={(keys) => {
                        const arr = Array.from(keys);
                        setToState((arr[0] as string) || "");
                        setToConstituency("");
                      }}
                    >
                      {states.map((s) => (
                        <SelectItem key={s.name}>{s.name}</SelectItem>
                      ))}
                    </Select>

                    <Select
                      isDisabled={!toState || constituencyOptions.length === 0}
                      label="New Constituency"
                      placeholder={
                        !toState
                          ? "Select state first"
                          : constituencyOptions.length
                            ? "Select constituency"
                            : "No constituencies available"
                      }
                      selectedKeys={toConstituency ? [toConstituency] : []}
                      variant="bordered"
                      onSelectionChange={(keys) => {
                        const arr = Array.from(keys);
                        setToConstituency((arr[0] as string) || "");
                      }}
                    >
                      {constituencyOptions.map((c) => (
                        <SelectItem key={String(c.number)}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </Select>

                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-medium text-default-700">
                        Upload Address Proof
                      </span>
                      <div className="border-2 border-dashed border-default-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-default-50 transition-colors">
                        <input
                          accept="application/pdf"
                          className="hidden"
                          id="proof-pdf"
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setProofFile(file);
                            setProofUrl("");
                          }}
                        />
                        <label className="cursor-pointer" htmlFor="proof-pdf">
                        <svg
                          className="w-10 h-10 text-default-400 mb-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          />
                        </svg>
                        <p className="text-sm font-medium text-default-600">
                          Click to upload PDF
                        </p>
                        <p className="text-xs text-default-400 mt-1">
                          PDF only (Max 10MB)
                        </p>
                        {proofFile && (
                          <p className="text-xs text-default-500 mt-2">
                            Selected: {proofFile.name}
                          </p>
                        )}
                        {proofUrl && (
                          <p className="text-xs text-default-500 mt-1">
                            Uploaded
                          </p>
                        )}
                        </label>
                      </div>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    className="font-medium shadow-lg shadow-primary/20"
                    color="primary"
                    isDisabled={isSubmitting}
                    onPress={() => submitApplication(onClose)}
                  >
                    {isSubmitting ? "Submitting…" : "Submit Application"}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </CitizenLayout>
  );
}
