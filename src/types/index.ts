export interface Review {
  id: string;
  buyerName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  date: string; // ISO date string
  sellerReply?: {
    text: string;
    date: string; // ISO date string
  };
}

export interface Seller {
  id: string;
  name: string;
  region: string;
  logoUrl?: string;
  reviews: Review[];
  totalAds: number;
  totalSold: number;
  profileViews?: number;
  verified: boolean;
  location: {
    lat: number;
    lon: number;
  };
  description?: string; // New field for seller description
}

export interface ProductBatch {
  id: string;
  productionDate: string; // ISO date string
  expiryDate: string; // ISO date string
  availableQuantity: string;
}

export interface Product {
  id:string;
  sellerId: string;
  name: string;
  category: string;
  price: number | "free";
  region: string;
  imageUrls: string[];
  description?: string;
  status: "available" | "sold";
  visibility: "public" | "hidden";
  createdAt: string; // ISO date string
  isVegan: boolean;
  isVegetarian: boolean;
  harvestOnDemand: boolean;
  deliveryTimeInDays: number;
  freshness: "fresh" | "frozen" | "canned";
  batches: ProductBatch[];
}

export interface Order {
  id: string;
  productId: string;
  productName: string;
  productImageUrl: string;
  quantity: string;
  priceAtPurchase: number; // New field for accurate revenue
  clientName: string;
  status: "Pending" | "Ready for Pickup" | "Completed";
  pickupWindowStart: string; // ISO date string
  pickupWindowEnd: string; // ISO date string
}

export type PaymentStatus = "Waiting" | "Paid";

export interface Payment {
  id: string;
  date: string; // ISO date string
  amount: number;
  commission: number;
  netAmount: number;
  status: PaymentStatus;
  expectedDate?: string; // ISO date string, for "Waiting" payments
}

export interface RevenueSummary {
  revenue: number;
  commission: number;
  toBePaid: number;
  paymentStatus: PaymentStatus;
  expectedDate?: string; // ISO date string
}