import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { NotificationProvider } from './components/providers/alerts';
import { router } from './router';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <NotificationProvider>
      <RouterProvider router={router} />
    </NotificationProvider>
  </StrictMode>
);
