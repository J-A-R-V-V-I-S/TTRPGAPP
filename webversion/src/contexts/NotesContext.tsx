import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Note } from '../types/note';
import { useUser } from './UserContext';
import { loadItems, insertItem, updateItem as updateDbItem, deleteItem } from '../utils/supabaseOperations';
import { validateCharacterId, executeWithLogging } from '../utils/errorHandler';
import { mapNoteFromDb, mapNoteToDbInsert, mapNoteToDbUpdate } from '../utils/fieldMapping';

interface NotesContextType {
  notes: Note[];
  loading: boolean;
  error: string | null;

  // Notes management
  addNote: (data: Omit<Note, 'id' | 'characterId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateNote: (noteId: string, data: Partial<Omit<Note, 'id' | 'characterId' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  refreshNotes: () => Promise<void>;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

interface NotesProviderProps {
  children: ReactNode;
}

export const NotesProvider = ({ children }: NotesProviderProps) => {
  const { selectedCharacterId } = useUser();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load notes from database
  const loadNotes = useCallback(async (characterId: string) => {
    setLoading(true);
    setError(null);

    try {
      const loadedNotes = await loadItems<Note>(
        'notes',
        characterId,
        mapNoteFromDb,
        [
          { column: 'is_pinned', ascending: false },
          { column: 'updated_at', ascending: false },
        ]
      );

      setNotes(loadedNotes);
    } catch (err) {
      setError('Erro ao carregar anotações');
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-load notes when selectedCharacterId changes
  useEffect(() => {
    if (selectedCharacterId) {
      loadNotes(selectedCharacterId);
    } else {
      setNotes([]);
    }
  }, [selectedCharacterId, loadNotes]);

  // Refresh notes
  const refreshNotes = useCallback(async () => {
    if (selectedCharacterId) {
      await loadNotes(selectedCharacterId);
    }
  }, [selectedCharacterId, loadNotes]);

  // Add note
  const addNote = async (data: Omit<Note, 'id' | 'characterId' | 'createdAt' | 'updatedAt'>) => {
    validateCharacterId(selectedCharacterId, 'addNote');

    await executeWithLogging(
      async () => {
        const noteData = mapNoteToDbInsert(selectedCharacterId!, data);
        await insertItem('notes', noteData, 'Anotação adicionada com sucesso!');
        await refreshNotes();
      },
      'adicionar anotação'
    );
  };

  // Update note
  const updateNote = async (
    noteId: string,
    data: Partial<Omit<Note, 'id' | 'characterId' | 'createdAt' | 'updatedAt'>>
  ) => {
    validateCharacterId(selectedCharacterId, 'updateNote');

    await executeWithLogging(
      async () => {
        const noteData = mapNoteToDbUpdate(data);
        await updateDbItem('notes', noteId, noteData, selectedCharacterId ?? undefined, 'Anotação atualizada com sucesso!');
        await refreshNotes();
      },
      'atualizar anotação'
    );
  };

  // Delete note
  const deleteNote = async (noteId: string) => {
    validateCharacterId(selectedCharacterId, 'deleteNote');

    await executeWithLogging(
      async () => {
        await deleteItem('notes', noteId, selectedCharacterId ?? undefined, 'Anotação deletada com sucesso!');

        // Update local state immediately
        setNotes(prev => prev.filter(note => note.id !== noteId));
      },
      'deletar anotação'
    );
  };

  const value = {
    notes,
    loading,
    error,
    addNote,
    updateNote,
    deleteNote,
    refreshNotes,
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};
