import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types";
import { Tag, Package, Eye, Edit, MoreVertical, EyeOff, Trash2, Hash, Truck, MapPin, Leaf, Vegan, Wrench, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ProductQuickView } from "./ProductQuickView";
import { cn } from "@/lib/utils";
import CategoryIcon from "./CategoryIcon";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
  className?: string;
  showActions?: boolean;
  onToggleVisibility?: (productId: string) => void;
  onDeleteProduct?: (productId: string) => void;
}

const ProductCard = ({ product, className, showActions = false, onToggleVisibility, onDeleteProduct }: ProductCardProps) => {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const imageUrl = product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : "/placeholder.svg";

  const totalAvailableQuantity = product.batches.reduce((acc, batch) => {
    const quantity = parseFloat(batch.availableQuantity) || 0;
    return acc + quantity;
  }, 0);
  const unit = product.priceUnit;

  const shippingText = () => {
    if (product.deliveryTimeInDays === 0) return "Today";
    if (product.deliveryTimeInDays === 1) return "in 1 day";
    return `in ${product.deliveryTimeInDays} days`;
  };

  return (
    <Dialog open={isQuickViewOpen} onOpenChange={setIsQuickViewOpen}>
      <Card className={cn("w-full overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1", className)}>
        <CardHeader className="p-0 relative">
          <DialogTrigger asChild>
            <div className="overflow-hidden relative cursor-pointer">
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full aspect-[16/9] object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="bg-secondary text-secondary-foreground p-3 rounded-full">
                  <Eye className="h-5 w-5" />
                </div>
              </div>
            </div>
          </DialogTrigger>
          {showActions && (
            <div className="absolute top-2 right-2 z-10">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-background/80 hover:bg-background">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Product Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to={`/product/${product.id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onToggleVisibility?.(product.id)}>
                    <EyeOff className="mr-2 h-4 w-4" />
                    <span>{product.visibility === 'public' ? 'Hide' : 'Show'}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-4 flex-grow flex flex-col space-y-3">
          <div className="flex items-start gap-2 min-h-12">
            <CategoryIcon category={product.category} className="h-6 w-6 text-muted-foreground mt-0.5 flex-shrink-0" />
            <h3 className="text-lg font-bold leading-tight">{product.name}</h3>
          </div>

          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Hash className="h-4 w-4" /><span>{product.articleNumber}</span></div>
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span>{product.region}</span></div>
            <div className="flex items-center gap-2"><Truck className="h-4 w-4" /><span>Earliest shipping: {shippingText()}</span></div>
            <div className="flex items-center gap-2"><Package className="h-4 w-4" /><span>{totalAvailableQuantity} {unit} available</span></div>
            <div className="flex items-center gap-2"><Eye className="h-4 w-4" /><span>Status: {product.visibility === 'public' ? 'Public' : 'Hidden'}</span></div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {product.isVegan && <Badge variant="outline" className="font-normal"><Vegan className="h-3 w-3 mr-1.5" />Vegan</Badge>}
            {product.isVegetarian && !product.isVegan && <Badge variant="outline" className="font-normal"><Leaf className="h-3 w-3 mr-1.5" />Vegetarian</Badge>}
            {product.harvestOnDemand && <Badge variant="outline" className="font-normal"><Wrench className="h-3 w-3 mr-1.5" />Harvest on Demand</Badge>}
          </div>

          <div className="flex-grow"></div>

          <div className="flex items-center gap-2 pt-2">
            <Tag className="h-5 w-5 text-primary" />
            <p className="text-xl font-bold text-primary">
              {typeof product.price === "number"
                ? `€${product.price.toFixed(2)} / ${product.priceUnit}`
                : "Free"}
            </p>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button className="w-full" asChild>
            <Link to={`/product/${product.id}`}>
              <Eye className="mr-2 h-4 w-4" /> View Details
            </Link>
          </Button>
        </CardFooter>
      </Card>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the product "{product.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => onDeleteProduct?.(product.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <DialogContent className="sm:max-w-lg">
        <ProductQuickView product={product} />
      </DialogContent>
    </Dialog>
  );
};

export default ProductCard;