import { useState } from "react";
import { mockProducts } from "@/data/mockData";
import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScanLine, ArrowRight } from "lucide-react";
import BackButton from "@/components/BackButton";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { showError, showSuccess } from "@/utils/toast";

const UpdateQuantity = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts.filter(p => p.sellerId === 'seller-5'));
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [updateMode, setUpdateMode] = useState<'add' | 'replace'>('add');
  const [inputValue, setInputValue] = useState("");
  const [productIdInput, setProductIdInput] = useState("");
  const [showSavedConfirmation, setShowSavedConfirmation] = useState(false);

  const parseQuantity = (quantityStr: string): { value: number, unit: string } => {
    const value = parseFloat(quantityStr) || 0;
    const unit = quantityStr.replace(String(value), '').trim();
    return { value, unit };
  };

  const handleScanProduct = (id: string) => {
    const product = products.find(p => p.id === id);
    if (product) {
      setScannedProduct(product);
      setInputValue("");
      showSuccess(`Product "${product.name}" scanned.`);
    } else {
      setScannedProduct(null);
      showError("Product not found. Please check the ID.");
    }
  };

  const updateProductQuantity = (newQuantity: number) => {
    if (!scannedProduct) return;
    const { unit } = parseQuantity(scannedProduct.availableQuantity);
    const finalQuantity = Math.max(0, newQuantity);
    const updatedProduct = { ...scannedProduct, availableQuantity: `${finalQuantity}${unit}` };
    setProducts(prevProducts =>
      prevProducts.map(p => (p.id === scannedProduct.id ? updatedProduct : p))
    );
    setScannedProduct(updatedProduct);
    setShowSavedConfirmation(true);
    setTimeout(() => setShowSavedConfirmation(false), 1500);
  };

  const handleQuickUpdate = (amount: number) => {
    if (!scannedProduct) return;
    const { value: currentValue } = parseQuantity(scannedProduct.availableQuantity);
    updateProductQuantity(currentValue + amount);
  };

  const handleDirectInput = () => {
    if (!scannedProduct) return;
    const newValue = parseInt(inputValue, 10);
    if (isNaN(newValue)) {
      showError("Please enter a valid number.");
      return;
    }
    if (updateMode === 'replace') {
      updateProductQuantity(newValue);
    } else {
      const { value: currentValue } = parseQuantity(scannedProduct.availableQuantity);
      updateProductQuantity(currentValue + newValue);
    }
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleDirectInput();
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <BackButton />
      <AppBreadcrumb />
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Update Available Quantity</CardTitle>
          <CardDescription>Scan a product's QR code or enter its ID to quickly update stock.</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[450px] flex flex-col justify-center items-center bg-secondary/20 rounded-b-lg p-4 sm:p-6">
          {!scannedProduct ? (
            <div className="w-full space-y-4 text-center">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Enter Product ID (e.g., 1, 4, 10)"
                  value={productIdInput}
                  onChange={(e) => setProductIdInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleScanProduct(productIdInput);
                    }
                  }}
                />
                <Button onClick={() => handleScanProduct(productIdInput)}>
                  <ScanLine className="mr-2 h-4 w-4" />
                  Scan
                </Button>
              </div>
              <p className="text-muted-foreground">
                Use the "Generate QR Codes" tab to print QR codes for your products.
              </p>
            </div>
          ) : (
            <div className="w-full space-y-6">
              <Card className="overflow-hidden border-2 border-primary/20 shadow-md">
                <CardHeader className="bg-secondary/50 p-4 border-b">
                  <h3 className="text-2xl sm:text-3xl font-bold text-foreground">{scannedProduct.name}</h3>
                  <div className="flex items-center gap-2 pt-2">
                    <p className="text-sm text-muted-foreground">Current Quantity:</p>
                    <Badge variant="secondary" className="text-lg font-semibold">{scannedProduct.availableQuantity}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <img
                    src={scannedProduct.imageUrls[0]}
                    alt={scannedProduct.name}
                    className="w-full h-auto aspect-square object-cover rounded-lg border"
                  />
                  <div className="md:col-span-2 space-y-6">
                    <div className="space-y-2">
                      <Label className="text-base font-semibold">Quick Actions</Label>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => handleQuickUpdate(-1)}>-1</Button>
                        <Button variant="outline" onClick={() => handleQuickUpdate(1)}>+1</Button>
                        <Button variant="outline" onClick={() => handleQuickUpdate(5)}>+5</Button>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label htmlFor="direct-input" className="text-base font-semibold">Direct Input</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="direct-input"
                          type="number"
                          placeholder={updateMode === 'add' ? "e.g., 10 to add" : "e.g., 50 to set"}
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyDown={handleKeyDown}
                        />
                        <Button onClick={handleDirectInput}>Update</Button>
                      </div>
                      {showSavedConfirmation && <p className="text-sm font-medium text-primary animate-pulse">Saved!</p>}
                    </div>
                    <div className="flex items-center justify-center space-x-4 rounded-lg border p-3 bg-secondary/30 mt-4">
                      <Label htmlFor="update-mode" className={updateMode === 'add' ? 'font-semibold text-primary' : 'text-muted-foreground'}>Add to Current</Label>
                      <Switch
                        id="update-mode"
                        checked={updateMode === 'replace'}
                        onCheckedChange={(checked) => setUpdateMode(checked ? 'replace' : 'add')}
                      />
                      <Label htmlFor="update-mode" className={updateMode === 'replace' ? 'font-semibold text-primary' : 'text-muted-foreground'}>Replace Value</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="text-center">
                <Button onClick={() => setScannedProduct(null)} size="lg">
                  Scan New Product <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateQuantity;