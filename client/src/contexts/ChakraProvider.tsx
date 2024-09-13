import { ChakraProvider as _ChakraProvider, extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({ config });

function ChakraProvider({ children }: { children: React.ReactNode }) {
  return <_ChakraProvider theme={theme}>{children}</_ChakraProvider>;
}

export default ChakraProvider;
