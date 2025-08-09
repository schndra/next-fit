"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

export function SessionRefreshHandler() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const prevSessionRef = useRef(session);

  useEffect(() => {
    // Check if session state changed
    const prevSession = prevSessionRef.current;
    const sessionChanged =
      prevSession?.user?.id !== session?.user?.id ||
      !!prevSession !== !!session;

    if (sessionChanged && status !== "loading") {
      console.log("Session state changed, refreshing...", {
        prev: prevSession?.user?.id,
        current: session?.user?.id,
        status,
      });

      // Invalidate all queries to force refetch
      queryClient.invalidateQueries();

      // Force router refresh to update server components
      router.refresh();
    }

    // Update the ref for next comparison
    prevSessionRef.current = session;
  }, [session, status, router, queryClient]);

  return null;
}
