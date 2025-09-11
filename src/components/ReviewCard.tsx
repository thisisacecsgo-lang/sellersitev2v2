import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarRating } from "@/components/StarRating";
import type { Review } from "@/types";
import { format } from "date-fns";

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard = ({ review }: ReviewCardProps) => (
  <Card>
    <CardHeader className="flex-row items-start justify-between pb-2">
      <div>
        <CardTitle className="text-md">{review.buyerName}</CardTitle>
        <p className="text-xs text-muted-foreground">{format(new Date(review.date), "PPP")}</p>
      </div>
      <StarRating rating={review.rating} />
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">{review.comment}</p>
    </CardContent>
  </Card>
);