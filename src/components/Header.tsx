"use client";

import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, User, ScanLine, ClipboardList, DollarSign, PlusCircle, MessageSquare, HelpCircle, BarChart, QrCode } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="overflow-y-auto max-w-[300px] custom-scrollbar">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              to="/"
              className="group flex h-10 w-auto shrink-0 items-center justify-center gap-9 text-lg font-semibold text-foreground md:text-base"
              onClick={() => setIsSheetOpen(false)}
            >
              <img src="/images/logooo.png" alt="MySite Logo" className="h-20 w-20"/>
            </Link>
            <Link
              to="/"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              onClick={() => setIsSheetOpen(false)}
            >
              <User className="h-5 w-5" />
              My Profile
            </Link>
            <Link
              to="/orders"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              onClick={() => setIsSheetOpen(false)}
            >
              <ClipboardList className="h-5 w-5" />
              Orders
            </Link>
            <Link
              to="/statistics"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              onClick={() => setIsSheetOpen(false)}
            >
              <BarChart className="h-5 w-5" />
              Statistics
            </Link>
            <Link
              to="/update-quantity"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              onClick={() => setIsSheetOpen(false)}
            >
              <ScanLine className="h-5 w-5" />
              Update Qty
            </Link>
            <Link
              to="/generate-qrcodes"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              onClick={() => setIsSheetOpen(false)}
            >
              <QrCode className="h-5 w-5" />
              Generate QR Codes
            </Link>
            <Link
              to="/revenue"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              onClick={() => setIsSheetOpen(false)}
            >
              <DollarSign className="h-5 w-5" />
              Revenue
            </Link>
            <Link
              to="/my-reviews"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              onClick={() => setIsSheetOpen(false)}
            >
              <MessageSquare className="h-5 w-5" />
              My Reviews
            </Link>
            <Link
              to="/faq"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              onClick={() => setIsSheetOpen(false)}
            >
              <HelpCircle className="h-5 w-5" />
              FAQ
            </Link>
            <Link
              to="/product/new"
              className="flex items-center gap-4 px-2.5 text-primary hover:text-foreground"
              onClick={() => setIsSheetOpen(false)}
            >
              <PlusCircle className="h-5 w-5" />
              Add New Product
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="relative ml-auto flex-1 md:grow-0">
      </div>
    </header>
  );
};

export default Header;