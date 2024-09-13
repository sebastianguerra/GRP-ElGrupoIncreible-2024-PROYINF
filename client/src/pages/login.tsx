import { useState } from 'react';

import { useAuth } from '../contexts/authContext';

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
    <div>
      <h1>Visor DICOM</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <button onClick={() => void handleLogin()}>Login</button>
      <button onClick={() => void handleRegister()}>Register</button>
      {error && <p>{error}</p>}
    </div>
  );
}

export default Viewer;
