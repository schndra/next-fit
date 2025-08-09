"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getUserAddresses,
  saveAddress,
  updateAddress,
  deleteAddress,
  calculateCheckoutSummary,
  createOrder,
} from "../actions/checkout.actions";
import type { ShippingAddress, OrderCreateData } from "../types";

// Hook to get user addresses
export function useUserAddresses(userId?: string) {
  return useQuery({
    queryKey: ["addresses", userId],
    queryFn: () => getUserAddresses(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook to save a new address
export function useSaveAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      addressData,
    }: {
      userId: string;
      addressData: Omit<ShippingAddress, "id">;
    }) => saveAddress(userId, addressData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["addresses", variables.userId],
      });
      toast.success("Address saved successfully!");
    },
    onError: (error) => {
      console.error("Error saving address:", error);
      toast.error("Failed to save address");
    },
  });
}

// Hook to update an existing address
export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      addressId,
      addressData,
    }: {
      userId: string;
      addressId: string;
      addressData: Omit<ShippingAddress, "id">;
    }) => updateAddress(userId, addressId, addressData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["addresses", variables.userId],
      });
      toast.success("Address updated successfully!");
    },
    onError: (error) => {
      console.error("Error updating address:", error);
      toast.error("Failed to update address");
    },
  });
}

// Hook to delete an address
export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      addressId,
    }: {
      userId: string;
      addressId: string;
    }) => deleteAddress(userId, addressId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["addresses", variables.userId],
      });
      toast.success("Address deleted successfully!");
    },
    onError: (error) => {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address");
    },
  });
}

// Hook to get checkout summary
export function useCheckoutSummary(userId?: string) {
  return useQuery({
    queryKey: ["checkout-summary", userId],
    queryFn: () => calculateCheckoutSummary(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Hook to create an order
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      orderData,
    }: {
      userId: string;
      orderData: OrderCreateData;
    }) => createOrder(userId, orderData),
    onSuccess: (order, variables) => {
      // Invalidate cart and checkout related queries
      queryClient.invalidateQueries({ queryKey: ["cart", variables.userId] });
      queryClient.invalidateQueries({
        queryKey: ["cart-summary", variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["checkout-summary", variables.userId],
      });

      toast.success(`Order ${order.order_number} created successfully!`);
    },
    onError: (error) => {
      console.error("Error creating order:", error);
      toast.error("Failed to create order");
    },
  });
}
