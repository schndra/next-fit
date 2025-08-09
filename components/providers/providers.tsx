"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./theme-provider";
import { getQueryClient } from "./react-query-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        {children}

        <ReactQueryDevtools />
      </QueryClientProvider>
    </ThemeProvider>
  );
};
export default Providers;
