import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { SocketContext } from '../hooks/useSocket';

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    console.log('Attempting to connect to socket server...');
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('Socket connected successfully');
      setSocket(newSocket);
    });

    newSocket.on('connect_error', error => {
      console.error('Socket connection error:', error);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
