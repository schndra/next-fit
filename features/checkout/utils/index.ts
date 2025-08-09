import type { CheckoutStep } from "../types";

// Define checkout steps
export const CHECKOUT_STEPS: CheckoutStep[] = [
  {
    id: "login",
    title: "Login",
    description: "Sign in to your account",
    isComplete: false,
    isActive: false,
  },
  {
    id: "shipping",
    title: "Shipping Address",
    description: "Enter your delivery address",
    isComplete: false,
    isActive: false,
  },
  {
    id: "payment",
    title: "Payment Method",
    description: "Choose your payment method",
    isComplete: false,
    isActive: false,
  },
  {
    id: "review",
    title: "Review Order",
    description: "Review and place your order",
    isComplete: false,
    isActive: false,
  },
];

// Update checkout steps based on current step and completion status
export function updateCheckoutSteps(
  currentStepId: string,
  completedSteps: string[] = []
): CheckoutStep[] {
  return CHECKOUT_STEPS.map((step) => ({
    ...step,
    isComplete: completedSteps.includes(step.id),
    isActive: step.id === currentStepId,
  }));
}

// Get next step in checkout process
export function getNextCheckoutStep(currentStepId: string): string | null {
  const currentIndex = CHECKOUT_STEPS.findIndex(
    (step) => step.id === currentStepId
  );
  const nextStep = CHECKOUT_STEPS[currentIndex + 1];
  return nextStep ? nextStep.id : null;
}

// Get previous step in checkout process
export function getPreviousCheckoutStep(currentStepId: string): string | null {
  const currentIndex = CHECKOUT_STEPS.findIndex(
    (step) => step.id === currentStepId
  );
  const previousStep = CHECKOUT_STEPS[currentIndex - 1];
  return previousStep ? previousStep.id : null;
}

// Check if user can proceed to a specific step
export function canProceedToStep(
  targetStepId: string,
  completedSteps: string[]
): boolean {
  const targetIndex = CHECKOUT_STEPS.findIndex(
    (step) => step.id === targetStepId
  );

  if (targetIndex === -1) return false;

  // User can always go to the first step
  if (targetIndex === 0) return true;

  // Check if all previous steps are completed
  for (let i = 0; i < targetIndex; i++) {
    if (!completedSteps.includes(CHECKOUT_STEPS[i].id)) {
      return false;
    }
  }

  return true;
}

// Format address for display
export function formatAddressDisplay(address: {
  first_name: string;
  last_name: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}): string {
  const lines = [];

  lines.push(`${address.first_name} ${address.last_name}`);

  if (address.company) {
    lines.push(address.company);
  }

  lines.push(address.address1);

  if (address.address2) {
    lines.push(address.address2);
  }

  lines.push(`${address.city}, ${address.state} ${address.postal_code}`);
  lines.push(address.country);

  return lines.join("\n");
}

// Format address for single line display
export function formatAddressOneLine(address: {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postal_code: string;
}): string {
  const parts = [address.address1];

  if (address.address2) {
    parts.push(address.address2);
  }

  parts.push(`${address.city}, ${address.state} ${address.postal_code}`);

  return parts.join(", ");
}

// Validate if checkout data is complete for order creation
export function validateCheckoutCompletion(checkoutData: {
  shipping_address?: any;
  payment_method?: string;
}): { isValid: boolean; missingFields: string[] } {
  const missingFields: string[] = [];

  if (!checkoutData.shipping_address) {
    missingFields.push("shipping_address");
  }

  if (!checkoutData.payment_method) {
    missingFields.push("payment_method");
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}
