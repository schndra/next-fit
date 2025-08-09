"use client";

import { useQuery } from "@tanstack/react-query";
import { getStoreCategories } from "../actions/store.actions";

export function useStoreCategories() {
  return useQuery({
    queryKey: ["store-categories"],
    queryFn: getStoreCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
