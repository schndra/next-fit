"use client";

import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-bold mb-6">
            Discover Amazing Products at Unbeatable Prices
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Shop from thousands of products across multiple categories with fast
            shipping and secure payments.
          </p>
          <div className="flex gap-4">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Shop Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
            >
              View Categories
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
