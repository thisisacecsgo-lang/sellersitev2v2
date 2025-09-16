import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Tag, Info, Package, Eye, Edit, MapPin, Hash, Vegan, Leaf, Wrench, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CategoryIcon from "./CategoryIcon";
import { Badge } from "@/components/ui/badge";

interface ProductQuickViewProps {
  product: Product;
}

export const ProductQuickView = ({ product }: ProductQuickViewProps) => {
  const imageUrl = product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : "/placeholder.svg";

  const totalAvailableQuantity = product.batches.reduce((acc, b) => acc + parseFloat(b.availableQuantity), 0);

  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-3">
          <CategoryIcon category={product.category} className="h-6 w-6 text-muted-foreground" />
          <DialogTitle className="text-2xl">{product.name}</DialogTitle>
        </div>
      </DialogHeader>
      <div className="py-4 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
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

            <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="font-normal text-xs"><Hash className="h-3 w-3 mr-1" />{product.articleNumber}</Badge>
                <Badge variant="secondary" className="font-normal text-xs"><MapPin className="h-3 w-3 mr-1" />{product.region}</Badge>
                <Badge variant="secondary" className="font-normal text-xs"><Package className="h-3 w-3 mr-1" />{totalAvailableQuantity} {product.priceUnit}</Badge>
                <Badge variant="secondary" className="font-normal text-xs"><Eye className="h-3 w-3 mr-1" />{product.visibility === 'public' ? 'Public' : 'Hidden'}</Badge>
                {product.certification && <Badge variant="outline" className="font-normal text-xs border-green-600 text-green-700"><ShieldCheck className="h-3 w-3 mr-1" />{product.certification}</Badge>}
                {product.isVegan && <Badge variant="outline" className="font-normal text-xs"><Vegan className="h-3 w-3 mr-1" />Vegan</Badge>}
                {product.isVegetarian && !product.isVegan && <Badge variant="outline" className="font-normal text-xs"><Leaf className="h-3 w-3 mr-1" />Vegetarian</Badge>}
                {product.harvestOnDemand && <Badge variant="outline" className="font-normal text-xs"><Wrench className="h-3 w-3 mr-1" />On Demand</Badge>}
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