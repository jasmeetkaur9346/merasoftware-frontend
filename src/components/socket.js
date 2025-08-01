// src/socket.js
import { io } from 'socket.io-client';

// ⚠️ Replace with your actual VPS IP or domain
const socket = io('http://35.208.75.95:3000'); 

export default socket;