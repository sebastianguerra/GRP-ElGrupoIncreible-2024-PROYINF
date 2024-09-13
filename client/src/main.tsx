import React from 'react';
import ReactDOM from 'react-dom/client';

import './reset.css';
import App from './App';
import Providers from './contexts/ContextProviders';

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Providers>
        <App />
      </Providers>
    </React.StrictMode>,
  );
}
