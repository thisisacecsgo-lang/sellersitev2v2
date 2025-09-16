import { useState, useMemo, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { mockProducts } from "@/data/mockData";
import type { ProductBatch } from "@/types";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import BackButton from "@/components/BackButton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Printer, QrCode as QrCodeIcon, Hash, Search } from "lucide-react";
import { showSuccess } from "@/utils/toast";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const GenerateQrCodes = () => {
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>(undefined);
  const [selectedBatch, setSelectedBatch] = useState<ProductBatch | null>(null);
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const qrCodeRef = useRef<HTMLDivElement>(null);

  const sellerProducts = useMemo(() => {
    return mockProducts.filter(p => p.sellerId === 'seller-5');
  }, []);

  const selectedProduct = useMemo(() => {
    return sellerProducts.find(p => p.id === selectedProductId);
  }, [selectedProductId, sellerProducts]);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) {
      return sellerProducts;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return sellerProducts.filter(product =>
      product.articleNumber.toLowerCase().includes(lowerCaseSearchTerm) ||
      product.name.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [searchTerm, sellerProducts]);

  const handleGenerateClick = (batch: ProductBatch) => {
    setSelectedBatch(batch);
    setIsQrDialogOpen(true);
  };

  const handlePrint = () => {
    if (qrCodeRef.current && selectedProduct && selectedBatch) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write('<html><head><title>Print Batch QR Code</title>');
        printWindow.document.write('<style>');
        printWindow.document.write(`
          body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
          .qr-container { text-align: center; padding: 20px; border: 1px solid #ccc; border-radius: 8px; background-color: #fff; }
          h1 { font-size: 24px; margin-bottom: 10px; }
          p { font-size: 16px; margin: 5px 0; color: #555; }
          svg { display: block; margin: 20px auto; }
          @media print {
            body { background-color: #fff; }
            .qr-container { border: none; box-shadow: none; }
          }
        `);
        printWindow.document.write('</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write('<div class="qr-container">');
        printWindow.document.write(`<h1>${selectedProduct.name}</h1>`);
        printWindow.document.write(`<p>Production Date: ${format(new Date(selectedBatch.productionDate), "PPP")}</p>`);
        printWindow.document.write(`<p>Expiry Date: ${format(new Date(selectedBatch.expiryDate), "PPP")}</p>`);
        printWindow.document.write(qrCodeRef.current.innerHTML);
        printWindow.document.write('</div></body></html>');
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
        showSuccess("Batch QR code sent to printer.");
      }
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <BackButton />
      <AppBreadcrumb />
      <h1 className="text-3xl font-bold mb-6">Generate Batch QR Codes</h1>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Select a Product</CardTitle>
          <CardDescription>Choose a product to see its batches and generate their unique QR codes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search Input - Moved outside Select */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by article or name..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select onValueChange={setSelectedProductId} value={selectedProductId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{product.name}</span>
                      <Badge variant="secondary" className="font-normal text-xs ml-4">
                        <Hash className="h-3 w-3 mr-1" />
                        {product.articleNumber}
                      </Badge>
                    </div>
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-products" disabled>No products found</SelectItem>
              )}
            </SelectContent>
          </Select>

          {selectedProduct && (
            <div>
              <h3 className="text-lg font-semibold mb-4 mt-6">Available Batches for "{selectedProduct.name}"</h3>
              {selectedProduct.batches.length > 0 ? (
                <div className="space-y-3">
                  {selectedProduct.batches.map((batch) => (
                    <div key={batch.id} className="border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="space-y-1 text-sm">
                        <p><span className="font-semibold">Production:</span> {format(new Date(batch.productionDate), "PPP")}</p>
                        <p><span className="font-semibold">Expiry:</span> {format(new Date(batch.expiryDate), "PPP")}</p>
                        <p><span className="font-semibold">Quantity:</span> {batch.availableQuantity}</p>
                      </div>
                      <Button onClick={() => handleGenerateClick(batch)} className="w-full sm:w-auto">
                        <QrCodeIcon className="mr-2 h-4 w-4" />
                        Generate QR Code
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No batches found for this product.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedProduct && selectedBatch && (
        <Dialog open={isQrDialogOpen} onOpenChange={setIsQrDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedProduct.name}</DialogTitle>
              <DialogDescription>
                QR Code for batch produced on {format(new Date(selectedBatch.productionDate), "PPP")}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center space-y-4 py-4">
              <div ref={qrCodeRef} className="p-4 border rounded-lg bg-white">
                <QRCodeSVG
                  value={`${selectedProduct.articleNumber}:${selectedBatch.id}`}
                  size={220}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="Q"
                  includeMargin={false}
                />
              </div>
              <p className="text-xs text-muted-foreground text-center max-w-xs">
                Scan this to quickly manage this specific batch in the "Update Qty" section.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsQrDialogOpen(false)}>Close</Button>
              <Button onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default GenerateQrCodes;