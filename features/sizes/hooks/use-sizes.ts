"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllSizes } from "../actions/sizes.actions";

export function useSizes() {
  return useQuery({
    queryKey: ["sizes"],
    queryFn: getAllSizes,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
