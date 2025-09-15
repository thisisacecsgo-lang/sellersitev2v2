import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import BackButton from "@/components/BackButton";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { showSuccess } from "@/utils/toast";
import { Separator } from "@/components/ui/separator";
import { mockProducts, mockSellers } from "@/data/mockData"; // To simulate adding a product, and get seller info
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Upload } from "lucide-react";
import type { Product } from "@/types";

// Helper function to generate a unique 5-digit article number
const generateUniqueArticleNumber = (existingProducts: Product[]): string => {
  let newArticleNumber: string;
  let isUnique = false;
  do {
    // Generate a random 5-digit number (10000 to 99999)
    newArticleNumber = String(Math.floor(10000 + Math.random() * 90000));
    isUnique = !existingProducts.some(p => p.articleNumber === newArticleNumber);
  } while (!isUnique);
  return newArticleNumber;
};

const productSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  category: z.string().min(1, { message: "Please select a category." }),
  availableQuantity: z.string().min(1, { message: "Quantity is required." }),
  price: z.coerce.number().min(0, { message: "Price must be a positive number." }),
  priceUnit: z.string().min(1, { message: "Price unit is required." }),
  description: z.string().optional(),
  isVegan: z.boolean().default(false),
  isVegetarian: z.boolean().default(false),
  harvestOnDemand: z.boolean().default(false),
  deliveryTimeInDays: z.coerce.number().int().min(0, { message: "Must be a positive number." }).default(1),
  expiryDate: z.string().optional(),
  region: z.string().min(1, { message: "Region is required." }), // Added region to schema
});

const CreateProduct = () => {
  const navigate = useNavigate();

  // Find the current seller's region (assuming 'seller-5' for this demo)
  const currentSeller = mockSellers.find(s => s.id === "seller-5");
  const sellerRegion = currentSeller?.region || "";

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category: "",
      availableQuantity: "",
      price: 0,
      priceUnit: "",
      description: "",
      isVegan: false,
      isVegetarian: false,
      harvestOnDemand: false,
      deliveryTimeInDays: 1,
      expiryDate: undefined,
      region: sellerRegion, // Set default region from seller
    },
  });

  const onSubmit = (values: z.infer<typeof productSchema>) => {
    const newArticleNumber = generateUniqueArticleNumber(mockProducts);
    
    const maxId = mockProducts.reduce((max, p) => Math.max(max, parseInt(p.id, 10)), 0);
    const newProductId = (maxId + 1).toString();

    // For dummy upload, always use a placeholder image
    const imageUrls = ["/placeholder.svg"];

    const newProduct = {
      id: newProductId,
      sellerId: "seller-5",
      articleNumber: newArticleNumber, // Automatically generated
      imageUrls: imageUrls,
      status: "available",
      visibility: "public",
      createdAt: new Date().toISOString(),
      freshness: "fresh",
      ...values,
      batches: [
        {
          id: `batch-${newProductId}-1`,
          productionDate: new Date().toISOString(),
          expiryDate: values.expiryDate || new Date().toISOString(),
          availableQuantity: `${values.availableQuantity}${values.priceUnit}`, // Combine quantity and unit
        },
      ],
    };
    // @ts-ignore
    delete newProduct.expiryDate;
    // @ts-ignore
    delete newProduct.availableQuantity;

    mockProducts.push(newProduct);
    showSuccess("Product created successfully!");
    navigate(`/product/${newProductId}`);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <BackButton />
      <AppBreadcrumb />
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
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
              <FormItem>
                <FormLabel>Product Images</FormLabel>
                <FormControl>
                  <Button type="button" variant="outline" className="w-full" onClick={() => showSuccess("Simulating photo upload...")}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Photo
                  </Button>
                </FormControl>
                <FormDescription>
                  Click to simulate uploading a product image. (Currently uses a placeholder)
                </FormDescription>
              </FormItem>
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
                name="priceUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price Unit</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="liter">liter</SelectItem>
                        <SelectItem value="piece">piece</SelectItem>
                      </SelectContent>
                    </Select>
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
                      <Input placeholder="e.g., 10" {...field} /> {/* Input for just the number */}
                    </FormControl>
                    <FormDescription>
                      Enter the numerical quantity. The unit will be taken from 'Price Unit'.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deliveryTimeInDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ready to ship in (days)</FormLabel>
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
                name="expiryDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Shelf Life (Optional)</FormLabel>
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
                      The date until which the product is best.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Region</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Flensburg" {...field} />
                    </FormControl>
                    <FormDescription>
                      The region where the product is sourced or produced.
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

          <div className="flex justify-end">
            <Button type="submit">Create Product</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateProduct;