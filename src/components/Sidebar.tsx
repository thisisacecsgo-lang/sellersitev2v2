import { Link } from "react-router-dom";
import { User, ScanLine, ClipboardList, DollarSign, PlusCircle, MessageSquare, HelpCircle, BarChart, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background sm:flex">
      <div className="flex h-14 items-center border-b px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <img src="/images/logooo.png" alt="MySite Logo" className="h-12 w-20"/> {/* Изменено с h-10 w-12 на h-12 w-20 */}
          <span className="whitespace-nowrap">Hiesige Höfe</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-auto py-2">
        <div className="grid items-start px-4 text-sm font-medium pt-4"> {/* Добавлен pt-4 для увеличения отступа */}
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
          >
            <User className="h-4 w-4" />
            My Profile
          </Link>
          <Link
            to="/orders"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
          >
            <ClipboardList className="h-4 w-4" />
            Orders
          </Link>
          <Link
            to="/statistics"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
          >
            <BarChart className="h-4 w-4" />
            Statistics
          </Link>
          <Link
            to="/update-quantity"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
          >
            <ScanLine className="h-4 w-4" />
            Update Qty
          </Link>
          <Link
            to="/generate-qrcodes"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
          >
            <QrCode className="h-4 w-4" />
            Generate QR Codes
          </Link>
          <Link
            to="/revenue"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
          >
            <DollarSign className="h-4 w-4" />
            Revenue
          </Link>
          <Link
            to="/my-reviews"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
          >
            <MessageSquare className="h-4 w-4" />
            My Reviews
          </Link>
          <Link
            to="/faq"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
          >
            <HelpCircle className="h-4 w-4" />
            FAQ
          </Link>
          <div className="mt-4 pt-4 border-t border-border">
            <Link to="/product/new" className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all hover:bg-secondary">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <PlusCircle className="h-5 w-5" />
              </Button>
              <span className="font-semibold">Add New Product</span>
            </Link>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;