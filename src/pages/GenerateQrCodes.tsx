import React, { useState, useMemo, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { mockProducts } from "@/data/mockData";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import BackButton from "@/components/BackButton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Printer, QrCode as QrCodeIcon } from "lucide-react";
import { showSuccess } from "@/utils/toast";
import { format, parseISO } from "date-fns";

const GenerateQrCodes = () => {
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>(undefined);
  const [selectedBatchId, setSelectedBatchId] = useState<string | undefined>(undefined); // New state for selected batch
  const qrCodeRef = useRef<HTMLDivElement>(null);

  // Filter products to only show those from 'seller-5' for this demo
  const sellerProducts = useMemo(() => {
    return mockProducts.filter(p => p.sellerId === 'seller-5');
  }, []);

  const selectedProduct = useMemo(() => {
    return sellerProducts.find(p => p.id === selectedProductId);
  }, [selectedProductId, sellerProducts]);

  const selectedBatch = useMemo(() => {
    if (selectedProduct && selectedBatchId) {
      return selectedProduct.batches.find(batch => batch.id === selectedBatchId);
    }
    return undefined;
  }, [selectedProduct, selectedBatchId]);

  const handlePrint = () => {
    if (qrCodeRef.current && selectedProduct && selectedBatch) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write('<html><head><title>Print QR Code</title>');
        printWindow.document.write('<style>');
        printWindow.document.write(`
          body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
          .qr-container { text-align: center; padding: 20px; border: 1px solid #ccc; border-radius: 8px; background-color: #fff; }
          h1 { font-size: 24px; margin-bottom: 15px; }
          p { font-size: 16px; margin-bottom: 20px; }
          svg { display: block; margin: 0 auto; }
          @media print {
            body { background-color: #fff; }
            .qr-container { border: none; box-shadow: none; }
          }
        `);
        printWindow.document.write('</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write('<div class="qr-container">');
        printWindow.document.write(`<h1>QR Code for ${selectedProduct.name} - Batch ${selectedBatch.id.split('-').pop()}</h1>`);
        printWindow.document.write(`<p>Product: ${selectedProduct.name}</p>`);
        printWindow.document.write(`<p>Batch Quantity: ${selectedBatch.availableQuantity}</p>`);
        printWindow.document.write(`<p>Production Date: ${format(parseISO(selectedBatch.productionDate), 'PPP')}</p>`);
        printWindow.document.write(`<p>Expiry Date: ${format(parseISO(selectedBatch.expiryDate), 'PPP')}</p>`);
        printWindow.document.write(qrCodeRef.current.innerHTML);
        printWindow.document.write('</div></body></html>');
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
        showSuccess("QR code sent to printer.");
      }
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <BackButton />
      <AppBreadcrumb />
      <h1 className="text-3xl font-bold mb-6">Generate Product QR Codes</h1>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Select Product and Batch</CardTitle>
          <CardDescription>Choose a product and a specific batch to generate its unique QR code for inventory management.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Select 
            onValueChange={(value) => {
              setSelectedProductId(value);
              setSelectedBatchId(undefined); // Reset batch selection when product changes
            }} 
            value={selectedProductId}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              {sellerProducts.length > 0 ? (
                sellerProducts.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-products" disabled>No products available</SelectItem>
              )}
            </SelectContent>
          </Select>

          {selectedProduct && (
            <Select 
              onValueChange={setSelectedBatchId} 
              value={selectedBatchId}
              disabled={!selectedProduct || selectedProduct.batches.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a batch" />
              </SelectTrigger>
              <SelectContent>
                {selectedProduct.batches.length > 0 ? (
                  selectedProduct.batches.map((batch, index) => (
                    <SelectItem key={batch.id} value={batch.id}>
                      Batch #{index + 1} ({batch.availableQuantity}) - Prod: {format(parseISO(batch.productionDate), 'PPP')}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-batches" disabled>No batches available for this product</SelectItem>
                )}
              </SelectContent>
            </Select>
          )}

          {selectedProduct && selectedBatch && (
            <div className="flex flex-col items-center space-y-6 mt-8">
              <div ref={qrCodeRef} className="p-4 border rounded-lg bg-white shadow-md">
                <QRCodeSVG
                  value={`${selectedProduct.id}-${selectedBatch.id}`} {/* QR code value now includes batch ID */}
                  size={256}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="Q"
                  includeMargin={false}
                />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Scan this QR code to quickly update the quantity of "{selectedProduct.name}" (Batch: {selectedBatch.availableQuantity}, Prod: {format(parseISO(selectedBatch.productionDate), 'PPP')}).
              </p>
              <Button onClick={handlePrint} className="w-full max-w-xs">
                <Printer className="mr-2 h-4 w-4" />
                Print QR Code
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GenerateQrCodes;