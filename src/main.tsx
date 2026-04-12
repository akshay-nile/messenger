import { PrimeReactProvider } from 'primereact/api';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

import './index.css';
import ToastContextProvider from './contexts/ToastMessage/ToastContextProvider.tsx';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrimeReactProvider value={{ ripple: true }}>
      <ToastContextProvider>
        <App />
      </ToastContextProvider>
    </PrimeReactProvider>
  </StrictMode>,
);
