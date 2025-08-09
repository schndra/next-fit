"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, ShoppingCart, Star } from "lucide-react";

export function FeaturesSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose Our Store?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
                Fast & Free Shipping
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Free shipping on orders over $50. Express delivery available for
                urgent orders.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-red-600" />
                Customer Satisfaction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                30-day return policy and 24/7 customer support to ensure your
                satisfaction.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-6 w-6 text-yellow-600" />
                Quality Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Carefully curated products from trusted brands with verified
                reviews.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
