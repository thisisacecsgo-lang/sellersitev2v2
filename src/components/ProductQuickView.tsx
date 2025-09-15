import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Tag, Info, Package, Eye, Edit, Truck, MapPin, Hash, Vegan, Leaf, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CategoryIcon from "./CategoryIcon";
import { Badge } from "@/components/ui/badge";

interface ProductQuickViewProps {
  product: Product;
}

export const ProductQuickView = ({ product }: ProductQuickViewProps) => {
  const imageUrl = product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : "/placeholder.svg";

  const shippingText = () => {
    if (product.deliveryTimeInDays === 0) return "Ready to ship today";
    if (product.deliveryTimeInDays === 1) return "Ready to ship in 1 day";
    return `Ready to ship in ${product.deliveryTimeInDays} days`;
  };

  const totalAvailableQuantity = product.batches.reduce((acc, b) => acc + parseFloat(b.availableQuantity), 0);

  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-3">
          <CategoryIcon category={product.category} className="h-6 w-6 text-muted-foreground" />
          <DialogTitle className="text-2xl">{product.name}</DialogTitle>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground text-sm pl-9">
            <MapPin className="h-4 w-4" />
            <span>{product.region}</span>
        </div>
      </DialogHeader>
      <div className="py-4 space-y-4">
        <div>
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-auto aspect-video object-cover rounded-lg border"
          />
        </div>

        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                <p className="text-2xl font-semibold text-primary">
                {typeof product.price === "number"
                    ? `€${product.price.toFixed(2)} / ${product.priceUnit}`
                    : "Free"}
                </p>
            </div>

            <div className="flex flex-wrap gap-2">
                <Badge variant="secondary"><Hash className="h-3 w-3 mr-1" />{product.articleNumber}</Badge>
                <Badge variant="secondary"><Truck className="h-3 w-3 mr-1" />{shippingText()}</Badge>
                {product.isVegan && <Badge variant="outline"><Vegan className="h-3 w-3 mr-1" />Vegan</Badge>}
                {product.isVegetarian && !product.isVegan && <Badge variant="outline"><Leaf className="h-3 w-3 mr-1" />Vegetarian</Badge>}
                {product.harvestOnDemand && <Badge variant="outline"><Wrench className="h-3 w-3 mr-1" />Harvest on Demand</Badge>}
            </div>

            {product.description && (
                <div className="flex items-start gap-3 text-sm">
                <Info className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                <p className="text-muted-foreground">{product.description}</p>
                </div>
            )}

            <div className="flex items-center gap-3 text-sm">
                <Package className="h-4 w-4 text-muted-foreground" />
                <p className="text-muted-foreground">Available: {totalAvailableQuantity} {product.priceUnit}</p>
            </div>
            <div className="flex items-center gap-3 text-sm">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <p className="text-muted-foreground">Status: {product.visibility === 'public' ? 'Public' : 'Hidden'}</p>
            </div>

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