"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllColors } from "../actions/colors.actions";

export function useColors() {
  return useQuery({
    queryKey: ["colors"],
    queryFn: getAllColors,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
