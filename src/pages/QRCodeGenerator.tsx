import { useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { QRCode } from "qrcode.react"; // Changed from default import to named import
import { mockProducts } from "@/data/mockData";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import BackButton from "@/components/BackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Download, Printer } from "lucide-react";
import { showSuccess } from "@/utils/toast";

const QRCodeGenerator = () => {
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>(undefined);
  const qrCodeRef = useRef<HTMLDivElement>(null);

  // Filter products for the current seller (assuming 'seller-5' for demo)
  const sellerProducts = useMemo(() => {
    return mockProducts.filter(p => p.sellerId === 'seller-5');
  }, []);

  const selectedProduct = useMemo(() => {
    return sellerProducts.find(p => p.id === selectedProductId);
  }, [selectedProductId, sellerProducts]);

  const qrCodeValue = selectedProduct ? `${window.location.origin}/update-quantity?productId=${selectedProduct.id}` : "";

  const handlePrint = () => {
    if (qrCodeRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write('<html><head><title>Print QR Code</title>');
        printWindow.document.write('<style>@media print { body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; } svg { max-width: 90vw; max-height: 90vh; } }</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(qrCodeRef.current.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleDownload = () => {
    if (qrCodeRef.current) {
      const svgElement = qrCodeRef.current.querySelector('svg');
      if (svgElement) {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = svgUrl;
        downloadLink.download = `${selectedProduct?.name.replace(/\s/g, '_') || 'qrcode'}.svg`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(svgUrl);
        showSuccess("QR code downloaded successfully!");
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
          <CardTitle>Select a Product</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="product-select">Choose a product to generate its QR code:</Label>
            <Select onValueChange={setSelectedProductId} value={selectedProductId}>
              <SelectTrigger id="product-select">
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {sellerProducts.map(product => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} ({product.availableQuantity})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedProduct && (
            <div className="space-y-4 text-center">
              <h3 className="text-xl font-semibold">QR Code for {selectedProduct.name}</h3>
              <div className="flex justify-center p-4 bg-white rounded-lg shadow-inner" ref={qrCodeRef}>
                <QRCode value={qrCodeValue} size={256} level="H" renderAs="svg" />
              </div>
              <p className="text-sm text-muted-foreground">
                This QR code links directly to the update quantity page for "{selectedProduct.name}".
              </p>
              <div className="flex justify-center gap-4">
                <Button onClick={handlePrint} variant="outline">
                  <Printer className="mr-2 h-4 w-4" />
                  Print QR Code
                </Button>
                <Button onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download SVG
                </Button>
              </div>
            </div>
          )}

          {!selectedProduct && (
            <div className="text-center text-muted-foreground py-8">
              <p>Please select a product from the dropdown above to generate its QR code.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QRCodeGenerator;