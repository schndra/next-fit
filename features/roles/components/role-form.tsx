"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// import {
//   createRoleSchema,
//   updateRoleSchema,
//   CreateRoleInput,
//   UpdateRoleInput,
// } from "@/lib/validators";
import { RoleType } from "./column";
import { Loader2 } from "lucide-react";
import {
  CreateRoleInput,
  createRoleSchema,
  UpdateRoleInput,
  updateRoleSchema,
} from "@/features/roles/schema/role.schemas";

interface RoleFormProps {
  mode: "create" | "edit";
  initialData?: RoleType;
  onSubmit: (data: any) => Promise<void>; // Use any to handle both create and update types
  onCancel: () => void;
  isLoading?: boolean;
}

export function RoleForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: RoleFormProps) {
  const isEditMode = mode === "edit";
  const schema = isEditMode ? updateRoleSchema : createRoleSchema;

  const form = useForm<CreateRoleInput | UpdateRoleInput>({
    resolver: zodResolver(schema),
    defaultValues:
      isEditMode && initialData
        ? {
            id: initialData.id,
            name: initialData.name,
            description: initialData.description || "",
          }
        : {
            name: "",
            description: "",
          },
  });

  const handleSubmit = async (data: CreateRoleInput | UpdateRoleInput) => {
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role Name *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter role name (e.g., Admin, Editor, User)"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                The name must be unique and can contain letters, numbers,
                spaces, hyphens, and underscores.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the role and its responsibilities (optional)"
                  rows={3}
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                Optional description to help identify the role's purpose and
                permissions.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3 justify-end pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? "Update Role" : "Create Role"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
