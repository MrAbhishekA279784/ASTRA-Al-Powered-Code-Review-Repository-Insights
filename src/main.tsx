import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AstraProvider } from './context/AstraContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AstraProvider>
      <App />
    </AstraProvider>
  </StrictMode>,
);
