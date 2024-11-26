import { Alert, Snackbar } from '@mui/material';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface Notification {
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
}

interface NotificationContextType {
  notify: (message: string, severity: Notification['severity']) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<Notification | null>(null);
  const [open, setOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const notify = (message: string, severity: Notification['severity']) => {
    setNotification({ message, severity });
    setOpen(true);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setOpen(false);
    }, 1500); // Display duration: 1.5 seconds
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
        {notification && (
          <Snackbar
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert onClose={handleClose} severity={notification.severity} sx={{ width: '100%', fontSize: '1rem', fontWeight: 'bold', fontStyle: "italic" }}>
              {notification.message}
            </Alert>
          </Snackbar>
        )}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};