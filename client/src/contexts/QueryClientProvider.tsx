import { QueryClientProvider as _QueryClientProvider, QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient();

function QueryClientProvider({ children }: { children: React.ReactNode }) {
  return <_QueryClientProvider client={queryClient}>{children}</_QueryClientProvider>;
}

export default QueryClientProvider;
