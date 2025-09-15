import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Product } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (product: Product) => {
  if (typeof product.price === "number") {
    return `€${product.price.toFixed(2)} / ${product.priceUnit}`;
  }
  return "Free";
};