import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Wallet, FileDown, Percent, TrendingUp } from "lucide-react";
import { mockRevenueSummary, mockPaymentHistory } from "@/data/mockRevenueData";
import { mockOrders } from "@/data/mockOrders";
import { format, parseISO } from "date-fns";
import { showSuccess } from "@/utils/toast";
import { cn } from "@/lib/utils";
import BackButton from "@/components/BackButton";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";

const COMMISSION_RATE = 0.15; // 15% commission

const Revenue = () => {
  const completedOrders = useMemo(() => mockOrders.filter(o => o.status === 'Completed'), []);

  const summary = useMemo(() => {
    const totalRevenue = completedOrders.reduce((acc, order) => acc + order.priceAtPurchase, 0);
    const totalCommission = totalRevenue * COMMISSION_RATE;
    const netEarnings = totalRevenue - totalCommission;
    return { totalRevenue, totalCommission, netEarnings };
  }, [completedOrders]);

  const handleDownloadReceipt = (paymentId: string) => {
    showSuccess(`Downloading receipt for payment ${paymentId}... (demo)`);
  };

  const getPaymentStatusBadge = (status: "Waiting" | "Paid") => {
    const baseClasses = "w-20 h-6 flex items-center justify-center";
    switch (status) {
      case "Waiting":
        return <Badge variant="secondary" className={cn("bg-yellow-500 text-white hover:bg-yellow-600", baseClasses)}>Waiting</Badge>;
      case "Paid":
        return <Badge className={cn("bg-primary text-primary-foreground hover:bg-primary/90", baseClasses)}>Paid</Badge>;
      default:
        return <Badge className={baseClasses}>{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <BackButton />
      <AppBreadcrumb />
      <h1 className="text-3xl font-bold mb-6">Financials</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gross Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{summary.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total from all completed sales.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Commission</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{summary.totalCommission.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total fees paid ({COMMISSION_RATE * 100}% rate).</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{summary.netEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Your total take-home earnings.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Payout</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{mockRevenueSummary.toBePaid.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Amount to be paid out next cycle.</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transactions">Sales Transactions</TabsTrigger>
          <TabsTrigger value="payouts">Payout History</TabsTrigger>
        </TabsList>
        <TabsContent value="transactions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Log</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Gross Sale</TableHead>
                    <TableHead className="text-right">Commission</TableHead>
                    <TableHead className="text-right">Net Earning</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedOrders.length > 0 ? (
                    completedOrders.map((order) => {
                      const commission = order.priceAtPurchase * COMMISSION_RATE;
                      const netEarning = order.priceAtPurchase - commission;
                      return (
                        <TableRow key={order.id}>
                          <TableCell>{format(parseISO(order.pickupWindowStart), "PPP")}</TableCell>
                          <TableCell className="font-medium">{order.productName}</TableCell>
                          <TableCell>{order.clientName}</TableCell>
                          <TableCell className="text-right">€{order.priceAtPurchase.toFixed(2)}</TableCell>
                          <TableCell className="text-right text-destructive">-€{commission.toFixed(2)}</TableCell>
                          <TableCell className="text-right font-semibold text-primary">€{netEarning.toFixed(2)}</TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">No completed sales found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payouts" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Payout History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPaymentHistory.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{format(parseISO(payment.date), "PPP")}</TableCell>
                      <TableCell>€{payment.netAmount.toFixed(2)}</TableCell>
                      <TableCell>{getPaymentStatusBadge(payment.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleDownloadReceipt(payment.id)}>
                          <FileDown className="h-4 w-4 mr-2" />
                          Receipt
                        </Button>
                      </TableCell>
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

export default Revenue;