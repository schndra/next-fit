"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateColor } from "@/features/colors/actions/colors.actions";
import { UpdateColorInput } from "@/features/colors/schema/color.schemas";
import { ColorType } from "./column";
import { EditColorForm } from "./color-form";

interface EditColorDialogProps {
  color: ColorType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditColorDialog({
  color,
  open,
  onOpenChange,
}: EditColorDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (data: UpdateColorInput) => {
    setIsLoading(true);
    try {
      const result = await updateColor(data);

      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["colors"] });
        onOpenChange(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error updating color:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Color</DialogTitle>
          <DialogDescription>
            Update the color details. Make sure to enter a valid hex color code.
          </DialogDescription>
        </DialogHeader>
        <EditColorForm
          initialData={color}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
