import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Your saved items",
};

export default function WishlistPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Your Wishlist</h1>
        <p className="text-muted-foreground mb-8">
          Save items you love for later
        </p>
        <div className="bg-muted/50 rounded-lg p-12">
          <p className="text-lg text-muted-foreground">
            Your wishlist is empty
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Start browsing and add items to your wishlist
          </p>
        </div>
      </div>
    </div>
  );
}
