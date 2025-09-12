import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types";
import { Tag, Eye, Calendar, Package, Edit, MoreVertical, EyeOff, Trash2 } from "lucide-react";
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
import { format, formatDistanceToNowStrict, isAfter } from "date-fns";

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

  const freshestBatch = product.batches.length > 0 ? product.batches.reduce((a, b) => new Date(a.productionDate) > new Date(b.productionDate) ? a : b) : null;
  const isAvailableInFuture = freshestBatch && isAfter(new Date(freshestBatch.productionDate), new Date());

  const availabilityText = () => {
    if (!isAvailableInFuture || !freshestBatch) return null;
    const date = new Date(freshestBatch.productionDate);
    const distance = formatDistanceToNowStrict(date, { addSuffix: true });
    return `Available ${distance} (${format(date, "MMM d")})`;
  };

  const totalAvailableQuantity = product.batches.reduce((acc, batch) => {
    const quantity = parseFloat(batch.availableQuantity) || 0;
    return acc + quantity;
  }, 0);
  const unit = product.batches.length > 0 ? (product.batches[0].availableQuantity.replace(/[0-9.,]/g, '').trim()) : '';

  return (
    <Dialog open={isQuickViewOpen} onOpenChange={setIsQuickViewOpen}>
      <Card className={cn("w-full overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1", className)}>
        <CardHeader className="p-0 relative">
          <DialogTrigger asChild>
            <div className="overflow-hidden relative cursor-pointer">
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
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
        <CardContent className="p-3 flex-grow">
          <CardTitle className="text-base font-bold mb-1 leading-tight">
            <Link to={`/product/${product.id}`} className="hover:text-primary transition-colors flex items-start gap-2">
              <CategoryIcon category={product.category} className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span>{product.name}</span>
            </Link>
          </CardTitle>
          {isAvailableInFuture && (
            <div className="flex items-center gap-2 text-sm text-primary font-medium mb-1">
              <Calendar className="h-4 w-4" />
              <span>{availabilityText()}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-primary" />
            <p className="text-base font-semibold text-primary">
              {typeof product.price === "number"
                ? `€${product.price.toFixed(2)}`
                : "Free"}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <Package className="h-4 w-4" />
            <span>{totalAvailableQuantity} {unit}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <Eye className="h-4 w-4" />
            <span>{product.visibility === 'public' ? 'Public' : 'Hidden'}</span>
          </div>
        </CardContent>
        <CardFooter className="p-3 pt-0">
          <Button className="w-full" size="sm" asChild>
            <Link to={`/product/${product.id}`}>View Details</Link>
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
      <DialogContent className="sm:max-w-3xl">
        <ProductQuickView product={product} />
      </DialogContent>
    </Dialog>
  );
};

export default ProductCard;