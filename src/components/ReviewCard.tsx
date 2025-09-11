import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarRating } from "@/components/StarRating";
import type { Review } from "@/types";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Flag } from "lucide-react";
import { ReportReviewDialog } from "./ReportReviewDialog";

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

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
                <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-background/80 hover:bg-background">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Review Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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
        </CardContent>
      </Card>
      <ReportReviewDialog
        review={review}
        isOpen={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
      />
    </>
  );
};