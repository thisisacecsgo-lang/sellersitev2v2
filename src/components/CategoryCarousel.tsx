import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Apple, Carrot, Egg, Wheat, Beef, Fish, Milk, ShoppingBasket } from "lucide-react";

const categories = [
  { name: "All", icon: ShoppingBasket, value: "all" },
  { name: "Fruits and berries", icon: Apple, value: "Fruits and berries" },
  { name: "Vegetables", icon: Carrot, value: "Vegetables" },
  { name: "Bakery", icon: Wheat, value: "Bakery" },
  { name: "Dairy products", icon: Milk, value: "Dairy products" },
  { name: "Meat and poultry", icon: Beef, value: "Meat and poultry" },
  { name: "Seafood", icon: Fish, value: "Seafood" },
  { name: "Animal products", icon: Egg, value: "Animal products" },
];

interface CategoryCarouselProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryCarousel = ({ selectedCategory, onSelectCategory }: CategoryCarouselProps) => {
  return (
    <Carousel
      opts={{
        align: "start",
        dragFree: true,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-4 sm:justify-center">
        {categories.map((category) => (
          <CarouselItem key={category.name} className="basis-auto pl-4">
            <Card
              className={cn(
                "cursor-pointer hover:border-primary transition-colors w-24 h-24",
                selectedCategory === category.value && "border-primary bg-secondary"
              )}
              onClick={() => onSelectCategory(category.value)}
            >
              <CardContent className="flex flex-col items-center justify-center p-2 gap-1 h-full">
                <category.icon className="h-7 w-7 text-primary" />
                <span className="text-xs font-medium text-center">
                  {category.name}
                </span>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
};

export default CategoryCarousel;