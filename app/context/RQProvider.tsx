import * as React from "react";
import { QueryClientProvider, QueryClient, Hydrate } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { useDehydratedState } from "use-dehydrated-state";

function RQProviders({ children }: React.PropsWithChildren) {
  const [client] = React.useState(
    new QueryClient({
      defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } }
    })
  );
  const dehydratedState = useDehydratedState();

  return (
    <QueryClientProvider client={client}>
      <Hydrate state={dehydratedState}>
        {children}
        <ReactQueryDevtools />
      </Hydrate>
    </QueryClientProvider>
  );
}

export default RQProviders;
