import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  DialogTrigger,
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

// Schema for the main product details
const productSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  articleNumber: z.string().length(5, { message: "Must be a 5-digit number." }).regex(/^\d+$/, { message: "Must contain only digits." }),
  category: z.string().min(1, { message: "Please select a category." }),
  price: z.coerce.number().min(0, { message: "Price must be a positive number." }),
  priceUnit: z.string().min(1, { message: "Price unit is required." }),
  description: z.string().optional(),
  isVegan: z.boolean(),
  isVegetarian: z.boolean(),
  harvestOnDemand: z.boolean(),
  deliveryTimeInDays: z.coerce.number().int().min(0, { message: "Must be a positive number." }),
});

// Schema for an individual batch
const batchSchema = z.object({
  availableQuantity: z.string().min(1, { message: "Quantity is required." }),
  productionDate: z.string().min(1, { message: "Production date is required." }),
  expiryDate: z.string().min(1, { message: "Expiry date is required." }),
});

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | undefined>(() =>
    mockProducts.find((p) => p.id === id)
  );
  const [isBatchDialogOpen, setIsBatchDialogOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<ProductBatch | null>(null);

  const productForm = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      articleNumber: product?.articleNumber || "",
      category: product?.category || "",
      price: typeof product?.price === 'number' ? product.price : 0,
      priceUnit: product?.priceUnit || "",
      description: product?.description || "",
      isVegan: product?.isVegan || false,
      isVegetarian: product?.isVegetarian || false,
      harvestOnDemand: product?.harvestOnDemand || false,
      deliveryTimeInDays: product?.deliveryTimeInDays || 0,
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

  if (!product) {
    return (
      <div className="container mx-auto p-4 md:p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Button onClick={() => navigate("/")}>Go to Homepage</Button>
      </div>
    );
  }

  const onProductSubmit = (values: z.infer<typeof productSchema>) => {
    const updatedProduct = { ...product, ...values };
    setProduct(updatedProduct);
    const productIndex = mockProducts.findIndex(p => p.id === product.id);
    if (productIndex > -1) {
      mockProducts[productIndex] = updatedProduct;
    }
    showSuccess("Product details saved successfully!");
  };

  const handleOpenBatchDialog = (batch: ProductBatch | null) => {
    setEditingBatch(batch);
    if (batch) {
      batchForm.reset({
        availableQuantity: batch.availableQuantity,
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
    if (editingBatch) { // Editing existing batch
      const updatedBatches = product.batches.map(b =>
        b.id === editingBatch.id ? { ...b, ...values } : b
      );
      setProduct({ ...product, batches: updatedBatches });
    } else { // Adding new batch
      const newBatch = { id: `batch-${Date.now()}`, ...values };
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
          {/* Product Details Cards */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField control={productForm.control} name="name" render={({ field }) => (<FormItem><FormLabel>Product Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={productForm.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Details & Pricing</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={productForm.control} name="articleNumber" render={({ field }) => (<FormItem><FormLabel>Article Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={productForm.control} name="category" render={({ field }) => (<FormItem><FormLabel>Category</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Fruits and berries">Fruits and berries</SelectItem><SelectItem value="Vegetables">Vegetables</SelectItem><SelectItem value="Bakery">Bakery</SelectItem><SelectItem value="Dairy products">Dairy products</SelectItem><SelectItem value="Meat and poultry">Meat and poultry</SelectItem><SelectItem value="Seafood">Seafood</SelectItem><SelectItem value="Animal products">Animal products</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
              <FormField control={productForm.control} name="price" render={({ field }) => (<FormItem><FormLabel>Price (€)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={productForm.control} name="priceUnit" render={({ field }) => (<FormItem><FormLabel>Price Unit</FormLabel><FormControl><Input placeholder="e.g., kg, piece, liter" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={productForm.control} name="deliveryTimeInDays" render={({ field }) => (<FormItem><FormLabel>Available in (days)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
          </Card>

          {/* Batch Management Card */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Manage Batches</CardTitle>
                  <CardDescription>Add, edit, or remove batches for this product.</CardDescription>
                </div>
                <Button type="button" onClick={() => handleOpenBatchDialog(null)}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Batch
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Production Date</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {product.batches.map((batch) => (
                    <TableRow key={batch.id}>
                      <TableCell>{format(new Date(batch.productionDate), "PPP")}</TableCell>
                      <TableCell>{format(new Date(batch.expiryDate), "PPP")}</TableCell>
                      <TableCell>{batch.availableQuantity}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenBatchDialog(batch)}>Edit</Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader><AlertDialogTitle>Delete Batch?</AlertDialogTitle><AlertDialogDescription>This will permanently delete this batch. This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                            <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteBatch(batch.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
            <div className="flex gap-4">
              <Button type="submit">Save Product Details</Button>
              <Button type="button" variant="secondary" onClick={handleToggleVisibility}>{product.visibility === "public" ? "Hide" : "Show"}</Button>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild><Button type="button" variant="destructive">Delete Product</Button></AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete your product listing and all its batches.</AlertDialogDescription></AlertDialogHeader>
                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDeleteProduct}>Continue</AlertDialogAction></AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </form>
      </Form>

      {/* Batch Edit/Add Dialog */}
      <Dialog open={isBatchDialogOpen} onOpenChange={setIsBatchDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingBatch ? 'Edit Batch' : 'Add New Batch'}</DialogTitle>
            <DialogDescription>Fill in the details for this batch.</DialogDescription>
          </DialogHeader>
          <Form {...batchForm}>
            <form onSubmit={batchForm.handleSubmit(onBatchSubmit)} className="space-y-4 py-4">
              <FormField control={batchForm.control} name="availableQuantity" render={({ field }) => (<FormItem><FormLabel>Available Quantity</FormLabel><FormControl><Input placeholder="e.g., 1kg or 1 dozen" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={batchForm.control} name="productionDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Production Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value ? new Date(field.value) : undefined} onSelect={(date) => field.onChange(date?.toISOString())} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
              <FormField control={batchForm.control} name="expiryDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Expiry Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value ? new Date(field.value) : undefined} onSelect={(date) => field.onChange(date?.toISOString())} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsBatchDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Save Batch</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditProduct;