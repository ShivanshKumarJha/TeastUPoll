import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { SocketContext } from '../hooks/useSocket';
import API_CONFIG from '../config/api';

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    console.log('Attempting to connect to socket server...');
    console.log('Socket URL:', API_CONFIG.SOCKET_URL);

    const socketConfig = API_CONFIG.getSocketConfig();
    console.log('Socket config:', socketConfig);

    const newSocket = io(API_CONFIG.SOCKET_URL, socketConfig);

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
