import { useState } from "react";
import { mockProducts } from "@/data/mockData";
import type { Product, ProductBatch } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScanLine, ArrowRight, Hash } from "lucide-react";
import BackButton from "@/components/BackButton";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { showError, showSuccess } from "@/utils/toast";
import { format } from "date-fns";

const UpdateQuantity = () => {
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [lookupInput, setLookupInput] = useState("");
  const [editingBatch, setEditingBatch] = useState<ProductBatch | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updateMode, setUpdateMode] = useState<'add' | 'replace'>('add');
  const [inputValue, setInputValue] = useState("");

  const parseQuantity = (quantityStr: string): { value: number, unit: string } => {
    const value = parseFloat(quantityStr) || 0;
    const unit = quantityStr.replace(String(value), '').trim();
    return { value, unit };
  };

  const handleProductLookup = (input: string) => {
    if (!input.trim()) return;
    // Check if it's a 5-digit article number or a product ID (for QR scan)
    const product = mockProducts.find(p => p.articleNumber === input || p.id === input);
    if (product) {
      setScannedProduct(product);
      showSuccess(`Product "${product.name}" found.`);
    } else {
      setScannedProduct(null);
      showError("Product not found. Please check the number or ID.");
    }
  };

  const handleOpenDialog = (batch: ProductBatch) => {
    setEditingBatch(batch);
    setInputValue("");
    setUpdateMode("add");
    setIsDialogOpen(true);
  };

  const updateBatchQuantity = (batchId: string, newQuantity: number) => {
    if (!scannedProduct) return;

    const targetBatch = scannedProduct.batches.find(b => b.id === batchId);
    if (!targetBatch) return;

    const { unit } = parseQuantity(targetBatch.availableQuantity);
    const finalQuantity = Math.max(0, newQuantity);

    const updatedBatches = scannedProduct.batches.map(b =>
      b.id === batchId ? { ...b, availableQuantity: `${finalQuantity}${unit}` } : b
    );
    const updatedProduct = { ...scannedProduct, batches: updatedBatches };

    setScannedProduct(updatedProduct);
    const updatedEditingBatch = updatedBatches.find(b => b.id === batchId);
    if (updatedEditingBatch) {
      setEditingBatch(updatedEditingBatch);
    }

    const productIndex = mockProducts.findIndex(p => p.id === scannedProduct.id);
    if (productIndex > -1) {
      mockProducts[productIndex] = updatedProduct;
    }
  };

  const handleQuickUpdateInDialog = (amount: number) => {
    if (!editingBatch) return;
    const { value: currentValue } = parseQuantity(editingBatch.availableQuantity);
    updateBatchQuantity(editingBatch.id, currentValue + amount);
  };

  const handleDirectInputInDialog = () => {
    if (!editingBatch) return;
    const newValue = parseInt(inputValue, 10);
    if (isNaN(newValue)) {
      showError("Please enter a valid number.");
      return;
    }

    if (updateMode === 'replace') {
      updateBatchQuantity(editingBatch.id, newValue);
    } else {
      const { value: currentValue } = parseQuantity(editingBatch.availableQuantity);
      updateBatchQuantity(editingBatch.id, currentValue + newValue);
    }
    setInputValue("");
    showSuccess("Batch quantity updated!");
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <BackButton />
      <AppBreadcrumb />
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Update Batch Quantity</CardTitle>
          <CardDescription>Scan a product's QR code or enter its article number to manage stock.</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {!scannedProduct ? (
            <div className="min-h-[200px] flex flex-col justify-center items-center text-center space-y-4">
              <div className="flex items-center gap-2 w-full max-w-sm">
                <div className="relative flex-grow">
                  <ScanLine className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Scan QR or enter Article No."
                    className="pl-10"
                    value={lookupInput}
                    onChange={(e) => setLookupInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleProductLookup(lookupInput); }}
                  />
                </div>
                <Button onClick={() => handleProductLookup(lookupInput)}>
                  Find Product
                </Button>
              </div>
              <p className="text-muted-foreground">
                Use the "Generate QR Codes" tab to print QR codes for your products.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border rounded-lg bg-secondary/30">
                <div className="flex items-center gap-4">
                  <img src={scannedProduct.imageUrls[0]} alt={scannedProduct.name} className="w-20 h-20 object-cover rounded-md border" />
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">{scannedProduct.name}</h3>
                    <p className="text-muted-foreground font-mono flex items-center gap-2"><Hash className="h-4 w-4" />{scannedProduct.articleNumber}</p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => { setScannedProduct(null); setLookupInput(""); }}>
                  Find New Product <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Available Batches</CardTitle>
                  <CardDescription>Select a batch to update its quantity.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Production Date</TableHead>
                        <TableHead>Expiry Date</TableHead>
                        <TableHead>Current Quantity</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scannedProduct.batches.map((batch) => (
                        <TableRow key={batch.id}>
                          <TableCell>{format(new Date(batch.productionDate), "PPP")}</TableCell>
                          <TableCell>{format(new Date(batch.expiryDate), "PPP")}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{batch.availableQuantity}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" onClick={() => handleOpenDialog(batch)}>Update</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {editingBatch && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Quantity for Batch</DialogTitle>
              <DialogDescription>
                Production Date: {format(new Date(editingBatch.productionDate), "PPP")}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Current Quantity</p>
                <p className="text-4xl font-bold">{editingBatch.availableQuantity}</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label className="font-semibold">Quick Actions</Label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => handleQuickUpdateInDialog(-5)}>-5</Button>
                  <Button variant="outline" onClick={() => handleQuickUpdateInDialog(-1)}>-1</Button>
                  <Button variant="outline" onClick={() => handleQuickUpdateInDialog(1)}>+1</Button>
                  <Button variant="outline" onClick={() => handleQuickUpdateInDialog(5)}>+5</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="direct-input" className="font-semibold">Direct Input</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="direct-input"
                    type="number"
                    placeholder={updateMode === 'add' ? "e.g., 10 to add" : "e.g., 50 to set"}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleDirectInputInDialog(); }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-center space-x-4 rounded-lg border p-3 bg-secondary/30">
                <Label htmlFor="update-mode" className={updateMode === 'add' ? 'font-semibold text-primary' : 'text-muted-foreground'}>Add to Current</Label>
                <Switch
                  id="update-mode"
                  checked={updateMode === 'replace'}
                  onCheckedChange={(checked) => setUpdateMode(checked ? 'replace' : 'add')}
                />
                <Label htmlFor="update-mode" className={updateMode === 'replace' ? 'font-semibold text-primary' : 'text-muted-foreground'}>Replace Value</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleDirectInputInDialog}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UpdateQuantity;