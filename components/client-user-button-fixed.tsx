"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { User, LogIn } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ClientUserButton = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({
      redirect: false,
    });
    // Force immediate refresh of the page
    router.refresh();
  };

  if (status === "loading") {
    return (
      <Button variant="ghost" size="icon" disabled>
        <User className="h-5 w-5" />
      </Button>
    );
  }

  // If not authenticated, show sign in button
  if (!session) {
    return (
      <Button variant="ghost" size="sm" asChild>
        <Link href="/sign-in">
          <LogIn className="h-4 w-4 mr-2" />
          Sign In
        </Link>
      </Button>
    );
  }

  // If authenticated, show user dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/orders">Orders</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/wishlist">Wishlist</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-0 mb-1">
          <Button
            onClick={handleSignOut}
            className="w-full py-4 px-2 h-4 justify-start"
            variant="ghost"
          >
            Sign Out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ClientUserButton;
