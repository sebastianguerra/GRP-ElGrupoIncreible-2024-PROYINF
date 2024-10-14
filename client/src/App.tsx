import { Center, Progress, Text, VStack } from '@chakra-ui/react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { useAuth } from './contexts/authContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Viewer from './pages/Viewer';

function App() {
  const { isAuthenticated, loadingUser } = useAuth();

  if (loadingUser) {
    return (
      <Center h="100vh">
        <VStack>
          <Text fontWeight="semibold" fontSize={20}>
            Cargando...
          </Text>
          <Progress size="xs" isIndeterminate w="100%" />
        </VStack>
      </Center>
    );
  }

  const routes = [
    { path: '/login', element: <Login />, allow: !isAuthenticated, redirect: '/' },
    { path: '/register', element: <Register />, allow: !isAuthenticated, redirect: '/' },
    { path: '/viewer', element: <Viewer />, allow: isAuthenticated, redirect: '/login' },
    { path: '*', element: <></>, allow: false, redirect: '/viewer' },
  ];

  return (
    <BrowserRouter>
      <Routes>
        {routes.map(({ path, element, allow, redirect }) => (
          <Route key={path} path={path} element={allow ? element : <Navigate to={redirect} />} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
