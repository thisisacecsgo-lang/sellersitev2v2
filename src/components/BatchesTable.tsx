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
import { format, differenceInDays } from "date-fns";
import type { Product } from "@/types";

interface BatchesTableProps {
  product: Product;
}

const BatchesTable = ({ product }: BatchesTableProps) => {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Available Batches</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Production Date</TableHead>
            <TableHead>Best Before</TableHead>
            <TableHead>Days Left</TableHead>
            <TableHead>Available</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {product.batches.length > 0 ? (
            product.batches.map((batch) => {
              const expiry = new Date(batch.expiryDate);
              const daysLeft = differenceInDays(expiry, new Date());
              return (
                <TableRow key={batch.id}>
                  <TableCell>{format(new Date(batch.productionDate), "PPP")}</TableCell>
                  <TableCell>{format(expiry, "PPP")}</TableCell>
                  <TableCell>
                    <Badge variant={daysLeft < 7 ? "destructive" : "secondary"}>
                      {daysLeft > 0 ? `${daysLeft} days` : "Expired"}
                    </Badge>
                  </TableCell>
                  <TableCell>{batch.availableQuantity}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" disabled>
                      Add to Cart
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center h-24">
                No available batches for this product.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default BatchesTable;