import ProductFilters from "./ProductFilters";

interface ProductSidebarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (value: [number, number]) => void;
  maxPrice: number;
  showVegan: boolean;
  onShowVeganChange: (checked: boolean) => void;
  showVegetarian: boolean;
  onShowVegetarianChange: (checked: boolean) => void;
  showHarvestOnDemand: boolean;
  onShowHarvestOnDemandChange: (checked: boolean) => void;
  deliverySpeed: string;
  onDeliverySpeedChange: (value: string) => void;
  showAvailableFrom: boolean;
  onShowAvailableFromChange: (checked: boolean) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

const ProductSidebar = ({
  selectedCategory,
  onSelectCategory,
  ...productFiltersProps
}: ProductSidebarProps) => {
  return (
    <div className="space-y-6">
      <ProductFilters {...productFiltersProps} />
    </div>
  );
};

export default ProductSidebar;