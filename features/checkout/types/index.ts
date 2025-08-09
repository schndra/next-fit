export interface CheckoutStep {
  id: string;
  title: string;
  description?: string;
  isComplete: boolean;
  isActive: boolean;
}

export interface ShippingAddress {
  id?: string;
  first_name: string;
  last_name: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
  is_default?: boolean;
}

export interface ShippingAddressData {
  first_name: string;
  last_name: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
  is_default?: boolean;
}

export interface BillingAddress extends ShippingAddress {
  same_as_shipping?: boolean;
}

export interface CheckoutData {
  shipping_address?: ShippingAddress;
  billing_address?: BillingAddress;
  shipping_method?: string;
  payment_method?: string;
  notes?: string;
}

export interface CheckoutSummary {
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  total: number;
  items_count: number;
}

export interface OrderCreateData {
  shipping_address_id?: string;
  billing_address_id?: string;
  shipping_method?: string;
  payment_method?: string;
  notes?: string;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  total: number;
}

export interface CreatedOrder {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  total: number;
  created_at: Date;
}
