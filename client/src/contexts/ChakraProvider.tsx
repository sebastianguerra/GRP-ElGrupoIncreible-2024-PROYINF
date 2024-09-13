import { ChakraProvider as _ChakraProvider } from '@chakra-ui/react';

function ChakraProvider({ children }: { children: React.ReactNode }) {
  return <_ChakraProvider>{children}</_ChakraProvider>;
}

export default ChakraProvider;
