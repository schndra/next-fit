"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteColor } from "@/features/colors/actions/colors.actions";
import { ColorType } from "./column";

interface DeleteColorDialogProps {
  color: ColorType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteColorDialog({
  color,
  open,
  onOpenChange,
}: DeleteColorDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const result = await deleteColor(color.id);

      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["colors"] });
        onOpenChange(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error deleting color:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Delete Color</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this color? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <div
            className="h-8 w-8 rounded-full border-2 border-gray-300 shadow-sm"
            style={{ backgroundColor: color.value }}
          />
          <div>
            <p className="font-medium">{color.name}</p>
            <p className="text-sm text-muted-foreground font-mono">
              {color.value}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Trash className="mr-2 h-4 w-4" />
            Delete Color
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
