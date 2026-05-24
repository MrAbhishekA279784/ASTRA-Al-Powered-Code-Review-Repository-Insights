import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AstraProvider } from './context/AstraContext';
import { AuthProvider } from './providers/auth-provider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AstraProvider>
        <App />
      </AstraProvider>
    </AuthProvider>
  </StrictMode>,
);
