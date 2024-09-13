import React, { PropsWithChildren } from 'react';

import { AuthProvider } from './authContext';
import ChakraProvider from './ChakraProvider';
import QueryClientProvider from './QueryClientProvider';

const ContextProviders: React.FC<PropsWithChildren> = ({ children }) => {
  const providers = [ChakraProvider, QueryClientProvider, AuthProvider];

  return providers.reduceRight((acc, Provider) => {
    return <Provider>{acc}</Provider>;
  }, children);
};

export default ContextProviders;
