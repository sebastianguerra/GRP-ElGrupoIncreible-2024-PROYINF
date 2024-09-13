import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { useAuth } from '../contexts/authContext';

import Viewer from './viewer';
import Login from './login';

function RouterBuilder() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
        <Route path="/viewer" element={isAuthenticated ? <Viewer /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/viewer" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default RouterBuilder;
