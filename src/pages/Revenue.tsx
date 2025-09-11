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
import BackButton from "@/components/BackButton";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";

const Revenue = () => {
  const handleDownloadReceipt = (paymentId: string) => {
    showSuccess(`Downloading receipt for payment ${paymentId}... (demo)`);
    console.log(`Downloading receipt for payment ${paymentId}`);
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
      <h1 className="text-3xl font-bold mb-6">Revenue Report</h1>
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
          {/* Removed Commission Card */}
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
                    <TableHead className="min-w-[100px]">Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Net Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPaymentHistory.length > 0 ? (
                    mockPaymentHistory.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{format(parseISO(payment.date), "PPP")}</TableCell>
                        <TableCell>€{payment.amount.toFixed(2)}</TableCell>
                        <TableCell>€{payment.commission.toFixed(2)}</TableCell>
                        <TableCell>€{payment.netAmount.toFixed(2)}</TableCell>
                        <TableCell>{getPaymentStatusBadge(payment.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadReceipt(payment.id)}
                          >
                            <FileDown className="h-4 w-4 mr-2" />
                            Receipt
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
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
    </div>
  );
};

export default Revenue;