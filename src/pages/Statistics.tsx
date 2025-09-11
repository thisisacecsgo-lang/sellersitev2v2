import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
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
import { format, subDays, isWithinInterval, parseISO, differenceInDays, eachDayOfInterval, isSameDay } from "date-fns";
import { Calendar as CalendarIcon, DollarSign, ShoppingCart, TrendingUp, Users, FileDown, ArrowUp, ArrowDown } from "lucide-react";
import { mockOrders } from "@/data/mockOrders";
import { mockProducts } from "@/data/mockData";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import BackButton from "@/components/BackButton";
import { showSuccess } from "@/utils/toast";
import { Badge } from "@/components/ui/badge";

const COLORS = ["#6B8E23", "#8B5E3C", "#D4E9D2", "#E9D8A6", "#A0522D", "#CD853F"];

const StatCard = ({ title, value, change, icon: Icon, formatValue = (v: number) => v.toString() }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{formatValue(value)}</div>
      {change !== undefined && change !== null && (
        <p className={`text-xs flex items-center ${change >= 0 ? 'text-green-600' : 'text-destructive'}`}>
          {change >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
          {change.toFixed(1)}% from last period
        </p>
      )}
    </CardContent>
  </Card>
);

const Statistics = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  });

  const {
    summaryStats,
    salesOverTime,
    productPerformance,
    categoryDistribution,
  } = useMemo(() => {
    const currentFrom = date?.from || subDays(new Date(), 29);
    const currentTo = date?.to || new Date();
    const duration = differenceInDays(currentTo, currentFrom);
    const prevFrom = subDays(currentFrom, duration + 1);
    const prevTo = subDays(currentFrom, duration);

    const currentOrders = mockOrders.filter(o => isWithinInterval(parseISO(o.pickupWindowStart), { start: currentFrom, end: currentTo }));
    const prevOrders = mockOrders.filter(o => isWithinInterval(parseISO(o.pickupWindowStart), { start: prevFrom, end: prevTo }));

    // Current Period KPIs
    const currentRevenue = currentOrders.reduce((acc, o) => acc + o.priceAtPurchase, 0);
    const currentOrderCount = currentOrders.length;
    const allCustomers = currentOrders.map(o => o.clientName);
    const uniqueCustomers = new Set(allCustomers);
    const returningCustomersCount = allCustomers.length - uniqueCustomers.size;
    const returningCustomerPerc = allCustomers.length > 0 ? (returningCustomersCount / allCustomers.length) * 100 : 0;

    // Previous Period KPIs
    const prevRevenue = prevOrders.reduce((acc, o) => acc + o.priceAtPurchase, 0);
    const prevOrderCount = prevOrders.length;

    // Percentage Changes
    const revenueChange = prevRevenue > 0 ? ((currentRevenue - prevRevenue) / prevRevenue) * 100 : (currentRevenue > 0 ? 100 : 0);
    const orderChange = prevOrderCount > 0 ? ((currentOrderCount - prevOrderCount) / prevOrderCount) * 100 : (currentOrderCount > 0 ? 100 : 0);

    // Sales Over Time Data
    const salesData = eachDayOfInterval({ start: currentFrom, end: currentTo }).map(day => ({
      name: format(day, 'MMM d'),
      revenue: currentOrders
        .filter(o => isSameDay(parseISO(o.pickupWindowStart), day))
        .reduce((sum, o) => sum + o.priceAtPurchase, 0),
    }));

    // Product & Category Performance
    const productPerf = mockProducts.map((product, index) => {
      const ordersForProduct = currentOrders.filter(o => o.productId === product.id);
      const revenue = ordersForProduct.reduce((acc, o) => acc + o.priceAtPurchase, 0);
      const unitsSold = ordersForProduct.length;
      return { ...product, revenue, unitsSold, rank: index + 1 };
    }).filter(p => p.unitsSold > 0).sort((a, b) => b.revenue - a.revenue);

    const catDist = productPerf.reduce((acc, product) => {
      if (!acc[product.category]) acc[product.category] = 0;
      acc[product.category] += product.revenue;
      return acc;
    }, {} as Record<string, number>);
    const categoryData = Object.entries(catDist).map(([name, value]) => ({ name, value }));

    return {
      summaryStats: {
        totalRevenue: { value: currentRevenue, change: revenueChange },
        totalOrders: { value: currentOrderCount, change: orderChange },
        avgOrderValue: { value: currentOrderCount > 0 ? currentRevenue / currentOrderCount : 0 },
        returningCustomers: { value: returningCustomerPerc },
      },
      salesOverTime: salesData,
      productPerformance: productPerf,
      categoryDistribution: categoryData,
    };
  }, [date]);

  const handleExport = (format: 'CSV' | 'PDF') => {
    showSuccess(`Exporting product data as ${format}... (demo)`);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <BackButton />
      <AppBreadcrumb />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Sales Statistics</h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button id="date" variant={"outline"} className="w-full sm:w-[300px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (date.to ? `${format(date.from, "LLL dd, y")} - ${format(date.to, "LLL dd, y")}` : format(date.from, "LLL dd, y")) : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar initialFocus mode="range" defaultMonth={date?.from} selected={date} onSelect={setDate} numberOfMonths={2} />
          </PopoverContent>
        </Popover>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-8 mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Revenue" value={summaryStats.totalRevenue.value} change={summaryStats.totalRevenue.change} icon={DollarSign} formatValue={(v) => `€${v.toFixed(2)}`} />
            <StatCard title="Total Orders" value={summaryStats.totalOrders.value} change={summaryStats.totalOrders.change} icon={ShoppingCart} formatValue={(v) => v.toFixed(0)} />
            <StatCard title="Avg. Order Value" value={summaryStats.avgOrderValue.value} icon={TrendingUp} formatValue={(v) => `€${v.toFixed(2)}`} />
            <StatCard title="Returning Customers" value={summaryStats.returningCustomers.value} icon={Users} formatValue={(v) => `${v.toFixed(1)}%`} />
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2">
              <CardHeader><CardTitle>Sales Over Time</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesOverTime} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(value) => `€${value}`} />
                    <Tooltip formatter={(value: number) => [`€${value.toFixed(2)}`, "Revenue"]} />
                    <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Sales by Category</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={categoryDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                      {categoryDistribution.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `€${value.toFixed(2)}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="products" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>Product Performance</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleExport('CSV')}><FileDown className="mr-2 h-4 w-4" />CSV</Button>
                  <Button variant="outline" size="sm" onClick={() => handleExport('PDF')}><FileDown className="mr-2 h-4 w-4" />PDF</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Units Sold</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productPerformance.map((product, index) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell><Badge variant={product.visibility === 'public' ? 'default' : 'secondary'}>{product.visibility}</Badge></TableCell>
                      <TableCell className="text-right">€{product.revenue.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{product.unitsSold}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Statistics;