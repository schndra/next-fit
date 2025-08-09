import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { Search, ShoppingCart, User, Heart, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "../mode-toggle";
import StoreUserButton from "../user-button";

export function Header() {
  // const [cartItems] = useState(3); // Mock cart items count

  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600">
            NextFit
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search products..." className="pl-10" />
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/products"
              className="text-sm font-medium hover:text-blue-600"
            >
              Products
            </Link>
            <Link
              href="/categories"
              className="text-sm font-medium hover:text-blue-600"
            >
              Categories
            </Link>
            <Link
              href="/deals"
              className="text-sm font-medium hover:text-blue-600"
            >
              Deals
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* ModeToggle */}
            <ModeToggle />

            {/* Wishlist */}
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Heart className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {/* {cartItems > 0 && ( */}
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                4
              </Badge>
              {/* )} */}
            </Button>

            {/* User Menu */}
            <StoreUserButton />

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input placeholder="Search products..." className="pl-10" />
                  </div>
                  <Link href="/products" className="text-lg font-medium">
                    Products
                  </Link>
                  <Link href="/categories" className="text-lg font-medium">
                    Categories
                  </Link>
                  <Link href="/deals" className="text-lg font-medium">
                    Deals
                  </Link>
                  <Link href="/wishlist" className="text-lg font-medium">
                    Wishlist
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
