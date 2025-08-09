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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CreateCouponInput,
  UpdateCouponInput,
  createCouponSchema,
  updateCouponSchema,
  COUPON_TYPES,
} from "../schema/coupon.schemas";
import { createCoupon, updateCoupon } from "../actions/coupons.actions";
import { CouponType } from "./column";

interface CouponFormEditProps {
  coupon?: CouponType;
  mode: "create" | "edit";
}

export const CouponFormEdit = ({ coupon, mode }: CouponFormEditProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = mode === "edit" && coupon;

  const form = useForm<CreateCouponInput | UpdateCouponInput>({
    resolver: zodResolver(isEditMode ? updateCouponSchema : createCouponSchema),
    defaultValues: isEditMode
      ? {
          id: coupon.id,
          code: coupon.code,
          type: coupon.type,
          value: Number(coupon.value),
          description: coupon.description || "",
          usage_limit: coupon.usage_limit,
          usage_limit_per_user: coupon.usage_limit_per_user,
          is_active: coupon.is_active,
          starts_at: coupon.starts_at ? new Date(coupon.starts_at) : null,
          expires_at: coupon.expires_at ? new Date(coupon.expires_at) : null,
          minimum_amount: coupon.minimum_amount
            ? Number(coupon.minimum_amount)
            : null,
          maximum_amount: coupon.maximum_amount
            ? Number(coupon.maximum_amount)
            : null,
        }
      : {
          code: "",
          type: "PERCENTAGE",
          value: 0,
          description: "",
          usage_limit: null,
          usage_limit_per_user: null,
          is_active: true,
          starts_at: null,
          expires_at: null,
          minimum_amount: null,
          maximum_amount: null,
        },
  });

  const selectedType = form.watch("type");

  const onSubmit = async (data: CreateCouponInput | UpdateCouponInput) => {
    try {
      setIsLoading(true);

      const result = isEditMode
        ? await updateCoupon(data as UpdateCouponInput)
        : await createCoupon(data as CreateCouponInput);

      if (result.success) {
        toast.success(
          isEditMode
            ? "Coupon updated successfully"
            : "Coupon created successfully"
        );
        router.push("/admin/coupons");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to save coupon");
      }
    } catch (error) {
      console.error("Error saving coupon:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const onCancel = () => {
    router.back();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {isEditMode ? "Edit Coupon" : "Create New Coupon"}
        </h1>
        <p className="text-muted-foreground">
          {isEditMode
            ? "Update the coupon details below"
            : "Fill in the details to create a new discount coupon"}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Coupon Code *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="SAVE10"
                            className="font-mono"
                            onChange={(e) =>
                              field.onChange(e.target.value.toUpperCase())
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Use uppercase letters, numbers, underscores, and
                          hyphens only
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Coupon Type *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {COUPON_TYPES.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {selectedType === "PERCENTAGE"
                              ? "Percentage (%)"
                              : selectedType === "FIXED_AMOUNT"
                              ? "Amount ($)"
                              : "Value"}
                            *
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              step="0.01"
                              min="0"
                              max={
                                selectedType === "PERCENTAGE"
                                  ? "100"
                                  : undefined
                              }
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          {selectedType === "FREE_SHIPPING" && (
                            <FormDescription>
                              Value is not used for free shipping coupons
                            </FormDescription>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Describe what this coupon is for..."
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Usage Limits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="usage_limit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Usage Limit</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="1"
                              placeholder="Unlimited"
                              value={field.value || ""}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? parseInt(e.target.value)
                                    : null
                                )
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Leave empty for unlimited usage
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="usage_limit_per_user"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Per User Limit</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="1"
                              placeholder="Unlimited"
                              value={field.value || ""}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? parseInt(e.target.value)
                                    : null
                                )
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Maximum uses per customer
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Order Conditions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="minimum_amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Order Amount</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="No minimum"
                              value={field.value || ""}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? parseFloat(e.target.value)
                                    : null
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maximum_amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Order Amount</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="No maximum"
                              value={field.value || ""}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? parseFloat(e.target.value)
                                    : null
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Status & Validity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Active</FormLabel>
                          <FormDescription>
                            Whether this coupon is currently active
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="starts_at"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="datetime-local"
                            value={
                              field.value
                                ? new Date(field.value)
                                    .toISOString()
                                    .slice(0, 16)
                                : ""
                            }
                            onChange={(e) =>
                              field.onChange(
                                e.target.value ? new Date(e.target.value) : null
                              )
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          When the coupon becomes valid
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="expires_at"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="datetime-local"
                            value={
                              field.value
                                ? new Date(field.value)
                                    .toISOString()
                                    .slice(0, 16)
                                : ""
                            }
                            onChange={(e) =>
                              field.onChange(
                                e.target.value ? new Date(e.target.value) : null
                              )
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          When the coupon expires
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {isEditMode && (
                <Card>
                  <CardHeader>
                    <CardTitle>Usage Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Used:
                        </span>
                        <span className="font-medium">
                          {coupon.used_count} times
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Orders:
                        </span>
                        <span className="font-medium">
                          {coupon._count.orders}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-4 pt-6 border-t">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              {isEditMode ? "Update Coupon" : "Create Coupon"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
