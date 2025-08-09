"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "../actions/categories.actions";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
