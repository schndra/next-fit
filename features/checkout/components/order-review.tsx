"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  CreditCard,
  MapPin,
  Package,
  Truck,
  ShoppingCart,
  Clock,
  Check,
  Loader2,
} from "lucide-react";
import { type ShippingAddressData, type PaymentMethodData } from "../schema";
import { type ShippingAddress } from "../types";
import { type CartItem } from "@/features/store/actions/cart.actions";

interface OrderReviewProps {
  cartItems: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethodData;
  shippingMethod: "standard" | "express" | "overnight";
  onPlaceOrder: (notes?: string) => Promise<void>;
  onBack: () => void;
}

const SHIPPING_METHODS = {
  standard: { name: "Standard Shipping", price: 0, days: "5-7 business days" },
  express: { name: "Express Shipping", price: 15, days: "2-3 business days" },
  overnight: { name: "Overnight Shipping", price: 30, days: "1 business day" },
};

export function OrderReview({
  cartItems,
  shippingAddress,
  paymentMethod,
  shippingMethod,
  onPlaceOrder,
  onBack,
}: OrderReviewProps) {
  const [notes, setNotes] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shippingCost = SHIPPING_METHODS[shippingMethod].price;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shippingCost + tax;

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    try {
      await onPlaceOrder(notes || undefined);
    } catch (error) {
      console.error("Failed to place order:", error);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="h-5 w-5" />
            Review Your Order
          </CardTitle>
          <CardDescription>
            Please review your order details before placing your order
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Order Items */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-semibold">
              <ShoppingCart className="h-4 w-4" />
              Order Items ({cartItems.length})
            </h3>
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 border rounded-lg"
                >
                  <div className="w-16 h-16 bg-muted rounded-md flex-shrink-0">
                    {item.product.images?.[0] ? (
                      <img
                        src={item.product.images[0].url}
                        alt={item.product.title}
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted rounded-md flex items-center justify-center">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">
                      {item.product.title}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        SKU: {item.product.sku}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${item.product.price}</div>
                    <div className="text-sm text-muted-foreground">
                      Qty: {item.quantity}
                    </div>
                  </div>
                  <div className="font-semibold">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Shipping Address */}
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 font-semibold">
              <MapPin className="h-4 w-4" />
              Shipping Address
            </h3>
            <div className="p-3 border rounded-lg bg-muted/50">
              <div className="font-medium">
                {shippingAddress.first_name} {shippingAddress.last_name}
              </div>
              <div className="text-sm text-muted-foreground">
                {shippingAddress.address1}
                {shippingAddress.address2 && `, ${shippingAddress.address2}`}
              </div>
              <div className="text-sm text-muted-foreground">
                {shippingAddress.city}, {shippingAddress.state}{" "}
                {shippingAddress.postal_code}
              </div>
              <div className="text-sm text-muted-foreground">
                {shippingAddress.country}
              </div>
              {shippingAddress.phone && (
                <div className="text-sm text-muted-foreground">
                  Phone: {shippingAddress.phone}
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Payment Method */}
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 font-semibold">
              <CreditCard className="h-4 w-4" />
              Payment Method
            </h3>
            <div className="p-3 border rounded-lg bg-muted/50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium capitalize">
                    {paymentMethod.type} Card
                  </div>
                  <div className="text-sm text-muted-foreground">
                    **** **** **** {paymentMethod.card_number.slice(-4)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {paymentMethod.cardholder_name}
                  </div>
                </div>
                <Badge variant="secondary" className="capitalize">
                  {paymentMethod.type}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Shipping Method */}
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 font-semibold">
              <Truck className="h-4 w-4" />
              Shipping Method
            </h3>
            <div className="p-3 border rounded-lg bg-muted/50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">
                    {SHIPPING_METHODS[shippingMethod].name}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {SHIPPING_METHODS[shippingMethod].days}
                  </div>
                </div>
                <div className="font-semibold">${shippingCost.toFixed(2)}</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Notes */}
          <div className="space-y-3">
            <Label htmlFor="notes">Order Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any special instructions for your order..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <Separator />

          {/* Order Summary */}
          <div className="space-y-3">
            <h3 className="font-semibold">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1"
              disabled={isPlacingOrder}
            >
              Back
            </Button>
            <Button
              onClick={handlePlaceOrder}
              className="flex-1"
              disabled={isPlacingOrder}
            >
              {isPlacingOrder ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Placing Order...
                </>
              ) : (
                `Place Order - $${total.toFixed(2)}`
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
