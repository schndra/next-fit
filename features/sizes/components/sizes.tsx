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
import { getAllSizes } from "@/features/sizes/actions/sizes.actions";
import { columns, SizeType } from "./column";
import { CreateSizeDialog } from "./create-size-dialog";
import { EditSizeDialog } from "./edit-size-dialog";
import { DeleteSizeDialog } from "./delete-size-dialog";
import { ViewSizeDialog } from "./view-size-dialog";

export default function Sizes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingSize, setEditingSize] = useState<SizeType | null>(null);
  const [deletingSize, setDeletingSize] = useState<SizeType | null>(null);
  const [viewingSizeId, setViewingSizeId] = useState<string | null>(null);

  const {
    data: sizes = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["sizes"],
    queryFn: getAllSizes,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Filter sizes based on search term
  const filteredSizes = sizes.filter(
    (size) =>
      size.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
      size.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRefresh = () => {
    refetch();
  };

  const handleCreateSuccess = () => {
    setShowCreateDialog(false);
    handleRefresh();
  };

  const handleEditSuccess = () => {
    setEditingSize(null);
    handleRefresh();
  };

  const handleDeleteSuccess = () => {
    setDeletingSize(null);
    handleRefresh();
  };

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600">Error loading sizes</p>
              <Button onClick={handleRefresh} className="mt-4">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sizes</h1>
          <p className="text-muted-foreground">
            Manage product sizes for your e-commerce store
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <Download className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Size
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sizes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sizes.length}</div>
            <p className="text-xs text-muted-foreground">Active size options</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Filtered Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredSizes.length}</div>
            <p className="text-xs text-muted-foreground">
              Matching search criteria
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find sizes by value or name</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search sizes by value or name..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            {searchTerm && (
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sizes ({filteredSizes.length})</CardTitle>
          <CardDescription>Manage your product size options</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={filteredSizes} />
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CreateSizeDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
      />

      {editingSize && (
        <EditSizeDialog
          size={editingSize}
          open={!!editingSize}
          onClose={() => setEditingSize(null)}
        />
      )}

      {deletingSize && (
        <DeleteSizeDialog
          size={deletingSize}
          open={!!deletingSize}
          onClose={() => setDeletingSize(null)}
        />
      )}

      {viewingSizeId && (
        <ViewSizeDialog
          sizeId={viewingSizeId}
          open={!!viewingSizeId}
          onClose={() => setViewingSizeId(null)}
          onEdit={(size) => {
            setViewingSizeId(null);
            setEditingSize(size);
          }}
          onDelete={(size) => {
            setViewingSizeId(null);
            setDeletingSize(size);
          }}
        />
      )}
    </div>
  );
}
