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
import { createColor } from "@/features/colors/actions/colors.actions";
import { CreateColorInput } from "@/features/colors/schema/color.schemas";
import { CreateColorForm } from "./color-form";

interface CreateColorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateColorDialog({
  open,
  onOpenChange,
}: CreateColorDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (data: CreateColorInput) => {
    setIsLoading(true);
    try {
      const result = await createColor(data);

      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["colors"] });
        onOpenChange(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error creating color:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Color</DialogTitle>
          <DialogDescription>
            Add a new color to your catalog. Enter the color details below.
          </DialogDescription>
        </DialogHeader>
        <CreateColorForm
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
