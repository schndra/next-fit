"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  Circle,
  User,
  MapPin,
  CreditCard,
  ShoppingBag,
  ArrowLeft,
  Check,
} from "lucide-react";
import { ShippingAddressForm } from "./shipping-address-form";
import { PaymentMethodForm } from "./payment-method-form";
import { OrderReview } from "./order-review";
import { useCartItems } from "@/features/store/hooks/use-cart";
import { placeOrder } from "../actions/order.actions";
import { toast } from "sonner";
import { type ShippingAddressData, type PaymentMethodData } from "../schema";
import { type ShippingAddress } from "../types";
import { formatCurrency } from "@/lib/utils";

const STEPS = [
  { id: 1, title: "Login", icon: User, description: "Sign in to your account" },
  {
    id: 2,
    title: "Shipping",
    icon: MapPin,
    description: "Enter shipping address",
  },
  {
    id: 3,
    title: "Payment",
    icon: CreditCard,
    description: "Choose payment method",
  },
  {
    id: 4,
    title: "Review",
    icon: ShoppingBag,
    description: "Review and place order",
  },
];

export function CheckoutFlow() {
  const router = useRouter();
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState(session ? 2 : 1);
  const [shippingAddress, setShippingAddress] =
    useState<ShippingAddress | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodData | null>(
    null
  );
  const [shippingMethod, setShippingMethod] = useState<
    "standard" | "express" | "overnight"
  >("standard");

  const { data: cartItems = [], isLoading: isCartLoading } = useCartItems(
    session?.user?.id
  );

  // If no cart items, redirect to store
  if (!isCartLoading && cartItems.length === 0) {
    router.push("/");
    return null;
  }

  // If not logged in, show login prompt
  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Please sign in to continue with checkout
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => router.push("/sign-in?callbackUrl=/checkout")}
              className="w-full"
            >
              Sign In
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/sign-up?callbackUrl=/checkout")}
              className="w-full"
            >
              Create Account
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleShippingNext = (data: ShippingAddress) => {
    setShippingAddress(data);
    setCurrentStep(3);
  };

  const handlePaymentNext = (data: PaymentMethodData) => {
    setPaymentMethod(data);
    setCurrentStep(4);
  };

  const handlePlaceOrder = async (notes?: string) => {
    if (
      !shippingAddress ||
      !paymentMethod ||
      !session?.user?.id ||
      !shippingAddress.id
    ) {
      toast.error("Missing required information");
      return;
    }

    try {
      const result = await placeOrder(session.user.id, {
        shipping_address_id: shippingAddress.id,
        payment_method: paymentMethod,
        shipping_method: shippingMethod,
        notes,
      });

      if (result.success && result.orderId) {
        toast.success("Order placed successfully!");
        router.push(`/orders/${result.orderId}`);
      } else {
        toast.error(result.error || "Failed to place order");
      }
    } catch (error) {
      console.error("Order placement error:", error);
      toast.error("Failed to place order");
    }
  };

  const getStepProgress = () => {
    return ((currentStep - 1) / (STEPS.length - 1)) * 100;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-muted-foreground">
            Complete your order in a few simple steps
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <Progress value={getStepProgress()} className="mb-6" />
            <div className="flex justify-between">
              {STEPS.map((step) => {
                const isCompleted = step.id < currentStep;
                const isCurrent = step.id === currentStep;
                const IconComponent = step.icon;

                return (
                  <div
                    key={step.id}
                    className="flex flex-col items-center text-center"
                  >
                    <div
                      className={`
                      w-12 h-12 rounded-full flex items-center justify-center mb-2 
                      ${
                        isCompleted
                          ? "bg-primary text-primary-foreground"
                          : isCurrent
                          ? "bg-primary/10 text-primary border-2 border-primary"
                          : "bg-muted text-muted-foreground"
                      }
                    `}
                    >
                      {isCompleted ? (
                        <Check className="h-6 w-6" />
                      ) : (
                        <IconComponent className="h-6 w-6" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div
                        className={`font-medium text-sm ${
                          isCompleted || isCurrent
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {step.title}
                      </div>
                      <div className="text-xs text-muted-foreground hidden sm:block">
                        {step.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {currentStep === 2 && (
              <ShippingAddressForm
                selectedAddress={shippingAddress || undefined}
                onAddressSelect={setShippingAddress}
                onNext={handleShippingNext}
                defaultValues={shippingAddress || undefined}
              />
            )}

            {currentStep === 3 && (
              <PaymentMethodForm
                onNext={handlePaymentNext}
                onBack={() => setCurrentStep(2)}
                defaultValues={paymentMethod || undefined}
              />
            )}

            {currentStep === 4 && shippingAddress && paymentMethod && (
              <OrderReview
                cartItems={cartItems}
                shippingAddress={shippingAddress}
                paymentMethod={paymentMethod}
                shippingMethod={shippingMethod}
                onPlaceOrder={handlePlaceOrder}
                onBack={() => setCurrentStep(3)}
              />
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {cartItems.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-muted rounded-md flex-shrink-0">
                        {item.product.images?.[0] ? (
                          <img
                            src={item.product.images[0].url}
                            alt={item.product.title}
                            className="w-full h-full object-cover rounded-md"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted rounded-md" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {item.product.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        $
                        {(Number(item.product.price) * item.quantity).toFixed(
                          2
                        )}
                      </div>
                    </div>
                  ))}
                  {cartItems.length > 3 && (
                    <div className="text-sm text-muted-foreground text-center">
                      +{cartItems.length - 3} more items
                    </div>
                  )}
                </div>

                <Separator />

                {/* Order Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>
                      $
                      {cartItems
                        .reduce(
                          (sum, item) =>
                            sum + Number(item.product.price) * item.quantity,
                          0
                        )
                        .toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{formatCurrency(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>
                      $
                      {(
                        cartItems.reduce(
                          (sum, item) =>
                            sum + Number(item.product.price) * item.quantity,
                          0
                        ) * 0.08
                      ).toFixed(2)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>
                      $
                      {(
                        cartItems.reduce(
                          (sum, item) =>
                            sum + Number(item.product.price) * item.quantity,
                          0
                        ) * 1.08
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
