import { io } from 'socket.io-client';

// Ek single connection instance poori app ke liye
const SOCKET_URL = 'https://code-crazee.onrender.com';
// const SOCKET_URL = 'http://localhost:4000';
export const socket = io(SOCKET_URL, {
  autoConnect: true,
});