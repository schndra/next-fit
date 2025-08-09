"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserOrders, getOrderById } from "../actions/order.actions";

// Hook to get user orders
export function useUserOrders(userId?: string) {
  return useQuery({
    queryKey: ["orders", userId],
    queryFn: () => getUserOrders(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook to get a single order by ID
export function useOrder(orderId?: string) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId!),
    enabled: !!orderId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
