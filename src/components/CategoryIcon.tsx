import { Apple, Carrot, Egg, Wheat, Beef, Fish, Milk, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";

const categoryIcons: { [key: string]: React.ElementType } = {
  "Fruits and berries": Apple,
  "Vegetables": Carrot,
  "Animal products": Egg,
  "Bakery": Wheat,
  "Meat and poultry": Beef,
  "Seafood": Fish,
  "Dairy products": Milk,
};

interface CategoryIconProps {
  category: string;
  className?: string;
}

const CategoryIcon = ({ category, className }: CategoryIconProps) => {
  const Icon = categoryIcons[category] || Sprout;
  return <Icon className={cn("h-4 w-4", className)} />;
};

export default CategoryIcon;