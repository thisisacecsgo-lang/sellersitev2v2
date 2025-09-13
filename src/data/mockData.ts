import type { Seller, Product } from "@/types";
import { addDays } from "date-fns";

const now = new Date();

export const mockSellers: Seller[] = [
  {
    id: "seller-5",
    name: "Lars Neumann",
    region: "Flensburg",
    logoUrl: "/images/avt.jpg",
    verified: false,
    location: { lat: 46.1879, lon: -123.8313 },
    description: "Age: 47\n" +
        "• Production: Small-scale honey from his own beehives\n" +
        "• Motivation: Shares surplus honey with the community, values nature and biodiversity\n" +
        "• Values: Purity, tradition, ecological balance\n" +
        "• Background: Engineer by profession, beekeeping as a passion project", // Added description
    reviews: [
        {
            id: "review-5",
            buyerName: "Ethan",
            rating: 5,
            comment: "The oysters were incredibly fresh, like they were just pulled from the water. Amazing!",
            date: "2024-10-29T18:00:00Z",
        },
        {
            id: "review-6",
            buyerName: "Fiona",
            rating: 4,
            comment: "Smoked salmon was delicious, though a bit saltier than I prefer. Would still order again.",
            date: "2024-10-27T12:30:00Z",
            sellerReply: {
                text: "Thank you for your feedback, Fiona! We're glad you enjoyed the salmon. We'll take your comment about the saltiness into consideration for our next batch.",
                date: "2024-10-28T09:00:00Z"
            }
        },
    ],
    totalAds: 17,
    totalSold: 1,
    profileViews: 72,
  }
];

