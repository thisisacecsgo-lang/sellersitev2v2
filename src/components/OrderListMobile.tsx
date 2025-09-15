import { Link } from "react-router-dom";
import { format, parseISO, differenceInDays } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Order } from "@/types";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatOrderQuantity } from "@/utils/orderFormatting"; // Import the new utility
import { mockProducts } from "@/data/mockData"; // Import mockProducts to get batch details

interface OrderListMobileProps {
  orders: Order[];
  noOrdersMessage: string;
  onStatusChange: (orderId: string, newStatus: Order['status']) => void;
}

const OrderListMobile = ({ orders, noOrdersMessage, onStatusChange }: OrderListMobileProps) => {
  const getStatusClasses = (status: Order['status']) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500 text-white hover:bg-yellow-600";
      case "Ready for Pickup":
        return "bg-blue-500 text-white hover:bg-blue-600";
      case "Completed":
        return "bg-primary text-primary-foreground hover:bg-primary/90";
      default:
        return "";
    }
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 text-sm text-muted-foreground">
        {noOrdersMessage}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const product = mockProducts.find(p => p.id === order.productId);
        const batch = product?.batches.find(b => b.id === order.batchId);
        const expiryDate = batch ? parseISO(batch.expiryDate) : null;
        const daysLeft = expiryDate ? differenceInDays(expiryDate, new Date()) : null;

        return (
          <Card key={order.id}>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 border bg-muted">
                  <img src={order.productImageUrl} alt={order.productName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <Link to={`/product/${order.productId}`} className="font-semibold text-base hover:text-primary hover:underline">
                    {order.productName}
                  </Link>
                </div>
              </div>
              <div className="space-y-2 text-sm pt-2 border-t mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Quantity:</span>
                  <span className="font-medium">{formatOrderQuantity(order)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Batch ID:</span>
                  <span className="font-medium">{batch?.id || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Prod. Date:</span>
                  <span className="font-medium">{batch ? format(parseISO(batch.productionDate), "MMM d, yy") : 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Exp. Date:</span>
                  {expiryDate ? (
                    <Badge variant={daysLeft !== null && daysLeft < 7 && daysLeft >= 0 ? "destructive" : "secondary"}>
                      {format(expiryDate, "MMM d, yy")} ({daysLeft !== null && daysLeft >= 0 ? `${daysLeft} days` : 'Expired'})
                    </Badge>
                  ) : <span className="font-medium">N/A</span>}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status:</span>
                  <Select value={order.status} onValueChange={(newStatus: Order['status']) => onStatusChange(order.id, newStatus)}>
                    <SelectTrigger className={cn("w-[100px] h-6 text-xs", getStatusClasses(order.status))}>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Ready for Pickup">Ready</SelectItem>
                        <SelectItem value="Completed">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Pickup:</span>
                  <span className="font-medium">{format(parseISO(order.pickupWindowStart), "MMM d, HH:mm")}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default OrderListMobile;