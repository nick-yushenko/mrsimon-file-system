import Stack from "@mui/material/Stack";
import CssBaseline from "@mui/material/CssBaseline";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { FileManager } from "@/widgets/fm";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5_000,
      gcTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CssBaseline enableColorScheme />
      <Stack component="main" sx={{ mx: "auto", my: 3, maxWidth: 1200, width: "90%" }}>
        <FileManager />
      </Stack>
    </QueryClientProvider>
  );
}

export default App;