export const mockProducts: Product[] = [
  {
    id: "1",
    sellerId: "seller-5",
    name: "Apples",
    articleNumber: "10001",
    category: "Fruits and berries",
    price: 5.99,
    priceUnit: "kg",
    region: "Flensburg",
    imageUrls: ["/images/apple.jpg"],
    description:
      "Freshly picked organic Gala apples. Sweet and crisp, perfect for snacking or baking.",
    status: "available",
    visibility: "public",
    createdAt: "2025-05-28T10:00:00Z",
    isVegan: true,
    isVegetarian: true,
    harvestOnDemand: false,
    deliveryTimeInDays: 1,
    freshness: "fresh",
    batches: [
      { id: "batch-1a", productionDate: "2025-05-27T00:00:00Z", expiryDate: "2025-08-30T00:00:00Z", availableQuantity: "1kg" },
      { id: "batch-1b", productionDate: "2025-05-20T00:00:00Z", expiryDate: "2025-08-23T00:00:00Z", availableQuantity: "3kg" }
    ]
  },
  {
    id: "4",
    sellerId: "seller-5",
    name: "Eggs",
    articleNumber: "20001",
    category: "Animal products",
    price: 4.5,
    priceUnit: "dozen",
    region: "Flensburg",
    imageUrls: ["/images/eggs.jpg"],
    description:
      "A dozen large brown eggs from happy, free-roaming chickens. Rich yolks and firm whites.",
    status: "available",
    visibility: "public",
    createdAt: "2025-04-25T13:00:00Z",
    isVegan: false,
    isVegetarian: true,
    harvestOnDemand: false,
    deliveryTimeInDays: 1,
    freshness: "fresh",
    batches: [
      { id: "batch-4a", productionDate: "2025-03-24T00:00:00Z", expiryDate: "2025-11-15T00:00:00Z", availableQuantity: "2kg" }
    ]
  },
  {
    id: "10",
    sellerId: "seller-5",
    name: "Chicken Thighs",
    articleNumber: "30001",
    category: "Meat and poultry",
    price: 12.0,
    priceUnit: "kg",
    region: "Flensburg",
    imageUrls: ["/images/c.jpg"],
    description: "Juicy and flavorful chicken thighs from pasture-raised birds.",
    status: "available",
    visibility: "public",
    createdAt: "2025-04-25T13:00:00Z",
    isVegan: false,
    isVegetarian: false,
    harvestOnDemand: false,
    deliveryTimeInDays: 2,
    freshness: "frozen",
    batches: [
      { id: "batch-10a", productionDate: "2025-06-22T00:00:00Z", expiryDate: "2025-08-21T00:00:00Z", availableQuantity: "500g" }
    ]
  },
  {
    id: "13",
    sellerId: "seller-5",
    name: "Carrots",
    articleNumber: "10002",
    category: "Vegetables",
    price: 3.5,
    priceUnit: "kg",
    region: "Flensburg",
    imageUrls: ["https://images.unsplash.com/photo-1590868309235-ea34bed7bd7f?q=80&w=2500&auto=format&fit=crop", "https://images.unsplash.com/photo-1582515072990-f23b7e418185?q=80&w=2500&auto=format&fit=crop", "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=2500&auto=format&fit=crop"],
    description: "Sweet and crunchy organic carrots, straight from the farm.",
    status: "available",
    visibility: "public",
    createdAt: "2025-04-25T13:00:00Z",
    isVegan: true,
    isVegetarian: true,
    harvestOnDemand: true,
    deliveryTimeInDays: 1,
    freshness: "fresh",
    batches: [
      { id: "batch-13a", productionDate: "2025-03-24T00:00:00Z", expiryDate: "2025-11-15T00:00:00Z", availableQuantity: "3kg" }
    ]
  },
  {
    id: "9",
    sellerId: "seller-5",
    name: "Goat Cheese",
    articleNumber: "40001",
    category: "Dairy products",
    price: 8.5,
    priceUnit: "piece",
    region: "Flensburg",
    imageUrls: ["/images/ch.jpg"],
    description: "Creamy and tangy goat cheese, handmade from fresh goat milk.",
    status: "available",
    visibility: "public",
    createdAt: "2025-04-25T13:00:00Z",
    isVegan: false,
    isVegetarian: true,
    harvestOnDemand: true,
    deliveryTimeInDays: 2,
    freshness: "fresh",
    batches: [
      { id: "batch-9a", productionDate: "2025-07-12T00:00:00Z", expiryDate: "2025-10-05T00:00:00Z", availableQuantity: "200g" },
      { id: "batch-9b", productionDate: "2025-07-05T00:00:00Z", expiryDate: "2025-09-28T00:00:00Z", availableQuantity: "150g" }
    ]
  },
  {
    id: "12",
    sellerId: "seller-5",
    name: "Sourdough Bread",
    articleNumber: "50001",
    category: "Bakery",
    price: 8.0,
    priceUnit: "loaf",
    region: "Flensburg",
    imageUrls: ["/images/br.jpg"],
    description: "Crusty, tangy sourdough, baked fresh daily. Perfect for sandwiches or toast.",
    status: "available",
    visibility: "public",
    createdAt: "2025-04-25T13:00:00Z",
    isVegan: true,
    isVegetarian: true,
    harvestOnDemand: false,
    deliveryTimeInDays: 1,
    freshness: "fresh",
    batches: [
      { id: "batch-12a", productionDate: "2025-05-20T00:00:00Z", expiryDate: "2025-09-27T00:00:00Z", availableQuantity: "600g" }
    ]
  },
  {
    id: "19",
    sellerId: "seller-5",
    name: "Raw Cow's Milk",
    articleNumber: "40002",
    category: "Dairy products",
    price: 9.0,
    priceUnit: "l",
    region: "Flensburg",
    imageUrls: ["/images/mi.jpg"],
    description: "Fresh, unpasteurized raw milk from Jersey cows. Creamy and delicious.",
    status: "available",
    visibility: "public",
    createdAt: "2025-04-25T13:00:00Z",
    isVegan: false,
    isVegetarian: true,
    harvestOnDemand: false,
    deliveryTimeInDays: 2,
    freshness: "fresh",
    batches: [
      { id: "batch-19a", productionDate: "2025-08-13T00:00:00Z", expiryDate: "2025-08-30T00:00:00Z", availableQuantity: "1l" }
    ]
  },
  {
    id: "20",
    sellerId: "seller-5",
    name: "raw Salmon Fillet",
    articleNumber: "60001",
    category: "Seafood",
    price: 18.0,
    priceUnit: "kg",
    region: "Flensburg",
    imageUrls: ["/images/me.jpg"],
    description: "Sustainably sourced salmon, perfect for grilling or baking.",
    status: "available",
    visibility: "public",
    createdAt: "2025-04-25T13:00:00Z",
    isVegan: false,
    isVegetarian: false,
    harvestOnDemand: false,
    deliveryTimeInDays: 2,
    freshness: "fresh",
    batches: [
      { id: "batch-20a", productionDate: "2025-03-24T00:00:00Z", expiryDate: "2025-11-23T00:00:00Z", availableQuantity: "1.5kg" }
    ]
  },
  {
    id: "3",
    sellerId: "seller-5",
    name: "Homemade Strawberry Jam",
    articleNumber: "10003",
    category: "Fruits and berries",
    price: 7.0,
    priceUnit: "jar",
    region: "Flensburg",
    imageUrls: ["/images/jam.jpg"],
    description:
      "Made with love from local strawberries. No artificial preservatives. Spread it on toast or enjoy with scones.",
    status: "available",
    visibility: "public",
    createdAt: "2025-04-25T13:00:00Z",
    isVegan: true,
    isVegetarian: true,
    harvestOnDemand: true,
    deliveryTimeInDays: 3,
    freshness: "canned",
    batches: [
      { id: "batch-3a", productionDate: "2025-05-14T00:00:00Z", expiryDate: "2025-12-06T00:00:00Z", availableQuantity: "250g" }
    ]
  },
  {
    id: "11",
    sellerId: "seller-5",
    name: "Wildflower Honey",
    articleNumber: "20002",
    category: "Animal products",
    price: 9.0,
    priceUnit: "jar",
    region: "Flensburg",
    imageUrls: ["https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?q=80&w=2500&auto=format&fit=crop", "https://images.unsplash.com/photo-1587049352851-8d4e89133924?q=80&w=2500&auto=format&fit=crop", "https://images.unsplash.com/photo-1571108400537-e6c278735a8a?q=80&w=2500&auto=format&fit=crop"],
    description: "Raw and unfiltered honey from local wildflowers. A taste of nature.",
    status: "available",
    visibility: "public",
    createdAt: "2025-04-25T13:00:00Z",
    isVegan: false,
    isVegetarian: true,
    harvestOnDemand: false,
    deliveryTimeInDays: 4,
    freshness: "canned",
    batches: [
      { id: "batch-11a", productionDate: "2025-06-04T00:00:00Z", expiryDate: "2025-10-11T00:00:00Z", availableQuantity: "300g" }
    ]
  },
  {
    id: "14",
    sellerId: "seller-5",
    name: "Frozen Blueberries",
    articleNumber: "10004",
    category: "Fruits and berries",
    price: 10.5,
    priceUnit: "pack",
    region: "Flensburg",
    imageUrls: ["/images/bl.jpg"],
    description: "Hand-picked blueberries, frozen at peak ripeness to lock in flavor and nutrients.",
    status: "available",
    visibility: "public",
    createdAt: "2025-04-25T13:00:00Z",
    isVegan: true,
    isVegetarian: true,
    harvestOnDemand: false,
    deliveryTimeInDays: 3,
    freshness: "frozen",
    batches: [
      { id: "batch-14a", productionDate: "2025-04-08T00:00:00Z", expiryDate: "2025-09-16T00:00:00Z", availableQuantity: "500g" }
    ]
  },
  {
    id: "17",
    sellerId: "seller-5",
    name: "Fresh Raspberries",
    articleNumber: "10005",
    category: "Fruits and berries",
    price: 6.0,
    priceUnit: "pack",
    region: "Flensburg",
    imageUrls: ["/images/ras.jpg"],
    description: "Delicate and sweet raspberries, picked this morning.",
    status: "available",
    visibility: "public",
    createdAt: "2025-04-25T13:00:00Z",
    isVegan: true,
    isVegetarian: true,
    harvestOnDemand: true,
    deliveryTimeInDays: 2,
    freshness: "fresh",
    batches: [
      { id: "batch-17a", productionDate: "2025-04-30T00:00:00Z", expiryDate: "2025-08-17T00:00:00Z", availableQuantity: "3kg" }
    ]
  },
  {
    id: "26",
    sellerId: "seller-5",
    name: "Organic Quinoa",
    articleNumber: "50002",
    category: "Bakery",
    price: 11.50,
    priceUnit: "kg",
    region: "Flensburg",
    imageUrls: ["/images/ki.jpg"],
    description: "High-protein organic white quinoa. A versatile and healthy grain.",
    status: "available",
    visibility: "public",
    createdAt: now.toISOString(),
    isVegan: true,
    isVegetarian: true,
    harvestOnDemand: false,
    deliveryTimeInDays: 3,
    freshness: "canned",
    batches: [
      { id: "batch-26a", productionDate: addDays(now, -30).toISOString(), expiryDate: addDays(now, 335).toISOString(), availableQuantity: "1kg" }
    ]
  },
  {
    id: "28",
    sellerId: "seller-5",
    name: "Fresh Oysters",
    articleNumber: "60002",
    category: "Seafood",
    price: 24.00,
    priceUnit: "dozen",
    region: "Flensburg",
    imageUrls: ["/images/ou.jpg"],
    description: "Freshly harvested oysters from the Oregon coast. Perfect for serving on the half shell.",
    status: "available",
    visibility: "public",
    createdAt: now.toISOString(),
    isVegan: false,
    isVegetarian: false,
    harvestOnDemand: true,
    deliveryTimeInDays: 1,
    freshness: "fresh",
    batches: [
      { id: "batch-28a", productionDate: addDays(now, -1).toISOString(), expiryDate: addDays(now, 2).toISOString(), availableQuantity: "1kg" }
    ]
  },
  {
    id: "29",
    sellerId: "seller-5",
    name: "Smoked Salmon",
    articleNumber: "60003",
    category: "Seafood",
    price: 16.50,
    priceUnit: "pack",
    region: "Flensburg",
    imageUrls: ["/images/sal.jpg"],
    description: "Locally caught salmon, expertly smoked over alder wood. Rich and savory.",
    status: "available",
    visibility: "public",
    createdAt: addDays(now, -10).toISOString(),
    isVegan: false,
    isVegetarian: false,
    harvestOnDemand: false,
    deliveryTimeInDays: 3,
    freshness: "frozen",
    batches: [
      { id: "batch-29a", productionDate: addDays(now, -12).toISOString(), expiryDate: addDays(now, 20).toISOString(), availableQuantity: "200g" }
    ]
  },
  {
    id: "30",
    sellerId: "seller-5",
    name: "Dungeness Crab",
    articleNumber: "60004",
    category: "Seafood",
    price: 28.00,
    priceUnit: "piece",
    region: "Flensburg",
    imageUrls: ["https://images.unsplash.com/photo-1601192042869-a8a346349df8?q=80&w=2500&auto=format&fit=crop", "https://images.unsplash.com/photo-1553634440-a396d817152e?q=80&w=2500&auto=format&fit=crop", "https://images.unsplash.com/photo-1562720131-b608a1723a95?q=80&w=2500&auto=format&fit=crop"],
    description: "A large, cooked Dungeness crab, ready to be cracked and enjoyed. Sweet and succulent meat.",
    status: "sold",
    visibility: "public",
    createdAt: addDays(now, -5).toISOString(),
    isVegan: false,
    isVegetarian: false,
    harvestOnDemand: false,
    deliveryTimeInDays: 1,
    freshness: "fresh",
    batches: []
  },
  {
    id: "31",
    sellerId: "seller-5",
    name: "Canned Albacore Tuna",
    articleNumber: "60005",
    category: "Seafood",
    price: 9.50,
    priceUnit: "can",
    region: "Flensburg",
    imageUrls: ["/images/tun.jpg"],
    description: "High-quality, line-caught albacore tuna canned in its own juices. Perfect for salads and sandwiches.",
    status: "available",
    visibility: "public",
    createdAt: addDays(now, -40).toISOString(),
    isVegan: false,
    isVegetarian: false,
    harvestOnDemand: false,
    deliveryTimeInDays: 4,
    freshness: "canned",
    batches: [
      { id: "batch-31a", productionDate: addDays(now, -50).toISOString(), expiryDate: addDays(now, 1045).toISOString(), availableQuantity: "3kg" }
    ]
  },
];