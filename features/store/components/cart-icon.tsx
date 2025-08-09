"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCartSummary } from "../hooks/use-cart";

interface CartIconProps {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  showText?: boolean;
}

export function CartIcon({
  variant = "ghost",
  size = "default",
  showText = false,
}: CartIconProps) {
  const { data: session } = useSession();
  const { data: cartSummary } = useCartSummary(session?.user?.id);

  const totalItems = cartSummary?.totalItems || 0;

  return (
    <Link href="/cart">
      <Button variant={variant} size="icon" className="relative">
        <ShoppingCart className="h-5 w-5" />
        {totalItems > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
            {totalItems > 99 ? "99+" : totalItems}
          </Badge>
        )}
        {showText && <span className="ml-2">Cart</span>}
      </Button>
    </Link>
  );
}
