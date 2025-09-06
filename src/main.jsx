import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ClerkProvider } from '@clerk/clerk-react';
import { esES } from '@clerk/localizations';
import { LanguageProvider } from './components/LanguageContext'; // 👈 Import del contexto

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Falta la Publishable Key de Clerk en el .env');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} routing="path" localization={esES}>
      <LanguageProvider>  {/* 👈 Aquí envolvemos App */}
        <App />
      </LanguageProvider>
    </ClerkProvider>
  </React.StrictMode>
);
