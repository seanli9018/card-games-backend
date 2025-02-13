export interface Player {
  id: string;
  name: string;
}

export interface Game {
  players: Player[];
  cards: string[]; // Add your card logic here
}

export type Games = Record<string, Game>; // Game ID -> Game
