import { format, parseISO } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { ProductBatch } from "@/types";

interface BatchListMobileProps {
  batches: ProductBatch[];
  productUnit: string;
  onOpenDialog: (batch: ProductBatch) => void;
  noBatchesMessage: string;
}

const BatchListMobile = ({ batches, productUnit, onOpenDialog, noBatchesMessage }: BatchListMobileProps) => {
  if (batches.length === 0) {
    return (
      <div className="text-center py-12 text-sm text-muted-foreground">
        {noBatchesMessage}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {batches.map((batch, index) => (
        <Card key={batch.id}>
          <CardContent className="p-4 space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Batch ID:</span>
              <span className="font-medium">{batch.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Production Date:</span>
              <span className="font-medium">{format(parseISO(batch.productionDate), "PPP")}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Expiry Date:</span>
              <span className="font-medium">{format(parseISO(batch.expiryDate), "PPP")}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Current Quantity:</span>
              <Badge variant="secondary" className="font-medium text-base">
                {parseFloat(batch.availableQuantity) || 0} {productUnit}
              </Badge>
            </div>
            <div className="flex justify-end mt-4">
              <Button size="sm" onClick={() => onOpenDialog(batch)}>Update</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BatchListMobile;