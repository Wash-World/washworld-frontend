import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      //   staleTime: 1000 * 60 * 5, // 5 minutes
      staleTime: Infinity, // This data is always fresh — don't ever refetch it automatically.
    },
    mutations: {
      // e.g. retry: 1
    },
  },
});
