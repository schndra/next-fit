"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SizeForm } from "./size-form";
import { createSize } from "@/features/sizes/actions/sizes.actions";
import { CreateSizeInput } from "@/features/sizes/schema/size.schemas";

interface CreateSizeDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateSizeDialog({ open, onClose }: CreateSizeDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CreateSizeInput) => {
    try {
      setIsLoading(true);
      const result = await createSize(data);

      if (result.success) {
        toast.success(result.message);
        onClose();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error creating size:", error);
      toast.error("Failed to create size. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => !isLoading && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Size</DialogTitle>
          <DialogDescription>
            Add a new size to your catalog. Fill in the size value, name, and
            sort order.
          </DialogDescription>
        </DialogHeader>

        <SizeForm
          mode="create"
          onSubmit={handleSubmit}
          onCancel={() => !isLoading && onClose()}
        />
      </DialogContent>
    </Dialog>
  );
}
