import { useState, useEffect } from "react";
import { mockProducts } from "@/data/mockData";
import type { Product, ProductBatch } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { ScanLine, ArrowRight, Hash, Minus, Plus } from "lucide-react";
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
  const [newQuantityInput, setNewQuantityInput] = useState("");

  const parseQuantity = (quantityStr: string): { value: number, unit: string } => {
    const value = parseFloat(quantityStr) || 0;
    const unit = quantityStr.replace(String(value), '').trim();
    return { value, unit };
  };

  useEffect(() => {
    if (editingBatch) {
      const { value } = parseQuantity(editingBatch.availableQuantity);
      setNewQuantityInput(String(value));
    }
  }, [editingBatch]);

  const handleArticleLookup = (articleNumber: string) => {
    if (!articleNumber.trim()) return;
    const product = mockProducts.find(p => p.articleNumber === articleNumber);
    if (product) {
      setScannedProduct(product);
      showSuccess(`Product "${product.name}" found.`);
    } else {
      setScannedProduct(null);
      showError("Product not found for this article number.");
    }
  };

  const handleQrScan = () => {
    const sellerProducts = mockProducts.filter(p => p.sellerId === 'seller-5');
    if (sellerProducts.length === 0) {
      showError("No products available to scan.");
      return;
    }
    const randomProduct = sellerProducts[Math.floor(Math.random() * sellerProducts.length)];
    setScannedProduct(randomProduct);
    showSuccess(`Simulated scan: Found "${randomProduct.name}".`);
  };

  const handleOpenDialog = (batch: ProductBatch) => {
    setEditingBatch(batch);
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

  const handleQuickUpdate = (amount: number) => {
    if (!editingBatch) return;
    const { value: currentValue } = parseQuantity(editingBatch.availableQuantity);
    const newValue = currentValue + amount;
    updateBatchQuantity(editingBatch.id, newValue);
    showSuccess(`Quantity updated to ${newValue}.`);
  };

  const handleSetQuantity = () => {
    if (!editingBatch) return;
    const newValue = parseInt(newQuantityInput, 10);
    if (isNaN(newValue)) {
      showError("Please enter a valid number.");
      return;
    }
    updateBatchQuantity(editingBatch.id, newValue);
    showSuccess("Batch quantity has been set.");
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
            <div className="min-h-[300px] flex flex-col justify-center items-center text-center space-y-8">
              <div className="w-full max-w-sm">
                <Button size="lg" className="w-full py-8 text-lg" onClick={handleQrScan}>
                  <ScanLine className="mr-4 h-8 w-8" />
                  Scan Product QR Code
                </Button>
                <p className="text-xs text-muted-foreground mt-2">Click to simulate scanning a random product.</p>
              </div>
              <div className="flex items-center w-full max-w-sm">
                <div className="flex-grow border-t"></div>
                <span className="flex-shrink mx-4 text-muted-foreground">OR</span>
                <div className="flex-grow border-t"></div>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <Label htmlFor="article-input" className="text-md">Enter Article Number</Label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-grow">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="article-input"
                      placeholder="e.g., 10001"
                      className="pl-10"
                      value={lookupInput}
                      onChange={(e) => setLookupInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleArticleLookup(lookupInput); }}
                    />
                  </div>
                  <Button onClick={() => handleArticleLookup(lookupInput)}>
                    Find
                  </Button>
                </div>
              </div>
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
                  <div className="overflow-x-auto"> {/* Added overflow-x-auto here */}
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
                  </div>
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
              <div className="text-center p-4 rounded-lg bg-secondary/30 border">
                <p className="text-sm text-muted-foreground">Current Quantity</p>
                <p className="text-4xl font-bold blitz-effect" key={editingBatch.availableQuantity}>{editingBatch.availableQuantity}</p>
              </div>
              
              <div className="space-y-2">
                <Label className="font-semibold">Quick Adjustments</Label>
                <div className="grid grid-cols-4 gap-2">
                  <Button variant="outline" onClick={() => handleQuickUpdate(-5)}>-5</Button>
                  <Button variant="outline" onClick={() => handleQuickUpdate(-1)}>-1</Button>
                  <Button variant="outline" onClick={() => handleQuickUpdate(1)}>+1</Button>
                  <Button variant="outline" onClick={() => handleQuickUpdate(5)}>+5</Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="set-quantity-input" className="font-semibold">Set New Total Quantity</Label>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => setNewQuantityInput(String(Math.max(0, parseInt(newQuantityInput, 10) - 1) || 0))}><Minus className="h-4 w-4" /></Button>
                  <Input
                    id="set-quantity-input"
                    type="number"
                    className="text-center text-lg font-bold"
                    placeholder="e.g., 50"
                    value={newQuantityInput}
                    onChange={(e) => setNewQuantityInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSetQuantity(); }}
                  />
                  <Button variant="ghost" size="icon" onClick={() => setNewQuantityInput(String(parseInt(newQuantityInput, 10) + 1 || 1))}><Plus className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Close</Button>
              <Button onClick={handleSetQuantity}>Set Quantity</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UpdateQuantity;