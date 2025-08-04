// src/socket.js
import { io } from 'socket.io-client';
const socket = io('http://35.208.75.95:3000', { transports: ['websocket'] }); 
export default socket;
