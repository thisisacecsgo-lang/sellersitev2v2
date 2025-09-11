import { RevenueSummary, Payment } from "@/types";
import { addDays, subDays } from "date-fns";

const today = new Date();

export const mockRevenueSummary: RevenueSummary = {
  revenue: 1250.75,
  commission: 125.08,
  toBePaid: 350.50,
  paymentStatus: "Waiting",
  expectedDate: addDays(today, 7).toISOString(),
};

export const mockPaymentHistory: Payment[] = [
  {
    id: "pay-1",
    date: subDays(today, 30).toISOString(),
    amount: 250.00,
    commission: 25.00,
    netAmount: 225.00,
    status: "Paid",
  },
  {
    id: "pay-2",
    date: subDays(today, 60).toISOString(),
    amount: 300.50,
    commission: 30.05,
    netAmount: 270.45,
    status: "Paid",
  },
  {
    id: "pay-3",
    date: subDays(today, 90).toISOString(),
    amount: 180.25,
    commission: 18.03,
    netAmount: 162.22,
    status: "Paid",
  },
  {
    id: "pay-4",
    date: subDays(today, 120).toISOString(),
    amount: 400.00,
    commission: 40.00,
    netAmount: 360.00,
    status: "Paid",
  },
  {
    id: "pay-5",
    date: subDays(today, 150).toISOString(),
    amount: 120.00,
    commission: 12.00,
    netAmount: 108.00,
    status: "Paid",
  },
];