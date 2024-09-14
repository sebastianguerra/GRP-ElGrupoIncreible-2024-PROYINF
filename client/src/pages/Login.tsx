import { Button, Center, Link as ChakraLink, Input, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { Result } from 'ts-results';

import { useAuth } from '@/contexts/authContext';

function Login() {
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (
    fn: (username: string, password: string) => Promise<Result<string, string>>,
  ) => {
    const res = await fn(username, password);
    setError(res.ok ? null : res.val);
  };

  return (
    <Center w="full" h="100vh" bgColor="gray.100">
      <VStack bgColor="white" p={5} borderRadius={10} spacing={10}>
        <Text fontSize="2xl">Iniciar sesión</Text>
        <form>
          <VStack spacing={3}>
            <Input
              size="lg"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <Input
              size="lg"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </VStack>
        </form>
        <Button onClick={() => void onSubmit(login)}>Entrar</Button>
        {error && <Text color="red">{error}</Text>}
        <ChakraLink as={ReactRouterLink} to="/register">
          No tengo una cuenta
        </ChakraLink>
      </VStack>
    </Center>
  );
}

export default Login;
