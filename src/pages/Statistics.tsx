import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import { format, subDays, isWithinInterval, parseISO } from "date-fns";
import { Calendar as CalendarIcon, DollarSign, ShoppingCart, Package, TrendingUp } from "lucide-react";
import { mockOrders } from "@/data/mockOrders";
import { mockProducts } from "@/data/mockData";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import BackButton from "@/components/BackButton";

const COLORS = ["#6B8E23", "#8B5E3C", "#D4E9D2", "#E9D8A6", "#A0522D", "#CD853F"];

const Statistics = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  });

  const {
    summaryStats,
    productPerformance,
    categoryDistribution,
  } = useMemo(() => {
    const filteredOrders = mockOrders.filter(order => {
      const orderDate = parseISO(order.pickupWindowStart);
      return date?.from && date?.to && isWithinInterval(orderDate, { start: date.from, end: date.to });
    });

    const totalRevenue = filteredOrders.reduce((acc, order) => acc + order.priceAtPurchase, 0);
    const totalOrders = filteredOrders.length;
    
    const productPerf = mockProducts.map(product => {
      const ordersForProduct = filteredOrders.filter(o => o.productId === product.id);
      const revenue = ordersForProduct.reduce((acc, o) => acc + o.priceAtPurchase, 0);
      const unitsSold = ordersForProduct.length; // Simplified: assuming 1 unit per order
      return {
        ...product,
        revenue,
        unitsSold,
      };
    }).filter(p => p.unitsSold > 0)
      .sort((a, b) => b.revenue - a.revenue);

    const totalUnitsSold = productPerf.reduce((acc, p) => acc + p.unitsSold, 0);

    const catDist = productPerf.reduce((acc, product) => {
      const category = product.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += product.revenue;
      return acc;
    }, {} as Record<string, number>);

    const categoryData = Object.entries(catDist).map(([name, value]) => ({ name, value }));

    return {
      summaryStats: {
        totalRevenue,
        totalOrders,
        totalUnitsSold,
        avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      },
      productPerformance: productPerf,
      categoryDistribution: categoryData,
    };
  }, [date]);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <BackButton />
      <AppBreadcrumb />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Sales Statistics</h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className="w-full sm:w-[300px] justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{summaryStats.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.totalUnitsSold}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{summaryStats.avgOrderValue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Products by Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productPerformance.slice(0, 10)} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-45} textAnchor="end" height={80} />
                <YAxis tickFormatter={(value) => `€${value}`} />
                <Tooltip formatter={(value: number) => [`€${value.toFixed(2)}`, "Revenue"]} />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={categoryDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `€${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Performance Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Units Sold</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productPerformance.map(product => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-right">€{product.revenue.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{product.unitsSold}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Statistics;