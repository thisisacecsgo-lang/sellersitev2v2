import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Tag, Info, Package, Eye, Edit } from "lucide-react"; // Import Edit icon
import { Link } from "react-router-dom";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CategoryIcon from "./CategoryIcon";

interface ProductQuickViewProps {
  product: Product;
}

export const ProductQuickView = ({ product }: ProductQuickViewProps) => {
  const imageUrl = product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : "/placeholder.svg";

  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-3">
          <CategoryIcon category={product.category} className="h-6 w-6 text-muted-foreground" />
          <DialogTitle className="text-2xl">{product.name}</DialogTitle>
        </div>
      </DialogHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
        <div>
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-64 object-cover rounded-lg border"
          />
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            <p className="text-2xl font-semibold text-primary">
              {typeof product.price === "number"
                ? `€${product.price.toFixed(2)}`
                : "Free"}
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Package className="h-4 w-4 text-muted-foreground" />
            <p className="text-muted-foreground">Available: {product.availableQuantity}</p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <p className="text-muted-foreground">Status: Public</p>
          </div>
          {product.description && (
            <div className="flex items-start gap-3 text-sm">
              <Info className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
              <p className="text-muted-foreground">{product.description}</p>
            </div>
          )}
          <div className="space-y-2 pt-4">
            <Button size="lg" variant="outline" className="w-full" asChild>
              <Link to={`/product/${product.id}`}>View Full Details</Link>
            </Button>
            <Button size="lg" className="w-full" asChild>
              <Link to={`/product/${product.id}/edit`}>
                <span className="flex items-center gap-2">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Product
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};