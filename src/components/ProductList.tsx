import type { Product } from "@/types";
import ProductCard from "./ProductCard";

interface ProductListProps {
  products: Product[];
  showActions?: boolean;
  onToggleVisibility?: (productId: string) => void;
  onDeleteProduct?: (productId: string) => void;
}

const ProductList = ({ products, showActions, onToggleVisibility, onDeleteProduct }: ProductListProps) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold">No products found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          showActions={showActions}
          onToggleVisibility={onToggleVisibility}
          onDeleteProduct={onDeleteProduct}
        />
      ))}
    </div>
  );
};

export default ProductList;