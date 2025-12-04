import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function MandatoryCheckDialog({ 
  open, 
  onOpenChange, 
  onConfirm, 
  onCancel,
  missingMandatory = [],
  currentScore = 0,
  sectionName = "this section"
}) {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    onConfirm(reason);
    setReason("");
  };

  const handleCancel = () => {
    onCancel();
    setReason("");
  };

  const hasMissingMandatory = missingMandatory.length > 0;
  const hasLowScore = currentScore < 40;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-700">
            <AlertTriangle className="w-5 h-5" />
            Minimum Requirements Not Met
          </DialogTitle>
          <DialogDescription className="text-gray-600 pt-2">
            {sectionName} has not met the minimum mandatory requirements. Are you sure you want to proceed?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {hasMissingMandatory && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">
                Mandatory Items Not Completed ({missingMandatory.length}):
              </h4>
              <ul className="space-y-1 text-sm text-red-700">
                {missingMandatory.slice(0, 5).map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
                {missingMandatory.length > 5 && (
                  <li className="text-red-600 font-medium">
                    ...and {missingMandatory.length - 5} more
                  </li>
                )}
              </ul>
            </div>
          )}

          {hasLowScore && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-amber-800">Current Score:</h4>
                <Badge className="bg-amber-600 text-white">
                  {currentScore.toFixed(1)}%
                </Badge>
              </div>
              <p className="text-sm text-amber-700 mt-1">
                The minimum recommended score is 40%. Your current score is below this threshold.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="reason" className="text-gray-700 font-medium">
              Please provide a reason why the minimum requirements have not been met (optional):
            </Label>
            <Textarea
              id="reason"
              placeholder="Enter your explanation here..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px] border-gray-300 focus:border-emerald-500"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="border-gray-300"
          >
            Go Back & Review
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            Proceed Anyway
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}