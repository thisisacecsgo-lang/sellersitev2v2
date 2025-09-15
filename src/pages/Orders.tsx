import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { mockOrders } from "@/data/mockOrders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, isSameDay, parseISO, isAfter, addDays } from "date-fns";
import { Calendar as CalendarIcon, Clock, ClipboardList, FileDown } from "lucide-react";
import { showSuccess } from "@/utils/toast";

const Orders = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const filteredOrders = useMemo(() => {
    if (!date) return [];
    return mockOrders.filter((order) =>
      isSameDay(parseISO(order.pickupWindowStart), date)
    ).sort((a, b) => parseISO(a.pickupWindowStart).getTime() - parseISO(b.pickupWindowStart).getTime());
  }, [date]);

  const tomorrowsOrders = useMemo(() => {
    const tomorrow = addDays(new Date(), 1);
    return mockOrders.filter((order) =>
      isSameDay(parseISO(order.pickupWindowStart), tomorrow)
    ).sort((a, b) => parseISO(a.pickupWindowStart).getTime() - parseISO(b.pickupWindowStart).getTime());
  }, []);

  const { totalOrders, nextPickup } = useMemo(() => {
    const now = new Date();
    const upcomingPickups = filteredOrders
      .filter(o => isAfter(parseISO(o.pickupWindowStart), now) && o.status !== 'Completed')
      .map(o => format(parseISO(o.pickupWindowStart), "MMM d, HH:mm"));
    
    return {
      totalOrders: filteredOrders.length,
      nextPickup: upcomingPickups.length > 0 ? upcomingPickups[0] : "None",
    };
  }, [filteredOrders]);

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

  const handleExport = (format: 'CSV' | 'PDF') => {
    showSuccess(`Exporting orders as ${format}... (demo)`);
    console.log(`Exporting ${filteredOrders.length} orders as ${format}`);
  };

  const OrderTable = ({ orders, noOrdersMessage }: { orders: typeof mockOrders, noOrdersMessage: string }) => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[90px] text-xs p-2">Product</TableHead>
            <TableHead className="text-xs p-2">Qty</TableHead>
            <TableHead className="text-xs p-2">Status</TableHead>
            <TableHead className="text-right text-xs p-2">pick-up ready from</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="py-2 px-2">
                  <Link to={`/product/${order.productId}`} className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-md overflow-hidden flex-shrink-0 border bg-muted">
                      <img src={order.productImageUrl} alt={order.productName} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-medium text-xs group-hover:text-primary group-hover:underline">{order.productName}</span>
                  </Link>
                </TableCell>
                <TableCell className="py-2 px-2 text-xs">{order.quantity}</TableCell>
                <TableCell className="py-2 px-2">{getStatusBadge(order.status)}</TableCell>
                <TableCell className="text-right py-2 px-2 text-xs">
                  {format(parseISO(order.pickupWindowStart), "HH:mm")}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-sm">
                {noOrdersMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Orders & Reports</h1>
      
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders Today</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Pickup</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nextPickup}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4"> {/* Changed to flex-col for stacking */}
            <CardTitle>Orders for {date ? format(date, "PPP") : "..."}</CardTitle>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2"> {/* Adjusted for responsiveness */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full sm:w-[240px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <div className="flex gap-2 w-full sm:w-auto"> {/* Group export buttons */}
                <Button variant="outline" size="sm" onClick={() => handleExport('CSV')} className="flex-1 sm:flex-none">
                  <FileDown className="mr-2 h-4 w-4" />
                  CSV
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExport('PDF')} className="flex-1 sm:flex-none">
                  <FileDown className="mr-2 h-4 w-4" />
                  PDF
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <OrderTable orders={filteredOrders} noOrdersMessage="No orders for this date." />
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Orders for Tomorrow ({format(addDays(new Date(), 1), "PPP")})</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderTable orders={tomorrowsOrders} noOrdersMessage="No orders for tomorrow." />
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;