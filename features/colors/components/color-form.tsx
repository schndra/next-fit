"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Palette } from "lucide-react";
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
import {
  CreateColorInput,
  createColorSchema,
  UpdateColorInput,
  updateColorSchema,
} from "@/features/colors/schema/color.schemas";
import { ColorType } from "../actions/colors.actions";

interface CreateColorFormProps {
  onSubmit: (data: CreateColorInput) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

interface EditColorFormProps {
  initialData: ColorType;
  onSubmit: (data: UpdateColorInput) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function CreateColorForm({
  onSubmit,
  onCancel,
  isLoading = false,
}: CreateColorFormProps) {
  const [colorPreview, setColorPreview] = useState("#000000");

  const form = useForm<CreateColorInput>({
    resolver: zodResolver(createColorSchema),
    defaultValues: {
      value: "#000000",
      name: "",
      sort_order: 0,
    },
  });

  const handleColorChange = (value: string) => {
    setColorPreview(value);
    form.setValue("value", value);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color Value</FormLabel>
              <FormControl>
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-16 rounded-md border-2 border-gray-300 shadow-sm"
                    style={{ backgroundColor: colorPreview }}
                  />
                  <Input
                    placeholder="#FF0000"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleColorChange(e.target.value);
                    }}
                    className="font-mono"
                  />
                  <input
                    type="color"
                    value={colorPreview}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleColorChange(value);
                    }}
                    className="h-10 w-16 rounded-md border-2 border-gray-300 cursor-pointer"
                  />
                </div>
              </FormControl>
              <FormDescription>
                Enter a valid hex color code (e.g., #FF0000 or #F00)
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
              <FormLabel>Color Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Bright Red" {...field} />
              </FormControl>
              <FormDescription>
                A descriptive name for this color
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 0)
                  }
                />
              </FormControl>
              <FormDescription>
                Lower numbers appear first in lists
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Palette className="mr-2 h-4 w-4" />
            Create Color
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function EditColorForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: EditColorFormProps) {
  const [colorPreview, setColorPreview] = useState(initialData.value);

  const form = useForm<UpdateColorInput>({
    resolver: zodResolver(updateColorSchema),
    defaultValues: {
      id: initialData.id,
      value: initialData.value,
      name: initialData.name,
      sort_order: initialData.sort_order,
    },
  });

  const handleColorChange = (value: string) => {
    setColorPreview(value);
    form.setValue("value", value);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color Value</FormLabel>
              <FormControl>
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-16 rounded-md border-2 border-gray-300 shadow-sm"
                    style={{ backgroundColor: colorPreview }}
                  />
                  <Input
                    placeholder="#FF0000"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleColorChange(e.target.value);
                    }}
                    className="font-mono"
                  />
                  <input
                    type="color"
                    value={colorPreview}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleColorChange(value);
                    }}
                    className="h-10 w-16 rounded-md border-2 border-gray-300 cursor-pointer"
                  />
                </div>
              </FormControl>
              <FormDescription>
                Enter a valid hex color code (e.g., #FF0000 or #F00)
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
              <FormLabel>Color Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Bright Red" {...field} />
              </FormControl>
              <FormDescription>
                A descriptive name for this color
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 0)
                  }
                />
              </FormControl>
              <FormDescription>
                Lower numbers appear first in lists
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Palette className="mr-2 h-4 w-4" />
            Update Color
          </Button>
        </div>
      </form>
    </Form>
  );
}
