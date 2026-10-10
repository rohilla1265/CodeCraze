import { io } from 'socket.io-client';

// Ek single connection instance poori app ke liye
const SOCKET_URL = 'https://code-crazee.onrender.com';
export const socket = io(SOCKET_URL, {
  autoConnect: true,
});