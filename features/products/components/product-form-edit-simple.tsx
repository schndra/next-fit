"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ProductFormEditProps {
  mode: "create" | "edit";
  initialData?: any;
}

export function ProductFormEdit({ mode, initialData }: ProductFormEditProps) {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold">
            {mode === "create" ? "Create Product" : "Edit Product"}
          </h1>
          <p className="text-muted-foreground">
            {mode === "create"
              ? "Add a new product to your catalog"
              : "Update product information"}
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Product Title</label>
              <Input placeholder="Enter product title" />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea placeholder="Product description" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Price (LKR)</label>
                <Input type="number" placeholder="0.00" />
              </div>
              <div>
                <label className="text-sm font-medium">SKU</label>
                <Input placeholder="Product SKU" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-600">
                Image upload component will be here
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Multiple image upload with drag & drop - Working on integration
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Link href="/admin/products">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button>
            {mode === "create" ? "Create Product" : "Update Product"}
          </Button>
        </div>
      </div>
    </div>
  );
}
