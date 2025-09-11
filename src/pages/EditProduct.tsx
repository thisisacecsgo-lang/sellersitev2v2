import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { mockProducts } from "@/data/mockData";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import BackButton from "@/components/BackButton";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { showSuccess, showError } from "@/utils/toast";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

const productSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  category: z.string().min(1, { message: "Please select a category." }),
  availableQuantity: z.string().min(1, { message: "Quantity is required." }),
  price: z.coerce.number().min(0, { message: "Price must be a positive number." }),
  description: z.string().optional(),
  isVegan: z.boolean(),
  isVegetarian: z.boolean(),
  harvestOnDemand: z.boolean(),
  deliveryTimeInDays: z.coerce.number().int().min(0, { message: "Must be a positive number." }),
  productionDate: z.string().optional(), // New field
  expiryDate: z.string().optional(), // New field
});

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState(() =>
    mockProducts.find((p) => p.id === id)
  );

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      category: product?.category || "",
      availableQuantity: product?.availableQuantity || "",
      price: typeof product?.price === 'number' ? product.price : 0,
      description: product?.description || "",
      isVegan: product?.isVegan || false,
      isVegetarian: product?.isVegetarian || false,
      harvestOnDemand: product?.harvestOnDemand || false,
      deliveryTimeInDays: product?.deliveryTimeInDays || 0,
      productionDate: product?.productionDate || undefined,
      expiryDate: product?.expiryDate || undefined,
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

  const onSubmit = (values: z.infer<typeof productSchema>) => {
    console.log("Form submitted with values:", values);
    // Here you would typically send the data to your backend API
    // For demo, update the mock product
    const updatedProduct = {
      ...product,
      ...values,
      productionDate: values.productionDate || undefined,
      expiryDate: values.expiryDate || undefined,
    };
    const productIndex = mockProducts.findIndex(p => p.id === product.id);
    if (productIndex > -1) {
      mockProducts[productIndex] = updatedProduct;
    }
    setProduct(updatedProduct); // Update local state to reflect changes
    showSuccess("Product saved successfully!");
  };

  const handleToggleVisibility = () => {
    const newVisibility = product.visibility === "public" ? "hidden" : "public";
    setProduct({ ...product, visibility: newVisibility });
    showSuccess(`Product is now ${newVisibility}.`);
  };

  const handleDelete = () => {
    console.log(`Deleting product ${product.id}`);
    // Here you would call your backend to delete the product
    const updatedMockProducts = mockProducts.filter(p => p.id !== product.id);
    mockProducts.splice(0, mockProducts.length, ...updatedMockProducts); // Update mockProducts array
    showError("Product has been deleted.");
    navigate("/"); // Redirect after deletion
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <BackButton />
      <AppBreadcrumb />
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Fresh Organic Apples" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell buyers about your product..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Details & Pricing</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Fruits and berries">Fruits and berries</SelectItem>
                        <SelectItem value="Vegetables">Vegetables</SelectItem>
                        <SelectItem value="Bakery">Bakery</SelectItem>
                        <SelectItem value="Dairy products">Dairy products</SelectItem>
                        <SelectItem value="Meat and poultry">Meat and poultry</SelectItem>
                        <SelectItem value="Seafood">Seafood</SelectItem>
                        <SelectItem value="Animal products">Animal products</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (€)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 5.99" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="availableQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Quantity</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 1kg or 1 dozen" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deliveryTimeInDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available in</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 1" {...field} />
                    </FormControl>
                    <FormDescription>
                      The number of days until the product is available for pickup or delivery.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="productionDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Production Date (Optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date ? date.toISOString() : undefined)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      The date the product was produced or harvested.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Expiry Date (Optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date ? date.toISOString() : undefined)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      The date the product expires.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="isVegan"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Vegan</FormLabel>
                      <FormDescription>
                        This product contains no animal products.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isVegetarian"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Vegetarian</FormLabel>
                      <FormDescription>
                        This product is suitable for vegetarians.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="harvestOnDemand"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Harvest on Demand</FormLabel>
                      <FormDescription>
                        This product is harvested only after an order is placed.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Separator />

          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            <div className="flex gap-4">
              <Button type="submit">Save</Button>
              <Button type="button" variant="secondary" onClick={handleToggleVisibility}>
                {product.visibility === "public" ? "Hide" : "Show"}
              </Button>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive">
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your product listing.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditProduct;