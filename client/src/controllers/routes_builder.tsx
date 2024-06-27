import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Viewer from './viewer';
import Login from './login';

const RouterBuilder = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/viewer" element={<Viewer />} />
        <Route path="/" element={<Navigate to="/viewer" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouterBuilder;
