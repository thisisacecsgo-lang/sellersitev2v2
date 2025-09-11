"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { showSuccess } from "@/utils/toast";
import type { Review } from "@/types";

interface ReportReviewDialogProps {
  review: Review;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const ReportReviewDialog = ({ review, isOpen, onOpenChange }: ReportReviewDialogProps) => {
  const [reason, setReason] = useState("");
  const [otherDetails, setOtherDetails] = useState("");

  const handleSubmit = () => {
    if (!reason) {
      return;
    }
    console.log("Submitting report for review:", review.id);
    console.log("Reason:", reason);
    if (reason === "other") {
      console.log("Details:", otherDetails);
    }
    showSuccess("Review reported successfully. Our team will look into it.");
    onOpenChange(false);
    setReason("");
    setOtherDetails("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report Review</DialogTitle>
          <DialogDescription>
            Please select a reason for reporting this review from "{review.buyerName}". Reports are confidential.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <RadioGroup value={reason} onValueChange={setReason}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="inappropriate" id="r1" />
              <Label htmlFor="r1">Inappropriate Language / Swearing</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="spam" id="r2" />
              <Label htmlFor="r2">Spam or Advertisement</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="not_relevant" id="r3" />
              <Label htmlFor="r3">Not Relevant to the Product/Seller</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="r4" />
              <Label htmlFor="r4">Other</Label>
            </div>
          </RadioGroup>
          {reason === "other" && (
            <Textarea
              placeholder="Please provide more details..."
              value={otherDetails}
              onChange={(e) => setOtherDetails(e.target.value)}
              className="mt-2"
            />
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!reason}>Submit Report</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};