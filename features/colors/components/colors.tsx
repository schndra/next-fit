"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/data-display/data-table";
import {
  getAllColors,
  ColorType,
} from "@/features/colors/actions/colors.actions";
import { columns } from "./column";
import { CreateColorDialog } from "./create-color-dialog";
import { EditColorDialog } from "./edit-color-dialog";
import { DeleteColorDialog } from "./delete-color-dialog";

export default function Colors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingColor, setEditingColor] = useState<ColorType | null>(null);
  const [deletingColor, setDeletingColor] = useState<ColorType | null>(null);
  const [viewingColorId, setViewingColorId] = useState<string | null>(null);

  const {
    data: colors = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["colors"],
    queryFn: getAllColors,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Filter colors based on search term
  const filteredColors = colors.filter(
    (color) =>
      color.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
      color.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRefresh = () => {
    refetch();
  };

  const handleExport = () => {
    // Create CSV content
    const csvContent = [
      ["ID", "Color Value", "Color Name", "Sort Order", "Created At"].join(","),
      ...filteredColors.map((color) =>
        [
          color.id,
          color.value,
          `"${color.name}"`,
          color.sort_order,
          color.created_at ? new Date(color.created_at).toISOString() : "N/A",
        ].join(",")
      ),
    ].join("\n");

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "colors.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>
            Failed to load colors. Please try again.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleRefresh}>Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Colors</h1>
          <p className="text-muted-foreground">
            Manage your product colors here.
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Color
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Color Management</CardTitle>
              <CardDescription>
                A list of all colors in your catalog.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                disabled={filteredColors.length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <Filter className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search colors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-4 p-4 border rounded"
                  >
                    <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse" />
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={filteredColors}
                searchValue={searchTerm}
              />
            )}
          </div>
        </CardContent>
      </Card>

      <CreateColorDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />

      {editingColor && (
        <EditColorDialog
          color={editingColor}
          open={Boolean(editingColor)}
          onOpenChange={(open) => {
            if (!open) setEditingColor(null);
          }}
        />
      )}

      {deletingColor && (
        <DeleteColorDialog
          color={deletingColor}
          open={Boolean(deletingColor)}
          onOpenChange={(open) => {
            if (!open) setDeletingColor(null);
          }}
        />
      )}
    </div>
  );
}
