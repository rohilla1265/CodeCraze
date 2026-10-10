// import { io } from 'socket.io-client';

// // Ek single connection instance poori app ke liye
// const SOCKET_URL = 'https://code-craze-4qw1.onrender.com';
// // const SOCKET_URL = 'http://localhost:4000';
// export const socket = io(SOCKET_URL, {
//   autoConnect: true,
// });
import { io } from 'socket.io-client';

const SOCKET_URL = 'https://code-craze-4qw1.onrender.com';

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  withCredentials: true, // <--- Ye zaroori hai cookies aur session pass karne ke liye
  transports: ['websocket', 'polling'], // <--- Backend ke sath transport sync karne ke liye
});