// Context types for app-level state management

import type { User } from './user';
import type { Character } from './character';
import type { Group } from './group';
import type { Game } from './game';

// App Context (Global State)
interface AppContextType {
    user: User | null;
    activeCharacter: Character | null;
    currentGroup: Group | null;
    currentGame: Game | null;
    isLoading: boolean;
    error: string | null;
    
    // Actions
    setUser: (user: User | null) => void;
    setActiveCharacter: (character: Character | null) => void;
    setCurrentGroup: (group: Group | null) => void;
    setCurrentGame: (game: Game | null) => void;
    clearError: () => void;
}

// Character Context
interface CharacterContextType {
    character: Character | null;
    isLoading: boolean;
    error: string | null;
    
    // Actions
    updateCharacter: (updates: Partial<Character>) => Promise<void>;
    refreshCharacter: () => Promise<void>;
}

// Group Context
interface GroupContextType {
    group: Group | null;
    isLoading: boolean;
    error: string | null;
    
    // Actions
    updateGroup: (updates: Partial<Group>) => Promise<void>;
    refreshGroup: () => Promise<void>;
    leaveGroup: () => Promise<void>;
}

// Game Context
interface GameContextType {
    game: Game | null;
    isLoading: boolean;
    error: string | null;
    
    // Actions
    updateGame: (updates: Partial<Game>) => Promise<void>;
    refreshGame: () => Promise<void>;
    leaveGame: () => Promise<void>;
    invitePlayer: (userId: string) => Promise<void>;
    removePlayer: (userId: string) => Promise<void>;
}

export type {
    AppContextType,
    CharacterContextType,
    GroupContextType,
    GameContextType,
};

