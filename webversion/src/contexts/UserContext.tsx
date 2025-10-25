import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { userApi, characterApi, gamesApi } from '../services/api';
import type { User, Character, Game } from '../types';

interface UserContextType {
  userData: User | null;
  isGameMaster: boolean;
  characters: Character[];
  games: Game[];
  loading: boolean;
  error: string | null;
  selectedCharacterId: string | null;
  setSelectedCharacterId: (id: string | null) => void;
  refreshUserData: () => Promise<void>;
  refreshCharacters: () => Promise<void>;
  refreshGames: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(() => {
    // Load from localStorage on init
    return localStorage.getItem('selectedCharacterId');
  });

  const isGameMaster = userData?.isGameMaster ?? false;

  // Save selectedCharacterId to localStorage whenever it changes
  useEffect(() => {
    if (selectedCharacterId) {
      localStorage.setItem('selectedCharacterId', selectedCharacterId);
    } else {
      localStorage.removeItem('selectedCharacterId');
    }
  }, [selectedCharacterId]);

  // Fetch user data from the users table
  const fetchUserData = async () => {
    if (!user) {
      setUserData(null);
      setCharacters([]);
      setGames([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await userApi.getCurrentUser();
      setUserData(data);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Erro ao carregar dados do usuário');
    } finally {
      setLoading(false);
    }
  };

  // Fetch characters for regular players
  const fetchCharacters = async () => {
    if (!user || !userData || userData.isGameMaster) {
      return;
    }

    try {
      const data = await characterApi.getCharactersByUserId(user.id);
      setCharacters(data);
    } catch (err) {
      console.error('Error fetching characters:', err);
      setError('Erro ao carregar personagens');
    }
  };

  // Fetch games for game masters
  const fetchGames = async () => {
    if (!user || !userData || !userData.isGameMaster) {
      return;
    }

    try {
      const data = await gamesApi.getGamesByGameMaster(user.id);
      setGames(data);
    } catch (err) {
      console.error('Error fetching games:', err);
      setError('Erro ao carregar jogos');
    }
  };

  // Initial load - fetch user data when auth user changes
  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Load characters or games based on user type
  useEffect(() => {
    if (userData) {
      if (userData.isGameMaster) {
        fetchGames();
      } else {
        fetchCharacters();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const refreshUserData = async () => {
    await fetchUserData();
  };

  const refreshCharacters = async () => {
    await fetchCharacters();
  };

  const refreshGames = async () => {
    await fetchGames();
  };

  const value = {
    userData,
    isGameMaster,
    characters,
    games,
    loading,
    error,
    selectedCharacterId,
    setSelectedCharacterId,
    refreshUserData,
    refreshCharacters,
    refreshGames,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

