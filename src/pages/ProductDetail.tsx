import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Tag,
  MapPin,
  Info,
  User,
  Vegan,
  Leaf,
  Truck,
  Sprout,
  Calendar,
} from "lucide-react";
import { mockProducts, mockSellers } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import BackButton from "@/components/BackButton";
import { Footer } from "@/components/Footer";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import ProductCard from "@/components/ProductCard";
import CategoryIcon from "@/components/CategoryIcon";
import BatchesTable from "@/components/BatchesTable";
import { formatPrice } from "@/lib/utils";
import { StarRating } from "@/components/StarRating"; // Corrected import
import CopyableBadge from "@/components/CopyableBadge";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();

  const product = mockProducts.find((p) => p.id === id);
  const seller = product
    ? mockSellers.find((s) => s.id === product.sellerId)
    : undefined;

  const earliestProductionDate = useMemo(() => {
    if (!product || !product.batches || product.batches.length === 0) {
      return null;
    }
    const futureBatches = product.batches
      .map((b) => new Date(b.productionDate))
      .filter((d) => d > new Date());

    if (futureBatches.length === 0) {
      return null;
    }

    return new Date(Math.min(...futureBatches.map((d) => d.getTime())));
  }, [product]);

  const isAvailableInFuture = !!earliestProductionDate;

  const averageRating = useMemo(() => {
    if (!seller || seller.reviews.length === 0) {
      return 0;
    }
    const totalRating = seller.reviews.reduce((acc, r) => acc + r.rating, 0);
    return totalRating / seller.reviews.length;
  }, [seller]);

  const relatedProducts = product
    ? mockProducts.filter(
        (p) => p.sellerId === product.sellerId && p.id !== product.id && p.status === 'available'
      )
    : [];

  if (!product || !seller) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto p-4 md:p-6 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Product not found</h2>
            <Button asChild>
              <Link to="/">Go back to homepage</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <BackButton />
        <AppBreadcrumb />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Carousel className="w-full max-w-md mx-auto lg:max-w-none lg:mx-0">
              <CarouselContent>
                {product.imageUrls.map((img, index) => (
                  <CarouselItem key={index}>
                    <img
                      src={img}
                      alt={`${product.name} image ${index + 1}`}
                      className="w-full h-auto aspect-square object-cover rounded-lg border"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="ml-16" />
              <CarouselNext className="mr-16" />
            </Carousel>
          </div>
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-3">
              <CategoryIcon category={product.category} className="h-7 w-7 text-muted-foreground" />
              <h1 className="text-3xl font-bold">{product.name}</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" />
              <p className="text-2xl font-semibold text-primary">
                {formatPrice(product)}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <CopyableBadge textToCopy={product.sku} />
              <Badge variant="secondary"><MapPin className="mr-1.5 h-3 w-3" /> {product.region}</Badge>
              <Badge variant="secondary"><Truck className="mr-1.5 h-3 w-3" /> Ships in {product.deliveryTimeInDays} day(s)</Badge>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {isAvailableInFuture && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger onFocus={(e) => e.preventDefault()}>
                      <Badge variant="outline" className="text-primary border-primary cursor-default">
                        <Calendar className="mr-1.5 h-3 w-3" /> Preorder
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This item is available for preorder.</p>
                      {earliestProductionDate && (
                        <p>Expected to be ready on: {format(earliestProductionDate, "PPP")}</p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {product.isVegan && (
                <Badge variant="outline">
                  <Vegan className="mr-2 h-4 w-4" />
                  Vegan
                </Badge>
              )}
              {product.isVegetarian && !product.isVegan && (
                <Badge variant="outline">
                  <Leaf className="mr-2 h-4 w-4" />
                  Vegetarian
                </Badge>
              )}
              {product.harvestOnDemand && (
                <Badge variant="outline">
                  <Sprout className="mr-2 h-4 w-4" />
                  Harvest on Demand
                </Badge>
              )}
            </div>

            {product.description && (
              <div className="flex items-start gap-3 pt-1">
                <Info className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                <p className="text-muted-foreground">
                  {product.description}
                </p>
              </div>
            )}
            
            {seller && (
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-2">Sold by</p>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={seller.logoUrl} />
                      <AvatarFallback>
                        <User />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/seller/${seller.id}`}
                          state={{ fromProduct: { id: product.id, name: product.name } }}
                          className="font-semibold text-lg hover:underline"
                        >
                          {seller.name}
                        </Link>
                        <Badge variant={seller.sellerType === 'commercial' ? 'default' : 'secondary'} className="capitalize text-xs">
                          {seller.sellerType}
                        </Badge>
                      </div>
                      {seller.reviews.length > 0 && (
                        <div className="flex items-center gap-2 mt-1">
                          <StarRating rating={averageRating} />
                          <span className="text-xs text-muted-foreground">
                            ({seller.reviews.length} reviews)
                          </span>
                        </div>
                      )}
                    </div>
                    <Button variant="secondary" asChild>
                      <Link to={`/seller/${seller.id}`} state={{ fromProduct: { id: product.id, name: product.name } }}>View Profile</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {product.batches && product.batches.length > 0 ? (
          <BatchesTable product={product} />
        ) : (
          <p className="mt-8 text-center text-muted-foreground">
            No available batches for this product.
          </p>
        )}

        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-3xl font-bold mb-6">More from {seller.name}</h2>
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {relatedProducts.map((p) => (
                  <CarouselItem key={p.id} className="pl-4 basis-1/2 md:basis-1/2 lg:basis-1/3">
                    <ProductCard product={p} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {/* Buttons for screens smaller than lg (1024px), where 2 items are visible */}
              {relatedProducts.length > 2 && (
                <>
                  <CarouselPrevious className="ml-16 lg:hidden" />
                  <CarouselNext className="mr-16 lg:hidden" />
                </>
              )}
              {/* Buttons for lg screens and larger, where 3 items are visible */}
              {relatedProducts.length > 3 && (
                <>
                  <CarouselPrevious className="ml-16 hidden lg:flex" />
                  <CarouselNext className="mr-16 hidden lg:flex" />
                </>
              )}
            </Carousel>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;