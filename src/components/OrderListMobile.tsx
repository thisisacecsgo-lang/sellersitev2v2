import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Order } from "@/types";
import { cn } from "@/lib/utils";

interface OrderListMobileProps {
  orders: Order[];
  noOrdersMessage: string;
}

const OrderListMobile = ({ orders, noOrdersMessage }: OrderListMobileProps) => {
  const getStatusBadge = (status: "Pending" | "Ready for Pickup" | "Completed") => {
    const baseClasses = "w-16 h-5 text-xs flex items-center justify-center";
    switch (status) {
      case "Pending":
        return <Badge variant="secondary" className={baseClasses}>Pending</Badge>;
      case "Ready for Pickup":
        return <Badge className={cn("bg-blue-500 text-white hover:bg-blue-600", baseClasses)}>Ready</Badge>;
      case "Completed":
        return <Badge className={cn("bg-primary text-primary-foreground hover:bg-primary/90", baseClasses)}>Done</Badge>;
      default:
        return <Badge className={baseClasses}>{status}</Badge>;
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
                {/* Removed client name for better mobile readability */}
              </div>
            </div>
            <div className="space-y-2 text-sm pt-2 border-t mt-2"> {/* Added border-t and pt-2 for separation */}
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Quantity:</span>
                <span className="font-medium">{order.quantity}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status:</span>
                {getStatusBadge(order.status)}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Pickup:</span> {/* Shortened label */}
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