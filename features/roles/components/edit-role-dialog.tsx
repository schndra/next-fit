"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RoleForm } from "./role-form";
import { updateRole } from "../actions/roles.actions";
import { UpdateRoleInput } from "@/features/roles/schema/role.schemas";
import { RoleType } from "./column";

interface EditRoleDialogProps {
  role: RoleType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditRoleDialog({
  role,
  open,
  onOpenChange,
}: EditRoleDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (data: UpdateRoleInput) => {
    setIsLoading(true);
    try {
      const result = await updateRole(data);

      if (result.success) {
        toast.success(result.message);
        onOpenChange(false);
        // Invalidate and refetch roles
        queryClient.invalidateQueries({ queryKey: ["roles"] });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Error updating role:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
          <DialogDescription>
            Update the role details. Changes will be applied immediately.
          </DialogDescription>
        </DialogHeader>
        <RoleForm
          mode="edit"
          initialData={role}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
