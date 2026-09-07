import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (tenantId?: string) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!tenantId) return;

    // Connect to WebSocket server
    socketRef.current = io('http://localhost:5000');

    // Join room for multi-tenant channel isolation
    socketRef.current.emit('join-workspace', tenantId);

    return () => {
      socketRef.current?.disconnect();
    };
  }, [tenantId]);

  return socketRef.current;
};