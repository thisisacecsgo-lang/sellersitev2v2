import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Tag,
  MapPin,
  Package,
  Info,
  Vegan,
  Leaf,
  Truck,
  Edit,
  Wrench,
  Hash,
  Eye,
} from "lucide-react";
import { mockProducts, mockSellers } from "@/data/mockData";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { format, differenceInDays } from "date-fns";
import BackButton from "@/components/BackButton";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import CategoryIcon from "@/components/CategoryIcon";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { showSuccess } from "@/utils/toast";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();

  const product = mockProducts.find((p) => p.id === id);
  const seller = product
    ? mockSellers.find((s) => s.id === product.sellerId)
    : undefined;

  if (!product || !seller) {
    return (
      <div className="container mx-auto p-4 md:p-6 flex items-center justify-center flex-grow">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Button asChild>
            <Link to="/">Go back to homepage</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showSuccess("Article number copied to clipboard!");
  };

  const totalAvailableQuantity = product.batches.reduce((acc, batch) => {
    // Extract numeric value from availableQuantity string (e.g., "10kg" -> 10)
    const numericValueMatch = batch.availableQuantity.match(/(\d+(\.\d+)?)/);
    const quantity = numericValueMatch ? parseFloat(numericValueMatch[1]) : 0;
    return acc + quantity;
  }, 0);

  const unit = product.priceUnit; // Use the product's priceUnit for consistency

  return (
    <div className="container mx-auto p-4 md:p-8">
      <BackButton />
      <AppBreadcrumb />
      <div className="max-w-md mx-auto space-y-6"> {/* Centralized content, single column flow */}
        {/* Image Carousel */}
        <Carousel className="w-full relative">
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
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 hidden sm:flex" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex" />
        </Carousel>

        {/* Product Name and Edit Button */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <CategoryIcon category={product.category} className="h-6 w-6 text-muted-foreground" />
            <h1 className="text-3xl font-bold">{product.name}</h1>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to={`/product/${product.id}/edit`}>
              <span className="flex items-center gap-1">
                <Edit className="h-4 w-4" />
                Edit
              </span>
            </Link>
          </Button>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <Tag className="h-5 w-5 text-primary" />
          <p className="text-2xl font-semibold text-primary">
            {typeof product.price === "number"
              ? `€${product.price.toFixed(2)} / ${product.priceUnit}`
              : "Free"}
          </p>
        </div>

        {/* Badges Row 1 */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-sm font-medium">
            <Hash className="h-3 w-3 mr-1" />
            {product.articleNumber}
          </Badge>
          <Badge variant="secondary" className="text-sm font-medium">
            <MapPin className="h-3 w-3 mr-1" />
            {product.region}
          </Badge>
        </div>

        {/* Badges Row 2 */}
        <div className="flex flex-wrap gap-2">
          {product.isVegan && (
            <Badge variant="outline" className="text-sm font-medium">
              <Vegan className="h-3 w-3 mr-1" />
              Vegan
            </Badge>
          )}
          {product.isVegetarian && !product.isVegan && (
            <Badge variant="outline" className="text-sm font-medium">
              <Leaf className="h-3 w-3 mr-1" />
              Vegetarian
            </Badge>
          )}
          {product.harvestOnDemand && (
            <Badge variant="outline" className="text-sm font-medium">
              <Wrench className="h-3 w-3 mr-1" />
              Harvest on Demand
            </Badge>
          )}
        </div>

        {/* Description */}
        {product.description && (
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-muted-foreground text-base">
              {product.description}
            </p>
          </div>
        )}

        {/* Available Quantity */}
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-muted-foreground" />
          <p className="text-muted-foreground text-base">
            Available: {totalAvailableQuantity} {unit}
          </p>
        </div>

        {/* Product Visibility Status */}
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-muted-foreground" />
          <p className="text-muted-foreground text-base">
            Status: {product.visibility === 'public' ? 'Public' : 'Hidden'}
          </p>
        </div>
      </div>

      <div className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Available Batches</h2>
          <Button asChild>
            <Link to={`/product/${product.id}/edit#batches`}>
              <Wrench className="mr-2 h-4 w-4" />
              Manage Batches
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="p-0">
            {/* Desktop Table */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Production Date</TableHead>
                    <TableHead>Best Before</TableHead>
                    <TableHead>Days Left</TableHead>
                    <TableHead>Available</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {product.batches.length > 0 ? (
                    product.batches.map(batch => {
                      const expiry = new Date(batch.expiryDate);
                      const daysLeft = differenceInDays(expiry, new Date());
                      return (
                        <TableRow key={batch.id}>
                          <TableCell>{format(new Date(batch.productionDate), "PPP")}</TableCell>
                          <TableCell>{format(expiry, "PPP")}</TableCell>
                          <TableCell>
                            <Badge variant={daysLeft < 7 ? "destructive" : "secondary"}>
                              {daysLeft > 0 ? `${daysLeft} days` : "Expired"}
                            </Badge>
                          </TableCell>
                          <TableCell>{batch.availableQuantity}</TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-24">
                        No available batches for this product.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {/* Mobile Card List */}
            <div className="md:hidden">
              {product.batches.length > 0 ? (
                <div className="space-y-4 p-4">
                  {product.batches.map(batch => {
                    const expiry = new Date(batch.expiryDate);
                    const daysLeft = differenceInDays(expiry, new Date());
                    return (
                      <div key={batch.id} className="border rounded-lg p-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Production Date</span>
                          <span className="font-medium">{format(new Date(batch.productionDate), "PPP")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Best Before</span>
                          <span className="font-medium">{format(expiry, "PPP")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Days Left</span>
                          <Badge variant={daysLeft < 7 ? "destructive" : "secondary"}>
                            {daysLeft > 0 ? `${daysLeft} days` : "Expired"}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Available</span>
                          <span className="font-medium">{batch.availableQuantity}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-muted-foreground p-12">No available batches for this product.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetail;