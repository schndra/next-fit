"use client";

import { useQuery } from "@tanstack/react-query";
import { getFeaturedProducts } from "../actions/store.actions";

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ["featured-products"],
    queryFn: getFeaturedProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
