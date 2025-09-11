import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { showSuccess, showError } from "@/utils/toast";
import { Separator } from "@/components/ui/separator";
import { mockSellers } from "@/data/mockData";

const sellerProfileSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  region: z.string().min(2, { message: "Region is required." }),
  description: z.string().optional(),
  logoUrl: z.string().url({ message: "Must be a valid URL." }).optional().or(z.literal("")),
  verified: z.boolean(),
});

const EditSellerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find the seller to edit (for demo, assuming 'seller-5' if no ID is provided)
  const sellerToEdit = mockSellers.find((s) => s.id === (id || 'seller-5'));

  const form = useForm<z.infer<typeof sellerProfileSchema>>({
    resolver: zodResolver(sellerProfileSchema),
    defaultValues: {
      name: sellerToEdit?.name || "",
      region: sellerToEdit?.region || "",
      description: sellerToEdit?.description || "",
      logoUrl: sellerToEdit?.logoUrl || "",
      verified: sellerToEdit?.verified || false,
    },
  });

  if (!sellerToEdit) {
    return (
      <div className="container mx-auto p-4 md:p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Seller not found</h2>
        <Button onClick={() => navigate("/")}>Go to Homepage</Button>
      </div>
    );
  }

  const onSubmit = (values: z.infer<typeof sellerProfileSchema>) => {
    console.log("Seller profile updated:", values);
    // Simulate updating mock data
    const updatedSeller = {
      ...sellerToEdit,
      ...values,
      logoUrl: values.logoUrl === "" ? undefined : values.logoUrl, // Store as undefined if empty string
    };
    const sellerIndex = mockSellers.findIndex(s => s.id === sellerToEdit.id);
    if (sellerIndex > -1) {
      mockSellers[sellerIndex] = updatedSeller;
    }
    showSuccess("Profile saved successfully!");
    navigate(`/seller/${sellerToEdit.id}`); // Navigate back to the seller profile page
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <BackButton />
      <AppBreadcrumb />
      <h1 className="text-3xl font-bold mb-6">Edit My Profile</h1>
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
                    <FormLabel>Farm/Business Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Otto's Organic Farm" {...field} />
                    </FormControl>
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
                      <Input placeholder="e.g., Aukrug" {...field} />
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
                        placeholder="Tell buyers about your farm or business..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A short description of your farm or business.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo URL</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., https://example.com/logo.png" {...field} />
                    </FormControl>
                    <FormDescription>
                      Link to your farm's logo or profile picture.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="verified"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Verified Status</FormLabel>
                      <FormDescription>
                        Indicates if your profile is officially verified.
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
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditSellerProfile;