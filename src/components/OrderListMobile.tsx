import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
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

interface OrderListMobileProps {
  orders: Order[];
  noOrdersMessage: string;
  onStatusChange: (orderId: string, newStatus: Order['status']) => void;
}

const OrderListMobile = ({ orders, noOrdersMessage, onStatusChange }: OrderListMobileProps) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12 text-sm text-muted-foreground">
        {noOrdersMessage}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
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
                <span className="font-medium">{order.quantity}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status:</span>
                <Select value={order.status} onValueChange={(newStatus: Order['status']) => onStatusChange(order.id, newStatus)}>
                  <SelectTrigger className="w-[100px] h-6 text-xs">
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
      ))}
    </div>
  );
};

export default OrderListMobile;