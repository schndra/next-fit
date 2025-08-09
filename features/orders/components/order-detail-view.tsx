"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  getOrderDetails,
  updateOrder,
} from "@/features/orders/actions/orders.actions";
import {
  OrderType,
  UpdateOrderInput,
  orderStatusEnum,
  paymentStatusEnum,
} from "@/features/orders/schema/order.schemas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  Truck,
  Edit,
  Save,
  RefreshCw,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import {
  formatCurrency,
  formatDate,
  getOrderStatusBadge,
  getPaymentStatusBadge,
  getCustomerName,
  formatAddress,
  getAddressName,
  calculateOrderTotals,
} from "@/features/orders/utils/order.utils";

interface OrderDetailViewProps {
  orderId: string;
}

export function OrderDetailView({ orderId }: OrderDetailViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateOrderInput>({});
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: order,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderDetails(orderId),
    enabled: !!orderId && orderId !== "new",
    staleTime: 30 * 1000, // 30 seconds
  });

  const updateOrderMutation = useMutation({
    mutationFn: updateOrder,
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        queryClient.invalidateQueries({ queryKey: ["order", orderId] });
        setIsEditing(false);
        setFormData({});
      } else {
        toast.error(result.message);
      }
    },
    onError: (error) => {
      console.error("Update order error:", error);
      toast.error("Failed to update order. Please try again.");
    },
  });

  const handleInputChange = (field: keyof UpdateOrderInput, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (!order) return;

    updateOrderMutation.mutate({
      id: order.id,
      data: formData,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({});
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          Loading order...
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center text-red-600">
          Order not found or error loading order.
        </div>
      </div>
    );
  }

  const statusBadge = getOrderStatusBadge(order.status);
  const paymentBadge = getPaymentStatusBadge(order.payment_status);
  const totals = calculateOrderTotals(order);

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Order #{order.order_number}</h1>
            <p className="text-muted-foreground">
              Placed on {formatDate(order.created_at)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Order
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={updateOrderMutation.isPending}
              >
                {updateOrderMutation.isPending ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Order Status</Label>
                  {isEditing ? (
                    <Select
                      value={formData.status || order.status}
                      onValueChange={(value) =>
                        handleInputChange("status", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {orderStatusEnum.options.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.charAt(0) + status.slice(1).toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="mt-1">
                      <Badge className={statusBadge.className}>
                        {statusBadge.label}
                      </Badge>
                    </div>
                  )}
                </div>

                <div>
                  <Label>Payment Status</Label>
                  {isEditing ? (
                    <Select
                      value={formData.payment_status || order.payment_status}
                      onValueChange={(value) =>
                        handleInputChange("payment_status", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentStatusEnum.options.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.charAt(0) +
                              status.slice(1).toLowerCase().replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="mt-1">
                      <Badge className={paymentBadge.className}>
                        {paymentBadge.label}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Tracking Number</Label>
                  {isEditing ? (
                    <Input
                      value={
                        formData.tracking_number || order.tracking_number || ""
                      }
                      onChange={(e) =>
                        handleInputChange("tracking_number", e.target.value)
                      }
                      placeholder="Enter tracking number"
                    />
                  ) : (
                    <div className="mt-1 text-sm">
                      {order.tracking_number || "Not provided"}
                    </div>
                  )}
                </div>

                <div>
                  <Label>Shipping Method</Label>
                  {isEditing ? (
                    <Input
                      value={
                        formData.shipping_method || order.shipping_method || ""
                      }
                      onChange={(e) =>
                        handleInputChange("shipping_method", e.target.value)
                      }
                      placeholder="Enter shipping method"
                    />
                  ) : (
                    <div className="mt-1 text-sm">
                      {order.shipping_method || "Not specified"}
                    </div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div>
                  <Label>Admin Notes</Label>
                  <Textarea
                    value={formData.admin_notes || order.admin_notes || ""}
                    onChange={(e) =>
                      handleInputChange("admin_notes", e.target.value)
                    }
                    placeholder="Add admin notes..."
                    rows={3}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    {item.product.images && item.product.images[0] && (
                      <img
                        src={item.product.images[0].url}
                        alt={item.product.images[0].alt || item.product.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product.title}</h4>
                      {item.product.sku && (
                        <p className="text-sm text-muted-foreground">
                          SKU: {item.product.sku}
                        </p>
                      )}
                      <p className="text-sm">
                        Quantity: {item.quantity} × {formatCurrency(item.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatCurrency(item.total)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Customer & Summary */}
        <div className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">{getCustomerName(order)}</h4>
                <p className="text-sm text-muted-foreground">
                  {order.user.email}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          {order.shipping_address && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  <p className="font-medium">
                    {getAddressName(order.shipping_address)}
                  </p>
                  {order.shipping_address.company && (
                    <p>{order.shipping_address.company}</p>
                  )}
                  <p>{order.shipping_address.address1}</p>
                  {order.shipping_address.address2 && (
                    <p>{order.shipping_address.address2}</p>
                  )}
                  <p>
                    {order.shipping_address.city},{" "}
                    {order.shipping_address.state}{" "}
                    {order.shipping_address.postal_code}
                  </p>
                  <p>{order.shipping_address.country}</p>
                  {order.shipping_address.phone && (
                    <p>Phone: {order.shipping_address.phone}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatCurrency(totals.subtotal)}</span>
              </div>
              {totals.discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(totals.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>{formatCurrency(totals.shippingAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>{formatCurrency(totals.taxAmount)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{formatCurrency(totals.finalTotal)}</span>
              </div>

              {order.payment_method && (
                <div className="pt-2 text-sm text-muted-foreground">
                  Payment Method: {order.payment_method}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
