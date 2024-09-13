import React, { PropsWithChildren } from 'react';

import QueryClientProvider from './QueryClientProvider';
import { ExampleStoreProvider } from './example_store';
import { AuthProvider } from './authContext';

const ContextsProviders: React.FC<PropsWithChildren> = ({ children }) => {
  const providers = [QueryClientProvider, ExampleStoreProvider, AuthProvider];

  return providers.reduceRight((acc, Provider) => {
    return <Provider>{acc}</Provider>;
  }, children);
};

export default ContextsProviders;
