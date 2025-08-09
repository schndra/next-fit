import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { User } from "lucide-react";
import { auth } from "@/auth";
import Link from "next/link";
import { signOutUser } from "@/features/auth/actions/user.actions";

const StoreUserButton = async () => {
  const session = await auth();

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
        {!session ? (
          <DropdownMenuItem>
            <Link href="/sign-in">Sign In</Link>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem className="p-0 mb-1">
            <form action={signOutUser} className="w-full">
              <Button
                className="w-full py-4 px-2 h-4 justify-start"
                variant="ghost"
              >
                Sign Out
              </Button>
            </form>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default StoreUserButton;
