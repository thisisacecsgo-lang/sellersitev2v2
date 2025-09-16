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
    type: "private", // Set seller type to private
  }
];

export const mockProducts: Product[] = [
  {
    id: "1",
    sellerId: "seller-5",
    name: "Apples",
    articleNumber: "10001",
    category: "Fruits and berries",
    price: 2.99,
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
    certification: "Bio",
    batches: [
      { id: "batch-1a", productionDate: "2025-05-27T00:00:00Z", expiryDate: "2025-08-30T00:00:00Z", availableQuantity: "1kg" },
      { id: "batch-1b", productionDate: "2025-05-20T00:00:00Z", expiryDate: "2025-08-23T00:00:00Z", availableQuantity: "3kg" },
      { id: "batch-1c", productionDate: "2025-05-15T00:00:00Z", expiryDate: "2025-08-15T00:00:00Z", availableQuantity: "5kg" }
    ]
  },
  {
    id: "4",
    sellerId: "seller-5",
    name: "Eggs",
    articleNumber: "20001",
    category: "Animal products",
    price: 0.38,
    priceUnit: "piece",
    region: "Flensburg",
    imageUrls: ["/images/eggs.jpg"],
    description:
      "Large brown eggs from happy, free-roaming chickens. Rich yolks and firm whites.",
    status: "available",
    visibility: "public",
    createdAt: "2025-04-25T13:00:00Z",
    isVegan: false,
    isVegetarian: true,
    harvestOnDemand: false,
    deliveryTimeInDays: 1,
    freshness: "fresh",
    batches: [
      { id: "batch-4a", productionDate: "2025-03-24T00:00:00Z", expiryDate: "2025-11-15T00:00:00Z", availableQuantity: "24 piece" },
      { id: "batch-4b", productionDate: "2025-03-20T00:00:00Z", expiryDate: "2025-11-10T00:00:00Z", availableQuantity: "12 piece" },
      { id: "batch-4c", productionDate: "2025-03-15T00:00:00Z", expiryDate: "2025-11-01T00:00:00Z", availableQuantity: "36 piece" }
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
      { id: "batch-10a", productionDate: "2025-06-22T00:00:00Z", expiryDate: "2025-08-21T00:00:00Z", availableQuantity: "5kg" },
      { id: "batch-10b", productionDate: "2025-06-15T00:00:00Z", expiryDate: "2025-08-14T00:00:00Z", availableQuantity: "2.5kg" },
      { id: "batch-10c", productionDate: "2025-06-10T00:00:00Z", expiryDate: "2025-08-09T00:00:00Z", availableQuantity: "7kg" }
    ]
  },
  {
    id: "13",
    sellerId: "seller-5",
    name: "Carrots",
    articleNumber: "10002",
    category: "Vegetables",
    price: 2.49,
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
    certification: "Demeter",
    batches: [
      { id: "batch-13a", productionDate: "2025-03-24T00:00:00Z", expiryDate: "2025-11-15T00:00:00Z", availableQuantity: "3kg" },
      { id: "batch-13b", productionDate: "2025-03-20T00:00:00Z", expiryDate: "2025-11-10T00:00:00Z", availableQuantity: "5kg" },
      { id: "batch-13c", productionDate: "2025-03-18T00:00:00Z", expiryDate: "2025-11-05T00:00:00Z", availableQuantity: "2kg" }
    ]
  },
  {
    id: "9",
    sellerId: "seller-5",
    name: "Goat Cheese",
    articleNumber: "40001",
    category: "Dairy products",
    price: 42.5,
    priceUnit: "kg",
    region: "Flensburg",
    imageUrls: ["/images/ch.jpg"],
    description: "Creamy and tangy goat cheese, handmade from fresh goat milk. (Sold in 200g pieces)",
    status: "available",
    visibility: "public",
    createdAt: "2025-04-25T13:00:00Z",
    isVegan: false,
    isVegetarian: true,
    harvestOnDemand: true,
    deliveryTimeInDays: 2,
    freshness: "fresh",
    batches: [
      { id: "batch-9a", productionDate: "2025-07-12T00:00:00Z", expiryDate: "2025-10-05T00:00:00Z", availableQuantity: "2kg" },
      { id: "batch-9b", productionDate: "2025-07-05T00:00:00Z", expiryDate: "2025-09-28T00:00:00Z", availableQuantity: "1.5kg" },
      { id: "batch-9c", productionDate: "2025-06-28T00:00:00Z", expiryDate: "2025-09-20T00:00:00Z", availableQuantity: "3kg" }
    ]
  },
  {
    id: "12",
    sellerId: "seller-5",
    name: "Sourdough Bread",
    articleNumber: "50001",
    category: "Bakery",
    price: 13.33,
    priceUnit: "kg",
    region: "Flensburg",
    imageUrls: ["/images/br.jpg"],
    description: "Crusty, tangy sourdough, baked fresh daily. Perfect for sandwiches or toast. (Sold in 600g loaves)",
    status: "available",
    visibility: "public",
    createdAt: "2025-04-25T13:00:00Z",
    isVegan: true,
    isVegetarian: true,
    harvestOnDemand: false,
    deliveryTimeInDays: 1,
    freshness: "fresh",
    batches: [
      { id: "batch-12a", productionDate: "2025-05-20T00:00:00Z", expiryDate: "2025-09-27T00:00:00Z", availableQuantity: "6kg" },
      { id: "batch-12b", productionDate: "2025-05-19T00:00:00Z", expiryDate: "2025-09-26T00:00:00Z", availableQuantity: "4.8kg" },
      { id: "batch-12c", productionDate: "2025-05-18T00:00:00Z", expiryDate: "2025-09-25T00:00:00Z", availableQuantity: "3kg" }
    ]
  },
  {
    id: "19",
    sellerId: "seller-5",
    name: "Raw Cow's Milk",
    articleNumber: "40002",
    category: "Dairy products",
    price: 2.50,
    priceUnit: "liter",
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
      { id: "batch-19a", productionDate: "2025-08-13T00:00:00Z", expiryDate: "2025-08-30T00:00:00Z", availableQuantity: "10 liter" },
      { id: "batch-19b", productionDate: "2025-08-12T00:00:00Z", expiryDate: "2025-08-29T00:00:00Z", availableQuantity: "5 liter" },
      { id: "batch-19c", productionDate: "2025-08-11T00:00:00Z", expiryDate: "2025-08-28T00:00:00Z", availableQuantity: "15 liter" }
    ]
  },
  {
    id: "20",
    sellerId: "seller-5",
    name: "raw Salmon Fillet",
    articleNumber: "60001",
    category: "Seafood",
    price: 35.0,
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
    freshness: "frozen",
    batches: [
      { id: "batch-20a", productionDate: "2025-03-24T00:00:00Z", expiryDate: "2025-11-23T00:00:00Z", availableQuantity: "1.5kg" },
      { id: "batch-20b", productionDate: "2025-03-22T00:00:00Z", expiryDate: "2025-11-20T00:00:00Z", availableQuantity: "3kg" },
      { id: "batch-20c", productionDate: "2025-03-20T00:00:00Z", expiryDate: "2025-11-18T00:00:00Z", availableQuantity: "2kg" }
    ]
  },
  {
    id: "3",
    sellerId: "seller-5",
    name: "Homemade Strawberry Jam",
    articleNumber: "10003",
    category: "Fruits and berries",
    price: 24.0,
    priceUnit: "kg",
    region: "Flensburg",
    imageUrls: ["/images/jam.jpg"],
    description:
      "Made with love from local strawberries. No artificial preservatives. (Sold in 250g jars)",
    status: "available",
    visibility: "public",
    createdAt: "2025-04-25T13:00:00Z",
    isVegan: true,
    isVegetarian: true,
    harvestOnDemand: true,
    deliveryTimeInDays: 3,
    freshness: "canned",
    batches: [
      { id: "batch-3a", productionDate: "2025-05-14T00:00:00Z", expiryDate: "2025-12-06T00:00:00Z", availableQuantity: "2.5kg" },
      { id: "batch-3b", productionDate: "2025-04-20T00:00:00Z", expiryDate: "2025-11-15T00:00:00Z", availableQuantity: "1.5kg" },
      { id: "batch-3c", productionDate: "2025-04-10T00:00:00Z", expiryDate: "2025-11-01T00:00:00Z", availableQuantity: "4kg" }
    ]
  },
  {
    id: "11",
    sellerId: "seller-5",
    name: "Wildflower Honey",
    articleNumber: "20002",
    category: "Animal products",
    price: 30.0,
    priceUnit: "kg",
    region: "Flensburg",
    imageUrls: ["https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?q=80&w=2500&auto=format&fit=crop", "https://images.unsplash.com/photo-1587049352851-8d4e89133924?q=80&w=2500&auto=format&fit=crop", "https://images.unsplash.com/photo-1571108400537-e6c278735a8a?q=80&w=2500&auto=format&fit=crop"],
    description: "Raw and unfiltered honey from local wildflowers. A taste of nature. (Sold in 300g jars)",
    status: "available",
    visibility: "public",
    createdAt: "2025-04-25T13:00:00Z",
    isVegan: false,
    isVegetarian: true,
    harvestOnDemand: false,
    deliveryTimeInDays: 4,
    freshness: "canned",
    batches: [
      { id: "batch-11a", productionDate: "2025-06-04T00:00:00Z", expiryDate: "2025-10-11T00:00:00Z", availableQuantity: "3kg" },
      { id: "batch-11b", productionDate: "2025-05-28T00:00:00Z", expiryDate: "2025-09-20T00:00:00Z", availableQuantity: "1.2kg" },
      { id: "batch-11c", productionDate: "2025-05-15T00:00:00Z", expiryDate: "2025-09-01T00:00:00Z", availableQuantity: "6kg" }
    ]
  },
  {
    id: "14",
    sellerId: "seller-5",
    name: "Frozen Blueberries",
    articleNumber: "10004",
    category: "Fruits and berries",
    price: 11.99,
    priceUnit: "kg",
    region: "Flensburg",
    imageUrls: ["/images/bl.jpg"],
    description: "Hand-picked blueberries, frozen at peak ripeness to lock in flavor and nutrients. (Sold in 500g packs)",
    status: "available",
    visibility: "public",
    createdAt: "2025-04-25T13:00:00Z",
    isVegan: true,
    isVegetarian: true,
    harvestOnDemand: false,
    deliveryTimeInDays: 3,
    freshness: "frozen",
    batches: [
      { id: "batch-14a", productionDate: "2025-04-08T00:00:00Z", expiryDate: "2025-09-16T00:00:00Z", availableQuantity: "5kg" },
      { id: "batch-14b", productionDate: "2025-03-20T00:00:00Z", expiryDate: "2025-08-20T00:00:00Z", availableQuantity: "10kg" },
      { id: "batch-14c", productionDate: "2025-03-10T00:00:00Z", expiryDate: "2025-08-10T00:00:00Z", availableQuantity: "2.5kg" }
    ]
  },
  {
    id: "17",
    sellerId: "seller-5",
    name: "Fresh Raspberries",
    articleNumber: "10005",
    category: "Fruits and berries",
    price: 28.0,
    priceUnit: "kg",
    region: "Flensburg",
    imageUrls: ["/images/ras.jpg"],
    description: "Delicate and sweet raspberries, picked this morning. (Sold in 125g packs)",
    status: "available",
    visibility: "public",
    createdAt: "2025-04-25T13:00:00Z",
    isVegan: true,
    isVegetarian: true,
    harvestOnDemand: true,
    deliveryTimeInDays: 2,
    freshness: "fresh",
    batches: [
      { id: "batch-17a", productionDate: "2025-04-30T00:00:00Z", expiryDate: "2025-08-17T00:00:00Z", availableQuantity: "3kg" },
      { id: "batch-17b", productionDate: "2025-04-29T00:00:00Z", expiryDate: "2025-08-16T00:00:00Z", availableQuantity: "1kg" },
      { id: "batch-17c", productionDate: "2025-04-28T00:00:00Z", expiryDate: "2025-08-15T00:00:00Z", availableQuantity: "2.5kg" }
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
      { id: "batch-26a", productionDate: addDays(now, -30).toISOString(), expiryDate: addDays(now, 335).toISOString(), availableQuantity: "1kg" },
      { id: "batch-26b", productionDate: addDays(now, -45).toISOString(), expiryDate: addDays(now, 320).toISOString(), availableQuantity: "5kg" },
      { id: "batch-26c", productionDate: addDays(now, -60).toISOString(), expiryDate: addDays(now, 305).toISOString(), availableQuantity: "10kg" }
    ]
  },
  {
    id: "28",
    sellerId: "seller-5",
    name: "Fresh Oysters",
    articleNumber: "60002",
    category: "Seafood",
    price: 2.00,
    priceUnit: "kg", 
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
      { id: "batch-28a", productionDate: addDays(now, -1).toISOString(), expiryDate: addDays(now, 2).toISOString(), availableQuantity: "36kg" }, // Изменено на "kg"
      { id: "batch-28b", productionDate: addDays(now, -2).toISOString(), expiryDate: addDays(now, 1).toISOString(), availableQuantity: "24kg" }, // Изменено на "kg"
      { id: "batch-28c", productionDate: addDays(now, 0).toISOString(), expiryDate: addDays(now, 3).toISOString(), availableQuantity: "48kg" }  // Изменено на "kg"
    ]
  },
  {
    id: "29",
    sellerId: "seller-5",
    name: "Smoked Salmon",
    articleNumber: "60003",
    category: "Seafood",
    price: 82.5,
    priceUnit: "kg",
    region: "Flensburg",
    imageUrls: ["/images/sal.jpg"],
    description: "Locally caught salmon, expertly smoked over alder wood. Rich and savory. (Sold in 200g packs)",
    status: "available",
    visibility: "public",
    createdAt: addDays(now, -10).toISOString(),
    isVegan: false,
    isVegetarian: false,
    harvestOnDemand: false,
    deliveryTimeInDays: 3,
    freshness: "frozen",
    batches: [
      { id: "batch-29a", productionDate: addDays(now, -12).toISOString(), expiryDate: addDays(now, 20).toISOString(), availableQuantity: "2kg" },
      { id: "batch-29b", productionDate: addDays(now, -15).toISOString(), expiryDate: addDays(now, 15).toISOString(), availableQuantity: "1.2kg" },
      { id: "batch-29c", productionDate: addDays(now, -20).toISOString(), expiryDate: addDays(now, 10).toISOString(), availableQuantity: "3kg" }
    ]
  },
  {
    id: "30",
    sellerId: "seller-5",
    name: "Dungeness Crab",
    articleNumber: "60004",
    category: "Seafood",
    price: 28.00,
    priceUnit: "kg",
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
    batches: [
      { id: "batch-30a", productionDate: addDays(now, -7).toISOString(), expiryDate: addDays(now, -5).toISOString(), availableQuantity: "1kg" },
      { id: "batch-30b", productionDate: addDays(now, -6).toISOString(), expiryDate: addDays(now, -4).toISOString(), availableQuantity: "2kg" }
    ]
  },
  {
    id: "31",
    sellerId: "seller-5",
    name: "Canned Albacore Tuna",
    articleNumber: "60005",
    category: "Seafood",
    price: 36.0,
    priceUnit: "kg",
    region: "Flensburg",
    imageUrls: ["/images/tun.jpg"],
    description: "High-quality, line-caught albacore tuna canned in its own juices. (Sold in 150g cans)",
    status: "available",
    visibility: "public",
    createdAt: addDays(now, -40).toISOString(),
    isVegan: false,
    isVegetarian: false,
    harvestOnDemand: false,
    deliveryTimeInDays: 4,
    freshness: "canned",
    batches: [
      { id: "batch-31a", productionDate: addDays(now, -50).toISOString(), expiryDate: addDays(now, 1045).toISOString(), availableQuantity: "3kg" },
      { id: "batch-31b", productionDate: addDays(now, -60).toISOString(), expiryDate: addDays(now, 1035).toISOString(), availableQuantity: "5kg" },
      { id: "batch-31c", productionDate: addDays(now, -70).toISOString(), expiryDate: addDays(now, 1025).toISOString(), availableQuantity: "2kg" }
    ]
  },
];