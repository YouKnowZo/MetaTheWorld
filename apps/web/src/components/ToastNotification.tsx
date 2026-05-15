import React from 'react';
import { useGameStore } from '../store';
import type { ToastNotification as StoreNotification } from '../store';

export const ToastNotification: React.FC = () => {
  const { notifications, removeNotification } = useGameStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {notifications.map((n: StoreNotification) => (
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
