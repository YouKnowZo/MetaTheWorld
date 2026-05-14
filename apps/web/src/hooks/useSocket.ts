import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useGameStore } from '../store';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3002';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const { currentUser, addNotification } = useGameStore();

  useEffect(() => {
    if (!currentUser) return;

    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to real-time server');
      socket.emit('join_world', {
        address: currentUser.address,
        position: [0, 0, 0],
        avatar: {}
      });
    });

    socket.on('new_message', (msg) => {
      // In a real app, this would update a global chat state
      console.log('New message:', msg);
    });

    socket.on('player_joined', (player) => {
      addNotification(`${player.address.slice(0, 6)}... joined the world`, 'info');
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUser, addNotification]);

  return socketRef.current;
};
