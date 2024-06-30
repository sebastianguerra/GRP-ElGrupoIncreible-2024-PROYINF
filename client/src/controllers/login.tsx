/* eslint-disable @typescript-eslint/no-misused-promises */
import { useAuth } from '@models/authContext/authContext';
const Viewer = () => {
  const { login, register } = useAuth();

  return (
    <div>
      <button onClick={() => login('username', 'password')}>Login</button>
      <button onClick={() => register('username', 'password')}>Register</button>
    </div>
  );
};

export default Viewer;
