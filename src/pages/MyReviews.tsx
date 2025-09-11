import { useMemo, useState } from "react";
import { mockSellers } from "@/data/mockData";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import BackButton from "@/components/BackButton";
import { ReviewCard } from "@/components/ReviewCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

const MyReviews = () => {
  // Assuming 'seller-5' is the current logged-in seller for this demo
  const [seller, setSeller] = useState(() => mockSellers.find((s) => s.id === "seller-5"));

  const { averageRating } = useMemo(() => {
    if (!seller || seller.reviews.length === 0) {
      return { averageRating: 0 };
    }
    const avg = seller.reviews.reduce((acc, r) => acc + r.rating, 0) / seller.reviews.length;
    return { averageRating: avg };
  }, [seller]);

  const handleReplySubmit = (reviewId: string, replyText: string) => {
    if (!seller) return;

    const updatedReviews = seller.reviews.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          sellerReply: {
            text: replyText,
            date: new Date().toISOString(),
          },
        };
      }
      return review;
    });

    const updatedSeller = { ...seller, reviews: updatedReviews };
    setSeller(updatedSeller);

    // Also update the global mock data to persist across navigations (for demo purposes)
    const sellerIndex = mockSellers.findIndex(s => s.id === seller.id);
    if (sellerIndex !== -1) {
      mockSellers[sellerIndex] = updatedSeller;
    }
  };

  if (!seller) {
    return (
      <div className="container mx-auto p-4 md:p-8 flex items-center justify-center flex-grow">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Seller not found or no reviews available.</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <BackButton />
      <AppBreadcrumb />
      <h1 className="text-3xl font-bold mb-6">My Reviews</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{seller.reviews.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {seller.reviews.length > 0 ? (
            <div className="space-y-4">
              {seller.reviews.map((review) => (
                <ReviewCard 
                  key={review.id} 
                  review={review} 
                  onReplySubmit={handleReplySubmit}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold">No reviews yet</h3>
              <p className="text-muted-foreground">You haven't received any reviews.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyReviews;