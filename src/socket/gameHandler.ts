import type { Socket } from 'socket.io';
import { Games, Game, Player } from './types';

const games: Games = {};

export const handleGameEvents = (socket: Socket) => {
  // Handle game creation
  socket.on('createGame', (gameId: string) => {
    games[gameId] = {
      players: [],
      cards: [], // Initialize with card logic
    };
    socket.join(gameId);
    console.log(`Game created with ID: ${gameId}`);
    socket.to(gameId).emit('updateGame', games[gameId]);
  });

  // Handle joining a game
  socket.on('joinGame', (gameId: string, playerName: string) => {
    if (games[gameId]) {
      const player: Player = { id: socket.id, name: playerName };
      games[gameId].players.push(player);
      socket.join(gameId);
      socket.to(gameId).emit('updateGame', games[gameId]);
      console.log(`${playerName} joined game ${gameId}`);
    } else {
      socket.emit('error', 'Game not found');
    }
  });

  // Handle playing a card
  socket.on('playCard', (gameId: string, card: string) => {
    if (games[gameId]) {
      // Add card-playing logic here
      games[gameId].cards.push(card);
      socket.to(gameId).emit('updateGame', games[gameId]);
    } else {
      socket.emit('error', 'Invalid game or card');
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Remove player from any games they were in
    for (const gameId in games) {
      games[gameId].players = games[gameId].players.filter(
        (player: any) => player.id !== socket.id
      );
      socket.to(gameId).emit('updateGame', games[gameId]);
    }
  });
};
