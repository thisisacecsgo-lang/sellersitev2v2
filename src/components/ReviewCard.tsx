import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarRating } from "@/components/StarRating";
import type { Review } from "@/types";
import { format, formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Flag, MessageSquareReply, Send } from "lucide-react";
import { ReportReviewDialog } from "./ReportReviewDialog";
import { ReplyToReviewDialog } from "./ReplyToReviewDialog";
import { PrivateReplyDialog } from "./PrivateReplyDialog";

interface ReviewCardProps {
  review: Review;
  onReplySubmit: (reviewId: string, replyText: string) => void;
}

export const ReviewCard = ({ review, onReplySubmit }: ReviewCardProps) => {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [isPrivateReplyDialogOpen, setIsPrivateReplyDialogOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="flex-row items-start justify-between pb-2">
          <div className="flex-grow">
            <CardTitle className="text-md">{review.buyerName}</CardTitle>
            <p className="text-xs text-muted-foreground">{format(new Date(review.date), "PPP")}</p>
          </div>
          <div className="flex items-center gap-2">
            <StarRating rating={review.rating} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Review Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {!review.sellerReply && (
                  <DropdownMenuItem onClick={() => setIsReplyDialogOpen(true)}>
                    <MessageSquareReply className="mr-2 h-4 w-4" />
                    <span>Reply Publicly</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => setIsPrivateReplyDialogOpen(true)}>
                  <Send className="mr-2 h-4 w-4" />
                  <span>Reply Privately</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsReportDialogOpen(true)}>
                  <Flag className="mr-2 h-4 w-4" />
                  <span>Report</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{review.comment}</p>
          {review.sellerReply && (
            <div className="mt-4 pt-4 border-t border-border/50">
              <div className="flex items-center gap-2">
                <MessageSquareReply className="h-4 w-4 text-primary" />
                <h4 className="font-semibold text-sm">Your Reply</h4>
                <span className="text-xs text-muted-foreground">
                  ({formatDistanceToNow(new Date(review.sellerReply.date), { addSuffix: true })})
                </span>
              </div>
              <p className="text-muted-foreground text-sm pl-6 mt-1">{review.sellerReply.text}</p>
            </div>
          )}
        </CardContent>
      </Card>
      <ReportReviewDialog
        review={review}
        isOpen={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
      />
      <ReplyToReviewDialog
        review={review}
        isOpen={isReplyDialogOpen}
        onOpenChange={setIsReplyDialogOpen}
        onReplySubmit={onReplySubmit}
      />
      <PrivateReplyDialog
        review={review}
        isOpen={isPrivateReplyDialogOpen}
        onOpenChange={setIsPrivateReplyDialogOpen}
      />
    </>
  );
};