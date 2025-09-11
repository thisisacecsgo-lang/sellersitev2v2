import type { Order } from "@/types";
import { set, addDays, subDays } from "date-fns";

const today = new Date();

export const mockOrders: Order[] = [
  {
    id: "order-1",
    productId: "1",
    productName: "Apples",
    productImageUrl: "/images/apple.jpg",
    quantity: "2kg",
    clientName: "Karl Hoffmann",
    status: "Ready for Pickup",
    pickupWindowStart: set(today, { hours: 14, minutes: 0, seconds: 0 }).toISOString(),
    pickupWindowEnd: set(today, { hours: 16, minutes: 0, seconds: 0 }).toISOString(),
  },
  {
    id: "order-2",
    productId: "12",
    productName: "Sourdough Bread",
    productImageUrl: "/images/br.jpg",
    quantity: "350g",
    clientName: "Wilhelm Bauser",
    status: "Pending",
    pickupWindowStart: set(today, { hours: 16, minutes: 30, seconds: 0 }).toISOString(),
    pickupWindowEnd: set(today, { hours: 17, minutes: 0, seconds: 0 }).toISOString(),
  },
  {
    id: "order-3",
    productId: "4",
    productName: "Eggs",
    productImageUrl: "/images/eggs.jpg",
    quantity: "500g",
    clientName: "Sophie Schneider",
    status: "Completed",
    pickupWindowStart: set(today, { hours: 9, minutes: 0, seconds: 0 }).toISOString(),
    pickupWindowEnd: set(today, { hours: 10, minutes: 0, seconds: 0 }).toISOString(),
  },
  {
    id: "order-4",
    productId: "9",
    productName: "Goat Cheese",
    productImageUrl: "/images/ch.jpg",
    quantity: "200g",
    clientName: "Otto Richter",
    status: "Pending",
    pickupWindowStart: set(today, { hours: 15, minutes: 0, seconds: 0 }).toISOString(),
    pickupWindowEnd: set(today, { hours: 16, minutes: 0, seconds: 0 }).toISOString(),
  },
  // Yesterday's order
  {
    id: "order-5",
    productId: "19",
    productName: "Raw Cow's Milk",
    productImageUrl: "/images/mi.jpg",
    quantity: "1l",
    clientName: "Ethan Hunt",
    status: "Completed",
    pickupWindowStart: set(subDays(today, 1), { hours: 11, minutes: 0, seconds: 0 }).toISOString(),
    pickupWindowEnd: set(subDays(today, 1), { hours: 12, minutes: 0, seconds: 0 }).toISOString(),
  },
  // Tomorrow's order
  {
    id: "order-6",
    productId: "13",
    productName: "Carrots",
    productImageUrl: "https://images.unsplash.com/photo-1590868309235-ea34bed7bd7f?q=80&w=2500&auto=format&fit=crop",
    quantity: "1kg",
    clientName: "Fiona Glenanne",
    status: "Pending",
    pickupWindowStart: set(addDays(today, 1), { hours: 10, minutes: 0, seconds: 0 }).toISOString(),
    pickupWindowEnd: set(addDays(today, 1), { hours: 11, minutes: 0, seconds: 0 }).toISOString(),
  },
];