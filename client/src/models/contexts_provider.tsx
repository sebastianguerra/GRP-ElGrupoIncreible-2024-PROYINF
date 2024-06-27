import React, { PropsWithChildren } from 'react';

import { ExampleStoreProvider } from './example_store';

const ContextsProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const providers = [ExampleStoreProvider];

  return providers.reduce((acc, Provider) => {
    return <Provider>{acc}</Provider>;
  }, children);
};

export default ContextsProvider;
