import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { NotificationProvider } from './components/providers/alerts';
import { router } from './router';
import './theme.css';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
    <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        width: '550px',
        height: '550px',
        backgroundColor: 'rgba(0, 0, 210, 0.3)',
        borderRadius: '50%',
        filter: 'blur(100px)',
        transform: 'translate(-20%, -60%)',
        zIndex: -1
      }} />
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        width: '550px',
        height: '550px',
        backgroundColor: 'rgb(138,43,226, 0.3)',
        borderRadius: '50%',
        filter: 'blur(100px)',
        transform: 'translate(-50%, -10%)',
        zIndex: -1
      }} />
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        width: '550px',
        height: '550px',
        backgroundColor: 'rgba(0, 0, 160, 0.3)',
        borderRadius: '50%',
        filter: 'blur(100px)',
        transform: 'translate(-90%, -40%)',
        zIndex: -1,
        animation: 'fade 2s infinite'
      }} />
      <NotificationProvider>
        <RouterProvider router={router} />
      </NotificationProvider>
    </div>
  </StrictMode>
);