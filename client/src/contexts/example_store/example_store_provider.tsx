import { PropsWithChildren, useState } from 'react';
import ExampleStoreContext from './example_store_context';

function ExampleStoreProvider({ children }: PropsWithChildren) {
  const [number, setNumber] = useState(0);

  const addOne = () => {
    setNumber((prev) => prev + 1);
  };

  return (
    <ExampleStoreContext.Provider value={{ number, addOne }}>
      {children}
    </ExampleStoreContext.Provider>
  );
}

export default ExampleStoreProvider;
