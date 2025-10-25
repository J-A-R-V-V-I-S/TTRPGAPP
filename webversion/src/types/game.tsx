// Game and Game Session Types

/**
 * Represents a game session managed by a Game Master
 * A GM can own multiple games, and players can participate in multiple games
 */
interface Game {
    id: string;
    name: string;
    description?: string;
    gameMasterId: string; // User ID of the Game Master who owns this game
    isActive: boolean;
    inGameDate?: string;
    lastSessionDate?: string;
    createdAt?: string;
    updatedAt?: string;
}

/**
 * Represents a player participating in a game
 */
interface GamePlayer {
    userId: string;
    userName: string;
    characterId?: string; // Optional - player might not have selected a character yet
    characterName?: string;
    joinedAt: Date;
    isActive: boolean; // Whether the player is still active in this game
}

/**
 * Player roles within a game
 */


interface GameSession {
    id: string;
    gameId: string;
    sessionNumber: number;
    date: Date;
    duration?: number; // Duration in minutes
    summary?: string;
    attendees: string[]; // Array of player user IDs
    notes?: string;
}

export type {
    Game,
    GamePlayer,
    GameSession,
};

