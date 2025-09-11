import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Tag,
  MapPin,
  Package,
  Info,
  Calendar,
  Clock,
  Wrench,
  Vegan,
  Leaf,
  Truck,
  Eye,
  Edit, // Import Edit icon
} from "lucide-react";
import { mockProducts, mockSellers } from "@/data/mockData";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { format, isAfter, formatDistanceToNowStrict } from "date-fns";
import BackButton from "@/components/BackButton";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import CategoryIcon from "@/components/CategoryIcon";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();

  const product = mockProducts.find((p) => p.id === id);
  const seller = product
    ? mockSellers.find((s) => s.id === product.sellerId)
    : undefined;

  const isAvailableInFuture = product?.productionDate && isAfter(new Date(product.productionDate), new Date());

  const availabilityText = () => {
    if (!isAvailableInFuture || !product?.productionDate) return null;
    const date = new Date(product.productionDate);
    const distance = formatDistanceToNowStrict(date, { addSuffix: true });
    return `Available ${distance} (${format(date, "PPP")})`;
  };

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
          <div className="flex items-center justify-between gap-3"> {/* Added justify-between */}
            <div className="flex items-center gap-3">
              <CategoryIcon category={product.category} className="h-8 w-8 text-muted-foreground" />
              <h1 className="text-4xl font-bold">{product.name}</h1>
            </div>
            <Button asChild variant="outline" size="sm"> {/* Added Edit Button */}
              <Link to={`/product/edit/${product.id}`} className="flex items-center gap-1">
                <Edit className="h-4 w-4" />
                Edit
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="h-6 w-6 text-primary" />
            <p className="text-3xl font-semibold text-primary">
              {typeof product.price === "number"
                ? `€${product.price.toFixed(2)}`
                : "Free"}
            </p>
          </div>
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
              <span>Available Quantity: {product.availableQuantity}</span>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-muted-foreground" />
              <span>Delivery: {product.deliveryTimeInDays} day(s)</span>
            </div>
            {isAvailableInFuture && (
              <div className="flex items-start gap-3 text-primary font-medium">
                <Calendar className="h-5 w-5 text-muted-foreground mt-1" />
                <span className="text-base">{availabilityText()}</span>
              </div>
            )}
            {product.description && (
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-muted-foreground mt-1" />
                <p className="text-muted-foreground text-base">
                  {product.description}
                </p>
              </div>
            )}
            {product.productionDate && !isAvailableInFuture && (
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-1" />
                <span className="text-base">
                  Produced: {format(new Date(product.productionDate), "PPP")}
                </span>
              </div>
            )}
            {product.expiryDate && (
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-1" />
                <span className="text-base">
                  Best before: {format(new Date(product.expiryDate), "PPP")}
                </span>
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
    </div>
  );
};

export default ProductDetail;