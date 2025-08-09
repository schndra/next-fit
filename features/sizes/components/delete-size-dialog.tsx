"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertTriangle } from "lucide-react";
import { deleteSize } from "@/features/sizes/actions/sizes.actions";
import { SizeType } from "./column";

interface DeleteSizeDialogProps {
  size: SizeType;
  open: boolean;
  onClose: () => void;
}

export function DeleteSizeDialog({
  size,
  open,
  onClose,
}: DeleteSizeDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const result = await deleteSize(size.id);

      if (result.success) {
        toast.success(result.message);
        onClose();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error deleting size:", error);
      toast.error("Failed to delete size. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => !isLoading && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Size
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the size
            and remove it from all associated products.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border p-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">Size:</span>
              <Badge variant="secondary">{size.value}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Name:</span>
              <span className="text-sm text-muted-foreground">{size.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Sort Order:</span>
              <Badge variant="outline">{size.sort_order}</Badge>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Size
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
