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
import { SizeType } from "./column";
import { Loader2 } from "lucide-react";
import {
  CreateSizeInput,
  createSizeSchema,
  UpdateSizeInput,
  updateSizeSchema,
} from "@/features/sizes/schema/size.schemas";

interface CreateSizeFormProps {
  mode: "create";
  initialData?: never;
  onSubmit: (data: CreateSizeInput) => Promise<void>;
  onCancel: () => void;
}

interface EditSizeFormProps {
  mode: "edit";
  initialData: SizeType;
  onSubmit: (data: UpdateSizeInput) => Promise<void>;
  onCancel: () => void;
}

type SizeFormProps = CreateSizeFormProps | EditSizeFormProps;

export function SizeForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
}: SizeFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (mode === "create") {
    const form = useForm({
      resolver: zodResolver(createSizeSchema),
      defaultValues: {
        value: "",
        name: "",
        sort_order: 0,
      },
    });

    const handleSubmit = async (data: CreateSizeInput) => {
      try {
        setIsLoading(true);
        await onSubmit(data);
      } catch (error) {
        console.error("Form submission error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size Value *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., XS, S, M, L, XL"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    The size value (e.g., XS, S, M, L, XL, 28, 30, 32)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Extra Small, Small, Medium"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    The descriptive name for this size
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="sort_order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sort Order</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    value={field.value || 0}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  Order in which sizes appear (lower numbers appear first)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-3 pt-6">
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
              Create Size
            </Button>
          </div>
        </form>
      </Form>
    );
  }

  // Edit mode
  const form = useForm({
    resolver: zodResolver(updateSizeSchema),
    defaultValues: {
      id: initialData.id,
      value: initialData.value,
      name: initialData.name,
      sort_order: initialData.sort_order || 0,
    },
  });

  const handleSubmit = async (data: UpdateSizeInput) => {
    try {
      setIsLoading(true);
      await onSubmit(data);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Size Value *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., XS, S, M, L, XL"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  The size value (e.g., XS, S, M, L, XL, 28, 30, 32)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Size Name *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Extra Small, Small, Medium"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  The descriptive name for this size
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="sort_order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sort Order</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  value={field.value || 0}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 0)
                  }
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                Order in which sizes appear (lower numbers appear first)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-6">
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
            Update Size
          </Button>
        </div>
      </form>
    </Form>
  );
}
