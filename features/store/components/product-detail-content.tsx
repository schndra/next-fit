"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Star, ShoppingCart, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "../utils/currency";
import { ProductImageGallery } from "./product-image-gallery";
import { ProductOptions } from "./product-options";
import { ProductReviews } from "./product-reviews";
import { ProductCard } from "./product-card";
import { useRelatedProducts } from "../hooks/use-related-products";
import type { DetailedStoreProduct } from "../types";

interface ProductDetailContentProps {
  product: DetailedStoreProduct;
}

export function ProductDetailContent({ product }: ProductDetailContentProps) {
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes[0]?.value
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors[0]?.value
  );

  const { data: relatedProducts = [], isLoading: relatedLoading } =
    useRelatedProducts(product.id, product.category.id, 4);

  const averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
        product.reviews.length
      : 0;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "h-5 w-5",
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        )}
      />
    ));
  };

  const discountPercentage = product.compare_price
    ? Math.round(
        ((product.compare_price - product.price) / product.compare_price) * 100
      )
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back to Products Link */}
      <div className="mb-6">
        <Link
          href="/products"
          className="inline-flex items-center text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image Gallery */}
        <div>
          <ProductImageGallery
            images={product.images}
            productName={product.title}
          />
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{product.category.title}</Badge>
            {discountPercentage > 0 && (
              <Badge className="bg-red-500 hover:bg-red-600">
                -{discountPercentage}% OFF
              </Badge>
            )}
          </div>

          <h1 className="text-4xl font-bold leading-tight">{product.title}</h1>

          {/* Price and Rating */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">
                {formatPrice(product.price)}
              </span>
              {product.compare_price && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.compare_price)}
                </span>
              )}
            </div>
            {product.reviews.length > 0 && (
              <>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-1">
                  {renderStars(averageRating)}
                  <span className="text-sm text-muted-foreground">
                    {averageRating.toFixed(1)} ({product.reviews.length}{" "}
                    reviews)
                  </span>
                </div>
              </>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {product.desc}
          </p>

          <Separator />

          {/* Product Options */}
          <ProductOptions
            sizes={product.sizes}
            colors={product.colors}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
          />

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-block w-2 h-2 rounded-full",
                product.quantity > 0 ? "bg-green-500" : "bg-red-500"
              )}
            />
            <span className="text-sm">
              {product.quantity > 0 ? (
                product.quantity <= product.low_stock_threshold ? (
                  <span className="text-orange-600">
                    Only {product.quantity} left in stock
                  </span>
                ) : (
                  <span className="text-green-600">
                    In Stock ({product.quantity} available)
                  </span>
                )
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </span>
          </div>

          {/* Add to Cart */}
          <Button
            size="lg"
            className="w-full"
            disabled={product.quantity === 0}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            {product.quantity > 0 ? "Add to Cart" : "Out of Stock"}
          </Button>

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <p>
                <span className="font-medium">SKU:</span> {product.sku}
              </p>
              {product.barcode && (
                <p>
                  <span className="font-medium">Barcode:</span>{" "}
                  {product.barcode}
                </p>
              )}
            </div>
            <div>
              <p>
                <span className="font-medium">Type:</span>{" "}
                {product.is_digital ? "Digital" : "Physical"}
              </p>
              {product.is_featured && (
                <p>
                  <span className="font-medium">Featured Product</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-12" />

      {/* Customer Reviews Section */}
      <ProductReviews
        reviews={product.reviews}
        averageRating={averageRating}
        totalReviews={product.reviews.length}
      />

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <>
          <Separator className="my-12" />
          <section className="py-8">
            <h2 className="text-2xl font-bold mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
