'use client';

import { io } from 'socket.io-client';

const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5000';

let socket = null;

export function getSocket(token) {
  if (!token) return null;
  if (socket && socket.connected) return socket;
  if (socket) socket.disconnect();

  socket = io(WS_URL, {
    transports: ['websocket', 'polling'],
    query: { token },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
