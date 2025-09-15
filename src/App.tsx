import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import ProductDetail from "./pages/ProductDetail";
import SellerProfile from "./pages/SellerProfile";
import Layout from "./components/Layout";
import EditProduct from "./pages/EditProduct";
import UpdateQuantity from "./pages/UpdateQuantity";
import Orders from "./pages/Orders";
import Revenue from "./pages/Revenue";
import CreateProduct from "./pages/CreateProduct";
import MyReviews from "./pages/MyReviews";
import EditSellerProfile from "./pages/EditSellerProfile";
import ScrollToTop from "./components/ScrollToTop";
import FAQ from "./pages/FAQ";
import Statistics from "./pages/Statistics";
import GenerateQrCodes from "./pages/GenerateQrCodes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster /> {/* Перемещено сюда */}
    <Sonner /> {/* Перемещено сюда */}
    <TooltipProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<SellerProfile />} />
            <Route path="/product/new" element={<CreateProduct />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/product/:id/edit" element={<EditProduct />} />
            <Route path="/seller/:id" element={<SellerProfile />} />
            <Route path="/seller/:id/edit" element={<EditSellerProfile />} />
            <Route path="/update-quantity" element={<UpdateQuantity />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/revenue" element={<Revenue />} />
            <Route path="/my-reviews" element={<MyReviews />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/generate-qrcodes" element={<GenerateQrCodes />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;