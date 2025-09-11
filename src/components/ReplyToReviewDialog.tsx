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

interface ReplyToReviewDialogProps {
  review: Review;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onReplySubmit: (reviewId: string, replyText: string) => void;
}

export const ReplyToReviewDialog = ({ review, isOpen, onOpenChange, onReplySubmit }: ReplyToReviewDialogProps) => {
  const [replyText, setReplyText] = useState("");

  const handleSubmit = () => {
    if (!replyText.trim()) {
      return;
    }
    onReplySubmit(review.id, replyText);
    showSuccess("Reply posted successfully.");
    onOpenChange(false);
    setReplyText("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reply to {review.buyerName}</DialogTitle>
          <DialogDescription>
            Your reply will be publicly visible under the original review.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="mb-2 p-3 bg-secondary/50 rounded-md border">
            <p className="text-sm font-semibold">{review.buyerName} wrote:</p>
            <p className="text-sm text-muted-foreground italic">"{review.comment}"</p>
          </div>
          <Textarea
            placeholder="Write your reply here..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="mt-2 min-h-[100px]"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!replyText.trim()}>Submit Reply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};