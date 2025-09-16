import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { mockProducts } from "@/data/mockData";
import type { Product, ProductBatch } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import BackButton from "@/components/BackButton";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { showSuccess, showError } from "@/utils/toast";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle, Trash2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const productSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  category: z.string().min(1, { message: "Please select a category." }),
  price: z.coerce.number().min(0, { message: "Price must be a positive number." }),
  priceUnit: z.string().min(1, { message: "Price unit is required." }),
  description: z.string().optional(),
  imageUrls: z.string().optional(),
  isVegan: z.boolean(),
  isVegetarian: z.boolean(),
  harvestOnDemand: z.boolean(),
  deliveryTimeInDays: z.coerce.number().int().min(0, { message: "Must be a positive number." }),
  certification: z.enum(["Bio", "eco-friendly", "preserved produce", "None"]).optional(),
});

const batchSchema = z.object({
  availableQuantity: z.string().min(1, { message: "Quantity is required." }),
  productionDate: z.string().min(1, { message: "Production date is required." }),
  expiryDate: z.string().min(1, { message: "Expiry date is required." }),
});

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState<Product | undefined>(() =>
    mockProducts.find((p) => p.id === id)
  );
  const [isBatchDialogOpen, setIsBatchDialogOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<ProductBatch | null>(null);
  const [currentBatchUnit, setCurrentBatchUnit] = useState<string>("");

  const productForm = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      category: product?.category || "",
      price: typeof product?.price === 'number' ? product.price : 0,
      priceUnit: product?.priceUnit || "",
      description: product?.description || "",
      imageUrls: product?.imageUrls ? product.imageUrls.join('\n') : "",
      isVegan: product?.isVegan || false,
      isVegetarian: product?.isVegetarian || false,
      harvestOnDemand: product?.harvestOnDemand || false,
      deliveryTimeInDays: product?.deliveryTimeInDays || 0,
      certification: product?.certification || "None",
    },
  });

  const batchForm = useForm<z.infer<typeof batchSchema>>({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      availableQuantity: "",
      productionDate: "",
      expiryDate: "",
    },
  });

  useEffect(() => {
    const isNewProduct = new URLSearchParams(location.search).get('new') === 'true';
    if (isNewProduct) {
      showSuccess("Product created! Now, please add your first batch.");
      handleOpenBatchDialog(null);
      navigate(`/product/${id}/edit`, { replace: true });
    }
  }, [id, location.search, navigate]);

  if (!product) {
    return (
      <div className="container mx-auto p-4 md:p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Button onClick={() => navigate("/")}>Go to Homepage</Button>
      </div>
    );
  }

  const onProductSubmit = (values: z.infer<typeof productSchema>) => {
    const parsedImageUrls = values.imageUrls
      ? values.imageUrls.split('\n').map(url => url.trim()).filter(url => url !== '')
      : [];

    const updatedProductData = { 
      ...values,
      imageUrls: parsedImageUrls.length > 0 ? parsedImageUrls : ["/placeholder.svg"],
      certification: values.certification === "None" ? undefined : values.certification,
    };
    // @ts-ignore
    delete updatedProductData.certification;

    const updatedProduct = {
      ...product,
      ...updatedProductData,
      certification: values.certification === "None" ? undefined : values.certification,
    };

    setProduct(updatedProduct);
    const productIndex = mockProducts.findIndex(p => p.id === product.id);
    if (productIndex > -1) {
      mockProducts[productIndex] = updatedProduct;
    }
    showSuccess("Product details saved successfully!");
  };

  const handleOpenBatchDialog = (batch: ProductBatch | null) => {
    setEditingBatch(batch);
    const unit = product?.priceUnit || "";
    setCurrentBatchUnit(unit);

    if (batch) {
      const numericQuantity = parseFloat(batch.availableQuantity) || 0;
      batchForm.reset({
        availableQuantity: String(numericQuantity),
        productionDate: batch.productionDate,
        expiryDate: batch.expiryDate,
      });
    } else {
      batchForm.reset({
        availableQuantity: "",
        productionDate: "",
        expiryDate: "",
      });
    }
    setIsBatchDialogOpen(true);
  };

  const onBatchSubmit = (values: z.infer<typeof batchSchema>) => {
    const unit = product?.priceUnit || "";
    const numericQuantity = parseFloat(values.availableQuantity);
    const finalAvailableQuantity = isNaN(numericQuantity) || numericQuantity === 0 ? "" : `${numericQuantity}${unit}`;

    if (editingBatch) {
      const updatedBatches = product.batches.map(b =>
        b.id === editingBatch.id ? { ...b, ...values, availableQuantity: finalAvailableQuantity } : b
      );
      setProduct({ ...product, batches: updatedBatches });
    } else {
      const newBatch = { id: `batch-${Date.now()}`, ...values, availableQuantity: finalAvailableQuantity };
      const updatedBatches = [...product.batches, newBatch];
      setProduct({ ...product, batches: updatedBatches });
    }
    setIsBatchDialogOpen(false);
    showSuccess(`Batch ${editingBatch ? 'updated' : 'added'} successfully!`);
  };

  const handleDeleteBatch = (batchId: string) => {
    const updatedBatches = product.batches.filter(b => b.id !== batchId);
    setProduct({ ...product, batches: updatedBatches });
    showError("Batch deleted.");
  };

  const handleToggleVisibility = () => {
    const newVisibility = product.visibility === "public" ? "hidden" : "public";
    setProduct({ ...product, visibility: newVisibility });
    showSuccess(`Product is now ${newVisibility}.`);
  };

  const handleDeleteProduct = () => {
    const updatedMockProducts = mockProducts.filter(p => p.id !== product.id);
    mockProducts.splice(0, mockProducts.length, ...updatedMockProducts);
    showError("Product has been deleted.");
    navigate("/");
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <BackButton />
      <AppBreadcrumb />
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
      <Form {...productForm}>
        <form onSubmit={productForm.handleSubmit(onProductSubmit)} className="space-y-8">
          <Card>
            <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FormField control={productForm.control} name="name" render={({ field }) => (<FormItem><FormLabel>Product Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={productForm.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={productForm.control} name="imageUrls" render={({ field }) => (<FormItem><FormLabel>Image URLs</FormLabel><FormControl><Textarea placeholder="Enter image URLs, one per line" className="resize-none min-h-[100px]" {...field} /></FormControl><FormDescription>Provide direct links to product images. Enter one URL per line.</FormDescription><FormMessage /></FormItem>)} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Details & Pricing</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormItem><FormLabel>Article Number</FormLabel><Input value={product.articleNumber} disabled className="font-mono" /><FormDescription>Article number is automatically generated.</FormDescription></FormItem>
              <FormField control={productForm.control} name="category" render={({ field }) => (<FormItem><FormLabel>Category</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Fruits and berries">Fruits and berries</SelectItem><SelectItem value="Vegetables">Vegetables</SelectItem><SelectItem value="Bakery">Bakery</SelectItem><SelectItem value="Dairy products">Dairy products</SelectItem><SelectItem value="Meat and poultry">Meat and poultry</SelectItem><SelectItem value="Seafood">Seafood</SelectItem><SelectItem value="Animal products">Animal products</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
              <FormField control={productForm.control} name="price" render={({ field }) => (<FormItem><FormLabel>Price (€)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={productForm.control} name="priceUnit" render={({ field }) => (<FormItem><FormLabel>Price Unit</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a unit" /></SelectTrigger></FormControl><SelectContent><SelectItem value="kg">kg</SelectItem><SelectItem value="liter">liter</SelectItem><SelectItem value="piece">piece</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
              <FormField control={productForm.control} name="deliveryTimeInDays" render={({ field }) => (<FormItem><FormLabel>Ready to ship in (days)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
          </Card>

          <Card id="batches">
            <CardHeader><div className="flex justify-between items-center"><div><CardTitle>Manage Batches</CardTitle><CardDescription>Add, edit, or remove batches for this product.</CardDescription></div><Button type="button" onClick={() => handleOpenBatchDialog(null)}><PlusCircle className="mr-2 h-4 w-4" /> Add Batch</Button></div></CardHeader>
            <CardContent className="p-0 md:p-6">
              <div className="hidden md:block">
                <Table><TableHeader><TableRow><TableHead>Production Date</TableHead><TableHead>Expiry Date</TableHead><TableHead>Quantity</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>{product.batches.map((batch) => (<TableRow key={batch.id}><TableCell>{format(new Date(batch.productionDate), "PPP")}</TableCell><TableCell>{format(new Date(batch.expiryDate), "PPP")}</TableCell><TableCell>{batch.availableQuantity}</TableCell><TableCell className="text-right"><Button type="button" variant="ghost" size="sm" onClick={() => handleOpenBatchDialog(batch)}>Edit</Button><AlertDialog><AlertDialogTrigger asChild><Button type="button" variant="ghost" size="sm" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Batch?</AlertDialogTitle><AlertDialogDescription>This will permanently delete this batch. This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteBatch(batch.id)}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></TableCell></TableRow>))}</TableBody></Table>
              </div>
              <div className="md:hidden space-y-4 p-4">
                {product.batches.map((batch) => (<div key={batch.id} className="border rounded-lg p-4 space-y-3 text-sm"><div className="flex justify-between items-center"><span className="text-muted-foreground">Production Date</span><span className="font-medium">{format(new Date(batch.productionDate), "PPP")}</span></div><div className="flex justify-between items-center"><span className="text-muted-foreground">Expiry Date</span><span className="font-medium">{format(new Date(batch.expiryDate), "PPP")}</span></div><div className="flex justify-between items-center"><span className="text-muted-foreground">Quantity</span><span className="font-medium">{batch.availableQuantity}</span></div><Separator /><div className="flex justify-end gap-2"><Button type="button" variant="ghost" size="sm" onClick={() => handleOpenBatchDialog(batch)}>Edit</Button><AlertDialog><AlertDialogTrigger asChild><Button type="button" variant="ghost" size="sm" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Batch?</AlertDialogTitle><AlertDialogDescription>This will permanently delete this batch. This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteBatch(batch.id)}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></div></div>))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Certification</CardTitle></CardHeader>
            <CardContent>
              <FormField control={productForm.control} name="certification" render={({ field }) => (<FormItem className="space-y-3"><FormLabel>Select a certification type (optional)</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1"><FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="None" /></FormControl><FormLabel className="font-normal">None</FormLabel></FormItem><FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="Bio" /></FormControl><FormLabel className="font-normal">Bio</FormLabel></FormItem><FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="eco-friendly" /></FormControl><FormLabel className="font-normal">eco-friendly</FormLabel></FormItem><FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="preserved produce" /></FormControl><FormLabel className="font-normal">preserved produce</FormLabel></FormItem></RadioGroup></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Additional Options</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FormField control={productForm.control} name="isVegan" render={({ field }) => (<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>Vegan</FormLabel><FormDescription>This product contains no animal products.</FormDescription></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
              <FormField control={productForm.control} name="isVegetarian" render={({ field }) => (<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>Vegetarian</FormLabel><FormDescription>This product is suitable for vegetarians.</FormDescription></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
              <FormField control={productForm.control} name="harvestOnDemand" render={({ field }) => (<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>Harvest on Demand</FormLabel><FormDescription>This product is harvested only after an order is placed.</FormDescription></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
            </CardContent>
          </Card>

          <Separator />

          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            <div className="flex gap-4"><Button type="submit">Save Product Details</Button><Button type="button" variant="secondary" onClick={handleToggleVisibility}>{product.visibility === "public" ? "Hide" : "Show"}</Button></div>
            <AlertDialog><AlertDialogTrigger asChild><Button type="button" variant="destructive">Delete Product</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete your product listing and all its batches.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDeleteProduct}>Continue</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
          </div>
        </form>
      </Form>

      <Dialog open={isBatchDialogOpen} onOpenChange={setIsBatchDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingBatch ? 'Edit Batch' : 'Add New Batch'}</DialogTitle><DialogDescription>Fill in the details for this batch.</DialogDescription></DialogHeader>
          <Form {...batchForm}>
            <form onSubmit={batchForm.handleSubmit(onBatchSubmit)} className="space-y-4 py-4">
              <FormField control={batchForm.control} name="availableQuantity" render={({ field }) => (<FormItem><FormLabel>Available Quantity</FormLabel><FormControl><div className="flex items-center gap-2"><Input type="number" placeholder="e.g., 10" {...field} value={field.value === "" ? "" : Number(field.value)} />{currentBatchUnit && <span className="text-muted-foreground">{currentBatchUnit}</span>}</div></FormControl><FormMessage /></FormItem>)} />
              <FormField control={batchForm.control} name="productionDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Production Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value ? new Date(field.value) : undefined} onSelect={(date) => field.onChange(date?.toISOString())} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
              <FormField control={batchForm.control} name="expiryDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Expiry Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value ? new Date(field.value) : undefined} onSelect={(date) => field.onChange(date?.toISOString())} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
              <DialogFooter><Button type="button" variant="outline" onClick={() => setIsBatchDialogOpen(false)}>Cancel</Button><Button type="submit">Save Batch</Button></DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditProduct;