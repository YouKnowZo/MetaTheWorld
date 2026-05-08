<<<<<<< HEAD
import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store'

export const ToastNotification = () => {
  const { notifications, removeNotification } = useGameStore()

  return (
    <div className="toast-container" style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      <AnimatePresence>
        {notifications.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              padding: '12px 20px',
              borderRadius: '8px',
              backgroundColor: toast.type === 'error' ? '#ff4d4d' : toast.type === 'success' ? '#4CAF50' : '#2196F3',
              color: 'white',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              fontWeight: 500,
              minWidth: '200px',
              cursor: 'pointer'
            }}
            onClick={() => removeNotification(toast.id)}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
=======
import React from 'react';
import { useGameStore } from '../store';
import type { Notification } from '../store';

export const ToastNotification: React.FC = () => {
  const { notifications, removeNotification } = useGameStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {notifications.map((n: Notification) => (
        <div 
          key={n.id} 
          className={`p-4 rounded shadow-lg text-white ${
            n.type === 'error' ? 'bg-red-600' : 'bg-green-600'
          }`}
          onClick={() => removeNotification(n.id)}
        >
          {n.message}
        </div>
      ))}
    </div>
  );
};
>>>>>>> 078f28a (fix: resolve TypeScript deprecations, update Tailwind v4 PostCSS config, fix dependencies)
