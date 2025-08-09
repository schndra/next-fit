"use client";

import { useQuery } from "@tanstack/react-query";
import { getRelatedProducts } from "../actions/store.actions";

export function useRelatedProducts(
  productId: string,
  categoryId: string,
  limit: number = 4
) {
  return useQuery({
    queryKey: ["related-products", productId, categoryId, limit],
    queryFn: () => getRelatedProducts(productId, categoryId, limit),
    enabled: !!productId && !!categoryId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
