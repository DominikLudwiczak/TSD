import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!socketRef.current) {
      console.log('Creating new socket connection');
      socketRef.current = io('http://localhost:5000', {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });
      
      socketRef.current.on('connect', () => {
        console.log('Socket connected with ID:', socketRef.current.id);
        setSocket(socketRef.current);
      });
      
      socketRef.current.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
      
      socketRef.current.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
      });
    }

    return () => {
      if (socketRef.current) {
        console.log('Cleaning up socket connection');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  if (!socket) {
    return <div>Łączenie z serwerem...</div>;
  }

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};