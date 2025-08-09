"use client";

import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../actions/store.actions";
import { ProductFilters } from "../types";

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
