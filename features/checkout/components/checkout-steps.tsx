"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CheckoutStep } from "../types";

interface CheckoutStepsProps {
  steps: CheckoutStep[];
}

export function CheckoutSteps({ steps }: CheckoutStepsProps) {
  return (
    <div className="w-full py-6">
      <nav aria-label="Checkout progress">
        <ol className="flex items-center justify-center space-x-8">
          {steps.map((step, stepIdx) => (
            <li key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2",
                    step.isComplete
                      ? "border-green-500 bg-green-500 text-white"
                      : step.isActive
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-gray-300 bg-white text-gray-500"
                  )}
                >
                  {step.isComplete ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{stepIdx + 1}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <div
                    className={cn(
                      "text-sm font-medium",
                      step.isActive || step.isComplete
                        ? "text-gray-900"
                        : "text-gray-500"
                    )}
                  >
                    {step.title}
                  </div>
                  {step.description && (
                    <div className="text-xs text-gray-500 mt-1">
                      {step.description}
                    </div>
                  )}
                </div>
              </div>

              {stepIdx < steps.length - 1 && (
                <div
                  className={cn(
                    "ml-8 h-0.5 w-16",
                    step.isComplete ? "bg-green-500" : "bg-gray-300"
                  )}
                />
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
