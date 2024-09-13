import React, { PropsWithChildren } from 'react';

import QueryClientProvider from './QueryClientProvider';
import { AuthProvider } from './authContext';
import ChakraProvider from './ChakraProvider';

const ContextProviders: React.FC<PropsWithChildren> = ({ children }) => {
  const providers = [ChakraProvider, QueryClientProvider, AuthProvider];

  return providers.reduceRight((acc, Provider) => {
    return <Provider>{acc}</Provider>;
  }, children);
};

export default ContextProviders;
