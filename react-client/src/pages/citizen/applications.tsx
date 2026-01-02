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
import { Textarea } from "@heroui/input";
import { Chip } from "@heroui/chip";

import CitizenLayout from "@/layouts/citizen";

export default function CitizenApplications() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <CitizenLayout>
      <div className="flex flex-col gap-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Applications</h1>
          <Button color="primary" startContent={<span>+</span>} variant="flat">
            New Application
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Address Change Application Card */}
          <Card className="border border-default-200 shadow-sm hover:shadow-md transition-all">
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
              <div className="flex gap-2 mb-4">
                <Chip color="warning" size="sm" variant="flat">
                  Pending Action
                </Chip>
              </div>
            </CardBody>
            <CardFooter>
              <Button
                className="w-full font-medium"
                color="primary"
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
                    />

                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-medium text-default-700">
                        Upload Address Proof
                      </span>
                      <div className="border-2 border-dashed border-default-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-default-50 transition-colors cursor-pointer">
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
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-default-400 mt-1">
                          PDF, JPG or PNG (Max 5MB)
                        </p>
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
                    onPress={onClose}
                  >
                    Submit Application
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
