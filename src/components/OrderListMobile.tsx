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
    <div className="space-y-3"> {/* Reduced space-y */}
      {orders.map((order) => (
        <Card key={order.id}>
          <CardContent className="p-3 space-y-2"> {/* Reduced padding and space-y */}
            <div className="flex items-center gap-2"> {/* Reduced gap */}
              <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 border bg-muted"> {/* Smaller image */}
                <img src={order.productImageUrl} alt={order.productName} className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow">
                <Link to={`/product/${order.productId}`} className="font-semibold text-sm hover:text-primary hover:underline"> {/* Smaller font */}
                  {order.productName}
                </Link>
                <p className="text-xs text-muted-foreground">{order.clientName} - {order.quantity}</p> {/* Combined client and quantity */}
              </div>
              {getStatusBadge(order.status)} {/* Status badge moved here for better alignment */}
            </div>
            <div className="flex justify-between items-center text-xs text-muted-foreground"> {/* New line for pickup time */}
              <span>Pickup Ready From:</span>{" "}
              <span className="font-medium text-foreground">{format(parseISO(order.pickupWindowStart), "PPP HH:mm")}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OrderListMobile;