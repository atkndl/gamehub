import { io } from 'socket.io-client';

// Determine socket URL (port 3000 in dev, or same origin in production)
const SOCKET_URL = window.location.port === '5173'
  ? `http://${window.location.hostname}:3000`
  : '/';

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ['websocket', 'polling'],
  reconnectionAttempts: 10,
  reconnectionDelay: 1000
});

socket.on('connect', () => {
  console.log('[Socket] Connected with id:', socket.id);
});

socket.on('disconnect', (reason) => {
  console.log('[Socket] Disconnected:', reason);
});
