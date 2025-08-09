"use client";

import { useQuery } from "@tanstack/react-query";
import { getProductBySlug } from "../actions/store.actions";

export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
