import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductList from "@/components/ProductList";
import { Filter } from "lucide-react";
import { mockProducts } from "@/data/mockData";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ProductSidebar from "@/components/ProductSidebar";
import type { Product } from "@/types";
import CategoryCarousel from "@/components/CategoryCarousel";
import { Separator } from "@/components/ui/separator";
import { isAfter } from "date-fns";

const Index = () => {
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showVegan, setShowVegan] = useState(false);
  const [showVegetarian, setShowVegetarian] = useState(false);
  const [showHarvestOnDemand, setShowHarvestOnDemand] = useState(false);
  const [deliverySpeed, setDeliverySpeed] = useState("any");
  const [showAvailableFrom, setShowAvailableFrom] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const maxPrice = useMemo(
    () =>
      Math.ceil(
        mockProducts.reduce((max, p) => {
          if (typeof p.price === "number" && p.price > max) {
            return p.price;
          }
          return max;
        }, 0),
      ),
    [],
  );

  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);

  const filteredAndSortedProducts = useMemo(() => {
    const availableProducts = mockProducts.filter(
      (p) => p.status === "available",
    );

    const filtered = availableProducts.filter((product) => {
      const categoryMatch = category === "all" || product.category === category;

      const veganMatch = !showVegan || product.isVegan;
      const vegetarianMatch = !showVegetarian || product.isVegetarian;
      const harvestOnDemandMatch = !showHarvestOnDemand || product.harvestOnDemand;

      const price = typeof product.price === "number" ? product.price : 0;
      const priceMatch = price >= priceRange[0] && price <= priceRange[1];

      const deliveryMatch = (() => {
        if (deliverySpeed === "any") return true;
        if (deliverySpeed === "today") return product.deliveryTimeInDays <= 1;
        if (deliverySpeed === "tomorrow")
          return product.deliveryTimeInDays > 1 && product.deliveryTimeInDays <= 2;
        if (deliverySpeed === "2-3")
          return product.deliveryTimeInDays > 2 && product.deliveryTimeInDays <= 3;
        if (deliverySpeed === "3+") return product.deliveryTimeInDays > 3;
        return true;
      })();

      const isFutureProduct = product.productionDate ? isAfter(new Date(product.productionDate), new Date()) : false;
      const availableFromMatch = showAvailableFrom ? isFutureProduct : !isFutureProduct;
      
      const statusMatch = statusFilter === "all" || product.visibility === statusFilter;

      return (
        categoryMatch &&
        priceMatch &&
        veganMatch &&
        vegetarianMatch &&
        harvestOnDemandMatch &&
        deliveryMatch &&
        availableFromMatch &&
        statusMatch
      );
    });

    const sorted: Product[] = [...filtered];
    if (sortBy === "price-asc") {
      sorted.sort((a, b) => {
        const priceA = a.price === "free" ? 0 : a.price || 0;
        const priceB = b.price === "free" ? 0 : b.price || 0;
        return priceA - priceB;
      });
    } else if (sortBy === "price-desc") {
      sorted.sort((a, b) => {
        const priceA = a.price === "free" ? 0 : a.price || 0;
        const priceB = b.price === "free" ? 0 : b.price || 0;
        return priceB - a.price;
      });
    } else {
      // newest is default
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }
    return sorted;
  }, [
    category,
    priceRange,
    sortBy,
    showVegan,
    showVegetarian,
    showHarvestOnDemand,
    deliverySpeed,
    showAvailableFrom,
    statusFilter,
  ]);

  const sidebarProps = {
    selectedCategory: category,
    onSelectCategory: setCategory,
    priceRange,
    onPriceRangeChange: setPriceRange,
    maxPrice,
    showVegan,
    onShowVeganChange: setShowVegan,
    showVegetarian,
    onShowVegetarianChange: setShowVegetarian,
    showHarvestOnDemand,
    onShowHarvestOnDemandChange: setShowHarvestOnDemand,
    deliverySpeed,
    onDeliverySpeedChange: setDeliverySpeed,
    showAvailableFrom,
    onShowAvailableFromChange: setShowAvailableFrom,
    statusFilter,
    onStatusFilterChange: setStatusFilter,
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <section className="mb-8">
        <h2 className="text-3xl font-bold text-center mb-2">
          Find Fresh Local Goods
        </h2>
        <p className="text-muted-foreground text-center mb-6">
          Discover surplus food from local gardens and farms near you.
        </p>
        <CategoryCarousel selectedCategory={category} onSelectCategory={setCategory} />
      </section>

      <Separator className="mb-8" />

      <div className="grid lg:grid-cols-4 gap-8">
        <aside className="hidden lg:block lg:col-span-1 lg:sticky lg:top-24 self-start max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
          <ProductSidebar {...sidebarProps} />
        </aside>
        <div className="lg:col-span-3">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h3 className="text-2xl font-bold">Current Listings</h3>
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="overflow-y-auto w-full max-w-sm custom-scrollbar">
                  <SheetHeader>
                    <SheetTitle>Filters & Search</SheetTitle>
                  </SheetHeader>
                  <div className="py-4">
                    <ProductSidebar {...sidebarProps} />
                  </div>
                </SheetContent>
              </Sheet>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">
                    Price: High to Low
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <ProductList products={filteredAndSortedProducts} />
        </div>
      </div>
    </div>
  );
};

export default Index;