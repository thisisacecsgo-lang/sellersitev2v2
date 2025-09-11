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
import { DollarSign, Percent, Wallet, CalendarCheck, FileDown } from "lucide-react";
import { mockRevenueSummary, mockPaymentHistory } from "@/data/mockRevenueData";
import { format, parseISO } from "date-fns";
import { showSuccess } from "@/utils/toast";
import { cn } from "@/lib/utils";

const RevenueReport = () => {
  const handleDownloadReceipt = (paymentId: string) => {
    showSuccess(`Downloading receipt for payment ${paymentId}... (demo)`);
    console.log(`Downloading receipt for payment ${paymentId}`);
  };

  const getPaymentStatusBadge = (status: "Waiting" | "Paid") => {
    const baseClasses = "w-14 h-4 text-[0.6rem] flex items-center justify-center px-1 py-0.5"; // Even smaller badge
    switch (status) {
      case "Waiting":
        return <Badge variant="secondary" className={cn("bg-yellow-500 text-white hover:bg-yellow-600", baseClasses)}>Wait</Badge>; // Shortened text
      case "Paid":
        return <Badge className={cn("bg-primary text-primary-foreground hover:bg-primary/90", baseClasses)}>Paid</Badge>;
      default:
        return <Badge className={baseClasses}>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Current Financial Overview</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{mockRevenueSummary.revenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total earnings to date</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{mockRevenueSummary.commission.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Platform fees</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">To Be Paid</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{mockRevenueSummary.toBePaid.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Next payout amount</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Status</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockRevenueSummary.paymentStatus}</div>
            {mockRevenueSummary.expectedDate && (
              <p className="text-xs text-muted-foreground">
                Expected: {format(parseISO(mockRevenueSummary.expectedDate), "PPP")}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mt-8">Payment History</h2>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[70px] text-[0.65rem] p-1">Date</TableHead>
                  <TableHead className="text-[0.65rem] p-1">Amount</TableHead>
                  <TableHead className="text-[0.65rem] p-1">Comm.</TableHead> {/* Shortened "Commission" */}
                  <TableHead className="text-[0.65rem] p-1">Net</TableHead> {/* Shortened "Net Amount" */}
                  <TableHead className="text-[0.65rem] p-1">Status</TableHead>
                  <TableHead className="text-right text-[0.65rem] p-1">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPaymentHistory.length > 0 ? (
                  mockPaymentHistory.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="py-1 px-1 text-[0.65rem]">{format(parseISO(payment.date), "MMM d, yy")}</TableCell> {/* Shorter date format */}
                      <TableCell className="py-1 px-1 text-[0.65rem]">€{payment.amount.toFixed(2)}</TableCell>
                      <TableCell className="py-1 px-1 text-[0.65rem]">€{payment.commission.toFixed(2)}</TableCell>
                      <TableCell className="py-1 px-1 text-[0.65rem]">€{payment.netAmount.toFixed(2)}</TableCell>
                      <TableCell className="py-1 px-1">{getPaymentStatusBadge(payment.status)}</TableCell>
                      <TableCell className="text-right py-1 px-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadReceipt(payment.id)}
                          className="h-6 px-1 text-[0.6rem]" // Even smaller button
                        >
                          <FileDown className="h-3 w-3 mr-0.5" /> {/* Smaller icon, less margin */}
                          Receipt
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-20 text-center text-sm">
                      No payment history found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueReport;