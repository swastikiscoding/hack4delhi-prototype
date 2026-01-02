import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";

import CitizenLayout from "@/layouts/citizen";

export default function CitizenGrievances() {
  const categories = [
    { key: "voter_card", label: "Voter ID Card Issue" },
    { key: "name_correction", label: "Name Correction" },
    { key: "polling_station", label: "Polling Station Issue" },
    { key: "other", label: "Other" },
  ];

  return (
    <CitizenLayout>
      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Grievance Redressal</h1>
        </div>

        <Card className="border border-default-200 shadow-sm">
          <CardHeader className="flex flex-col items-start gap-1 px-8 pt-8">
            <h2 className="text-xl font-bold">Submit a Grievance</h2>
            <p className="text-default-500 text-sm">
              Your grievance will be reviewed by the election authorities.
            </p>
          </CardHeader>
          <CardBody className="p-8 flex flex-col gap-6">
            <Select
              label="Grievance Category"
              placeholder="Select a category"
              variant="bordered"
            >
              {categories.map((category) => (
                <SelectItem key={category.key}>{category.label}</SelectItem>
              ))}
            </Select>

            <Input
              label="Subject"
              placeholder="Brief summary of your issue"
              variant="bordered"
            />

            <Textarea
              label="Description"
              minRows={5}
              placeholder="Please describe your issue in detail..."
              variant="bordered"
            />

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-default-700">
                Supporting Documents (Optional)
              </span>
              <div className="border-2 border-dashed border-default-300 rounded-xl p-6 flex items-center justify-center gap-4 hover:bg-default-50 transition-colors cursor-pointer">
                <svg
                  className="w-6 h-6 text-default-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
                <span className="text-sm text-default-500">Attach File</span>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                className="font-medium shadow-lg shadow-primary/20 px-8"
                color="primary"
              >
                Submit Grievance
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </CitizenLayout>
  );
}
