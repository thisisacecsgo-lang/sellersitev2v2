import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { mockSellers, mockProducts } from "@/data/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Star, MapPin, MessageSquare, Archive, Edit } from "lucide-react"; // Import Edit icon
import ProductList from "@/components/ProductList";
import type { Product } from "@/types";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import BackButton from "@/components/BackButton";
import { showSuccess, showError } from "@/utils/toast";
import { StarRating } from "@/components/StarRating";
import { Badge } from "@/components/ui/badge"; // Import Badge component

const SellerProfile = () => {
  const { id: routeId } = useParams<{ id: string }>();
  const id = routeId || 'seller-5';
  const seller = mockSellers.find((s) => s.id === id);

  const [sellerProducts, setSellerProducts] = useState(() => 
    mockProducts.filter(p => p.sellerId === id)
  );

  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleToggleVisibility = (productId: string) => {
    let newVisibility: "public" | "hidden" = "public";
    setSellerProducts(prevProducts =>
      prevProducts.map(p => {
        if (p.id === productId) {
          newVisibility = p.visibility === 'public' ? 'hidden' : 'public';
          return { ...p, visibility: newVisibility };
        }
        return p;
      })
    );
    showSuccess(`Product is now ${newVisibility}.`);
  };

  const handleDeleteProduct = (productId: string) => {
    setSellerProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
    showError("Product has been deleted.");
  };

  const { availableProducts, soldProductsCount, averageRating, availableCategories } = useMemo(() => {
    if (!seller) {
      return { availableProducts: [], soldProductsCount: 0, averageRating: 0, availableCategories: [] };
    }
    
    const avg =
      seller.reviews.length > 0
        ? seller.reviews.reduce((acc, r) => acc + r.rating, 0) / seller.reviews.length
        : 0;

    const filterAndSort = (products: Product[]) => {
      return products
        .filter(p => {
          const categoryMatch = categoryFilter === 'all' || p.category === categoryFilter;
          const searchMatch = 
              p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              p.description?.toLowerCase().includes(searchTerm.toLowerCase());
          const statusMatch = statusFilter === 'all' || p.visibility === statusFilter;
          return categoryMatch && searchMatch && statusMatch;
        })
        .sort((a, b) => {
          if (sortBy === 'newest') {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          if (sortBy === 'oldest') {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          }
          return 0;
        });
    }

    const available = filterAndSort(sellerProducts.filter((p) => p.status === "available"));
    const soldCount = sellerProducts.filter((p) => p.status === "sold").length;
    
    const categories = [...new Set(sellerProducts.map(p => p.category))];

    return {
      availableProducts: available,
      soldProductsCount: soldCount,
      averageRating: avg,
      availableCategories: categories,
    };
  }, [seller, sellerProducts, categoryFilter, sortBy, searchTerm, statusFilter]);

  if (!seller) {
    return (
      <div className="container mx-auto p-4 md:p-8 flex items-center justify-center flex-grow">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Seller not found</h2>
          <Button asChild>
            <Link to="/">Go back to homepage</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <BackButton />
      <AppBreadcrumb />
      <Card className="mb-8">
        <CardContent className="p-6 flex flex-col md:flex-row items-start gap-6">
          <Avatar className="h-24 w-24 border">
            <AvatarImage src={seller.logoUrl} alt={seller.name} />
            <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"> {/* Flex container for name and badge */}
                <h1 className="text-3xl font-bold">{seller.name}</h1>
                {seller.type === "private" && (
                  <Badge variant="secondary" className="rounded-full px-3 py-1 text-sm font-medium">
                    Private
                  </Badge>
                )}
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to={`/seller/${seller.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Link>
              </Button>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <MapPin className="h-4 w-4" />
              <span>{seller.region}</span>
            </div>
            {seller.description && (
              <p className="text-muted-foreground mt-2 text-sm md:text-base">
                {seller.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <StarRating rating={averageRating} />
              <span className="text-muted-foreground">
                ({averageRating.toFixed(1)} from {seller.reviews.length} reviews)
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{soldProductsCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{seller.reviews.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="products">Products ({availableProducts.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="products" className="mt-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Input
              type="search"
              placeholder="Search my products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-auto sm:flex-grow"
            />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {availableCategories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Date: Newest first</SelectItem>
                <SelectItem value="oldest">Date: Oldest first</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-6">
            <ProductList 
              products={availableProducts} 
              showActions 
              onToggleVisibility={handleToggleVisibility}
              onDeleteProduct={handleDeleteProduct}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SellerProfile;