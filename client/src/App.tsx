import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { useAuth } from './contexts/authContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Viewer from './pages/Viewer';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
        <Route path="/viewer" element={isAuthenticated ? <Viewer /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/viewer" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
