"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, Hash, Palette, Package } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getColorDetails } from "@/features/colors/actions/colors.actions";

interface ColorDetailViewProps {
  colorId: string;
}

export function ColorDetailView({ colorId }: ColorDetailViewProps) {
  const {
    data: color,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["color", colorId],
    queryFn: () => getColorDetails(colorId),
    enabled: !!colorId,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/colors">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Colors
              </Button>
            </Link>
            <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !color) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/colors">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Colors
            </Button>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Color Not Found</CardTitle>
            <CardDescription>
              The color you're looking for doesn't exist or has been deleted.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/colors">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Colors
            </Button>
          </Link>
          <div
            className="h-8 w-8 rounded-full border-2 border-gray-300 shadow-sm"
            style={{ backgroundColor: color.value }}
          />
          <div>
            <h1 className="text-2xl font-bold">{color.name}</h1>
            <p className="text-muted-foreground font-mono">{color.value}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Color Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Color Name:</span>
                <span className="text-sm">{color.name}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Hex Value:</span>
                <span className="text-sm font-mono">{color.value}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Sort Order:</span>
                <Badge variant="outline">{color.sort_order}</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Color ID:</span>
                <span className="text-xs font-mono text-muted-foreground">
                  {color.id}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Usage Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Products using this color:
                </span>
                <Badge variant="secondary">{color.productCount} products</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Timestamps
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Created:</span>
                <span className="text-sm">
                  {new Date(color.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Last Updated:</span>
                <span className="text-sm">
                  {new Date(color.updated_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {color.products && color.products.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Related Products
              </CardTitle>
              <CardDescription>Products that use this color</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {color.products.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-2 border rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium">{product.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.slug}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      <Hash className="mr-1 h-3 w-3" />
                      {product.id.slice(-8)}
                    </Badge>
                  </div>
                ))}
                {color.products.length > 5 && (
                  <p className="text-sm text-muted-foreground text-center pt-2">
                    And {color.products.length - 5} more products...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
