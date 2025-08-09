// Components
export { CheckoutSteps } from "./components/checkout-steps";
export { CheckoutSummary } from "./components/checkout-summary";
export { ShippingAddressSelector } from "./components/shipping-address-selector";

// Hooks
export {
  useUserAddresses,
  useSaveAddress,
  useUpdateAddress,
  useDeleteAddress,
  useCheckoutSummary,
  useCreateOrder,
} from "./hooks/use-checkout";

// Actions
export {
  getUserAddresses,
  saveAddress,
  updateAddress,
  deleteAddress,
  calculateCheckoutSummary,
  createOrder,
} from "./actions/checkout.actions";

// Types
export type {
  CheckoutStep,
  ShippingAddress,
  BillingAddress,
  CheckoutData,
  CheckoutSummary as CheckoutSummaryType,
  OrderCreateData,
  CreatedOrder,
} from "./types";

// Schema
export {
  shippingAddressSchema,
  billingAddressSchema,
  checkoutDataSchema,
  orderCreateSchema,
  type ShippingAddressData,
  type BillingAddressData,
  type CheckoutFormData,
} from "./schema";

// Utils
export {
  CHECKOUT_STEPS,
  updateCheckoutSteps,
  getNextCheckoutStep,
  getPreviousCheckoutStep,
  canProceedToStep,
  formatAddressDisplay,
  formatAddressOneLine,
  validateCheckoutCompletion,
} from "./utils";
