import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { NotificationProvider } from './components/providers/alerts';
import { router } from './router';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
    <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        width: '450px',
        height: '450px',
        backgroundColor: 'rgba(0, 0, 230, 0.3)',
        borderRadius: '50%',
        filter: 'blur(100px)',
        transform: 'translate(-20%, -60%)',
        zIndex: -1
      }} />
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        width: '450px',
        height: '450px',
        backgroundColor: 'rgba(0, 0, 230, 0.3)',
        borderRadius: '50%',
        filter: 'blur(100px)',
        transform: 'translate(-50%, -20%)',
        zIndex: -1
      }} />
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        width: '450px',
        height: '450px',
        backgroundColor: 'rgba(0, 0, 230, 0.3)',
        borderRadius: '50%',
        filter: 'blur(100px)',
        transform: 'translate(-70%, -40%)',
        zIndex: -1
      }} />
      <NotificationProvider>
        <RouterProvider router={router} />
      </NotificationProvider>
    </div>
  </StrictMode>
);