"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { ArrowLeft, User, MapPin, CreditCard, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

import { CheckoutSteps } from "@/features/checkout/components/checkout-steps";
import { CheckoutSummary } from "@/features/checkout/components/checkout-summary";
import { ShippingAddressSelector } from "@/features/checkout/components/shipping-address-selector";
import {
  updateCheckoutSteps,
  canProceedToStep,
} from "@/features/checkout/utils";
import type { ShippingAddress } from "@/features/checkout/types";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [currentStep, setCurrentStep] = useState("login");
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [checkoutData, setCheckoutData] = useState<{
    shipping_address?: ShippingAddress;
    payment_method?: string;
  }>({});

  // Update steps based on authentication status
  useEffect(() => {
    if (status === "loading") return;

    if (session?.user) {
      // User is logged in, mark login as complete and move to shipping
      setCompletedSteps((prev) => {
        const updated = [...prev];
        if (!updated.includes("login")) {
          updated.push("login");
        }
        return updated;
      });

      if (currentStep === "login") {
        setCurrentStep("shipping");
      }
    } else {
      // User not logged in, stay on login step
      setCurrentStep("login");
      setCompletedSteps([]);
    }
  }, [session, status, currentStep]);

  const steps = updateCheckoutSteps(currentStep, completedSteps);

  const handleSignIn = () => {
    signIn(undefined, {
      callbackUrl: window.location.href,
      redirect: true,
    });
  };

  const handleAddressSelect = (address: ShippingAddress) => {
    setCheckoutData((prev) => ({
      ...prev,
      shipping_address: address,
    }));
  };

  const handleContinueToPayment = () => {
    if (!checkoutData.shipping_address?.id) return;

    // Mark shipping as complete
    setCompletedSteps((prev) => {
      const updated = [...prev];
      if (!updated.includes("shipping")) {
        updated.push("shipping");
      }
      return updated;
    });

    setCurrentStep("payment");
  };

  const handleStepClick = (stepId: string) => {
    if (canProceedToStep(stepId, completedSteps)) {
      setCurrentStep(stepId);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "login":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Sign In Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 space-y-4">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Please sign in to continue
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    You need to be signed in to proceed with checkout
                  </p>
                </div>
                <div className="space-y-3">
                  <Button onClick={handleSignIn} className="w-full">
                    Sign In to Continue
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link
                      href="/sign-up"
                      className="text-blue-600 hover:underline"
                    >
                      Sign up here
                    </Link>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "shipping":
        return (
          <ShippingAddressSelector
            selectedAddress={checkoutData.shipping_address}
            onAddressSelect={handleAddressSelect}
            onNext={handleContinueToPayment}
          />
        );

      case "payment":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 space-y-4">
                <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                  <CreditCard className="h-8 w-8 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Payment Coming Soon
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Payment integration will be implemented in the next phase
                  </p>
                </div>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep("shipping")}
                    className="w-full"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Shipping
                  </Button>
                  <Button className="w-full" disabled>
                    Continue to Review
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "review":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Review Order
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 space-y-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Order Review</h3>
                  <p className="text-muted-foreground mb-6">
                    Review and confirm your order details
                  </p>
                </div>
                <Button className="w-full">Place Order</Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/cart">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Cart
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Checkout</h1>
          </div>

          {/* Progress Steps */}
          <CheckoutSteps steps={steps} />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">{renderStepContent()}</div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <CheckoutSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
