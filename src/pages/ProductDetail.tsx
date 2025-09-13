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
  Eye,
  Edit,
  Wrench,
  Hash,
} from "lucide-react";
import { mockProducts, mockSellers } from "@/data/mockData";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { format, differenceInDays } from "date-fns";
import BackButton from "@/components/BackButton";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import CategoryIcon from "@/components/CategoryIcon";
import { Card } from "@/components/ui/card";
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
    const quantity = parseFloat(batch.availableQuantity) || 0;
    return acc + quantity;
  }, 0);

  const unit = product.batches.length > 0 ? (product.batches[0].availableQuantity.replace(/[0-9.,]/g, '').trim()) : '';

  return (
    <div className="container mx-auto p-4 md:p-8">
      <BackButton />
      <AppBreadcrumb />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2">
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
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <CategoryIcon category={product.category} className="h-8 w-8 text-muted-foreground" />
              <h1 className="text-4xl font-bold">{product.name}</h1>
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
          <div className="flex items-center gap-2">
            <Tag className="h-6 w-6 text-primary" />
            <p className="text-3xl font-semibold text-primary">
              {typeof product.price === "number"
                ? `€${product.price.toFixed(2)} / ${product.priceUnit}`
                : "Free"}
            </p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="inline-flex items-center gap-3 py-1 px-3 rounded-full bg-secondary cursor-pointer transition-colors hover:bg-muted"
                  onClick={() => handleCopy(product.articleNumber)}
                >
                  <Hash className="h-4 w-4 text-secondary-foreground" />
                  <span className="text-base font-mono text-secondary-foreground">
                    {product.articleNumber}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy Article Number</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="space-y-4 text-lg">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 text-muted-foreground" />
              <span>Status: Public</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span>{product.region}</span>
            </div>
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-muted-foreground" />
              <span>Total Available: {totalAvailableQuantity} {unit}</span>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-muted-foreground" />
              <span>Delivery: {product.deliveryTimeInDays} day(s)</span>
            </div>
            {product.description && (
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-muted-foreground mt-1" />
                <p className="text-muted-foreground text-base">
                  {product.description}
                </p>
              </div>
            )}
            {product.harvestOnDemand && (
              <div className="flex items-start gap-3">
                <Wrench className="h-5 w-5 text-muted-foreground mt-1" />
                <span className="text-base">Harvest on Demand</span>
              </div>
            )}
            {product.isVegan && (
               <div className="flex items-start gap-3">
                <Vegan className="h-5 w-5 text-muted-foreground mt-1" />
                <span className="text-base">Vegan</span>
              </div>
            )}
            {product.isVegetarian && !product.isVegan && (
               <div className="flex items-start gap-3">
                <Leaf className="h-5 w-5 text-muted-foreground mt-1" />
                <span className="text-base">Vegetarian</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Available Batches</h2>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Production Date</TableHead>
                <TableHead>Best Before</TableHead>
                <TableHead>Days Left</TableHead>
                <TableHead>Available</TableHead>
                <TableHead className="text-right">Action</TableHead>
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
                      <TableCell className="text-right">
                        <Button size="sm" disabled>Add to Cart</Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    No available batches for this product.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetail;