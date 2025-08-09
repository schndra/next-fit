import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-6">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-8">
          Sorry, we couldn't find the product you're looking for. It may have
          been removed or the link is incorrect.
        </p>
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/products">Browse All Products</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
