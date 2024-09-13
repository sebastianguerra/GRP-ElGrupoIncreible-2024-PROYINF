import { Button, ButtonGroup, Center, Input, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';

import { useAuth } from '@/contexts/authContext';

function Viewer() {
  const { login, register } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    const res = await login(username, password);
    setError(res.ok ? null : res.val);
  };
  const handleRegister = async () => {
    const res = await register(username, password);
    setError(res.ok ? null : res.val);
  };

  return (
    <Center w="full" h="100vh" bgColor="gray.100">
      <VStack bgColor="white" p={5} borderRadius={10} spacing={10}>
        <Text>Visor DICOM</Text>
        <form>
          <VStack spacing={3}>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </VStack>
        </form>
        <ButtonGroup>
          <Button onClick={() => void handleLogin()}>Entrar</Button>
          <Button onClick={() => void handleRegister()}>Crear cuenta</Button>
        </ButtonGroup>
        {error && <Text color="red">{error}</Text>}
      </VStack>
    </Center>
  );
}

export default Viewer;
