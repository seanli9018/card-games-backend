import { Server } from 'socket.io';
import { handleGameEvents } from './gameHandler';
import type { Server as ServerType } from 'http';

export const initializeSocket = (server: ServerType) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    handleGameEvents(socket); // Attach game-specific event handlers
  });

  return io;
};
