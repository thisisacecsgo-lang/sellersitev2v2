import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  className?: string;
}

export const StarRating = ({ rating, className }: StarRatingProps) => (
  <div className={`flex items-center gap-1 ${className}`}>
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ))}
  </div>
);