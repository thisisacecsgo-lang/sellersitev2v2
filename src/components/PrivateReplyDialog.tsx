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
import { Textarea } from "@/components/ui/textarea";
import { showSuccess } from "@/utils/toast";
import type { Review } from "@/types";

interface PrivateReplyDialogProps {
  review: Review;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const PrivateReplyDialog = ({ review, isOpen, onOpenChange }: PrivateReplyDialogProps) => {
  const [messageText, setMessageText] = useState("");

  const handleSubmit = () => {
    if (!messageText.trim()) {
      return;
    }
    // In a real app, this would send the message to a backend service.
    console.log(`Sending private message to ${review.buyerName} for review ${review.id}:`);
    console.log(messageText);
    
    showSuccess(`Private message sent to ${review.buyerName}.`);
    onOpenChange(false);
    setMessageText("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Private Message to {review.buyerName}</DialogTitle>
          <DialogDescription>
            This message will be sent directly to the buyer and will not be publicly visible.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            placeholder="Write your private message here..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="mt-2 min-h-[100px]"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!messageText.trim()}>Send Message</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};