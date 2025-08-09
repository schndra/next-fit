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
import { updateSize } from "@/features/sizes/actions/sizes.actions";
import { UpdateSizeInput } from "@/features/sizes/schema/size.schemas";
import { SizeType } from "./column";

interface EditSizeDialogProps {
  size: SizeType;
  open: boolean;
  onClose: () => void;
}

export function EditSizeDialog({ size, open, onClose }: EditSizeDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: UpdateSizeInput) => {
    try {
      setIsLoading(true);
      const result = await updateSize(data);

      if (result.success) {
        toast.success(result.message);
        onClose();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error updating size:", error);
      toast.error("Failed to update size. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => !isLoading && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Size</DialogTitle>
          <DialogDescription>
            Update the size information. Modify the size value, name, or sort
            order as needed.
          </DialogDescription>
        </DialogHeader>

        <SizeForm
          mode="edit"
          initialData={size}
          onSubmit={handleSubmit}
          onCancel={() => !isLoading && onClose()}
        />
      </DialogContent>
    </Dialog>
  );
}
