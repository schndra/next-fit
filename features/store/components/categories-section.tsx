"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useStoreCategories } from "../hooks/use-store-categories";

export function CategoriesSection() {
  const { data: categories, isLoading, error } = useStoreCategories();

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4 text-center">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg mx-auto mb-3" />
                  <div className="h-4 bg-gray-200 rounded mb-1" />
                  <div className="h-3 bg-gray-200 rounded w-16 mx-auto" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Shop by Category
          </h2>
          <div className="text-center text-muted-foreground">
            Failed to load categories. Please try again later.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories?.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="w-20 h-20 mx-auto mb-3 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    <Image
                      src={
                        category.img?.startsWith("http") ||
                        category.img?.startsWith("/")
                          ? category.img
                          : "/placeholder.svg"
                      }
                      alt={category.title}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold mb-1">{category.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {category._count.products} items
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
