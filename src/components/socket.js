// src/socket.js
import { io } from 'socket.io-client';
const socket = io('https://socket.merasoftware.com', { transports: ['websocket'] }); 
export default socket;
