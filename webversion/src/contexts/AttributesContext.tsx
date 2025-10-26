import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { CharacterAttributes } from '../types/character_attributes';
import type { Skill } from '../types/skill';
import { supabase } from '../config/supabase';
import { useUser } from './UserContext';
import { loadItems, loadSingleItem, updateItem } from '../utils/supabaseOperations';
import { validateCharacterId, executeWithLogging, logWarning, logSuccess } from '../utils/errorHandler';
import { mapAttributesFromDb, mapAttributesToDb, mapSkillFromDb, mapSkillToDb } from '../utils/fieldMapping';

interface CharacterSkill extends Skill {
  id: string;
  characterId: string;
}

interface AttributesContextType {
  attributes: CharacterAttributes | null;
  skills: CharacterSkill[];
  loading: boolean;
  error: string | null;

  // Attributes management
  updateAttributes: (attributes: Partial<Omit<CharacterAttributes, 'id' | 'characterId'>>) => Promise<void>;
  refreshAttributes: () => Promise<void>;

  // Skills management
  updateSkill: (skillId: string, updates: Partial<Omit<Skill, 'name' | 'attribute'>>) => Promise<void>;
  refreshSkills: () => Promise<void>;
}

const AttributesContext = createContext<AttributesContextType | undefined>(undefined);

export const useAttributes = () => {
  const context = useContext(AttributesContext);
  if (!context) {
    throw new Error('useAttributes must be used within an AttributesProvider');
  }
  return context;
};

interface AttributesProviderProps {
  children: ReactNode;
}

export const AttributesProvider = ({ children }: AttributesProviderProps) => {
  const { selectedCharacterId } = useUser();
  const [attributes, setAttributes] = useState<CharacterAttributes | null>(null);
  const [skills, setSkills] = useState<CharacterSkill[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load attributes from database
  const loadAttributes = useCallback(async (characterId: string) => {
    try {
      const loadedAttributes = await loadSingleItem<CharacterAttributes>(
        'character_attributes',
        characterId,
        mapAttributesFromDb
      );

      if (!loadedAttributes) {
        logWarning('Atributos não encontrados, criando valores padrão...');

        // Create default attributes if they don't exist
        const { data: newData, error: insertError } = await supabase
          .from('character_attributes')
          .insert({
            character_id: characterId,
            forca: 10,
            destreza: 10,
            constituicao: 10,
            inteligencia: 10,
            sabedoria: 10,
            carisma: 10,
          })
          .select()
          .single();

        if (insertError) {
          throw insertError;
        }

        logSuccess('Atributos padrão criados');
        setAttributes(mapAttributesFromDb(newData));
      } else {
        setAttributes(loadedAttributes);
      }
    } catch (err) {
      console.error('❌ Erro ao carregar atributos:', err);
      setAttributes(null);
    }
  }, []);

  // Load skills from database
  const loadSkills = useCallback(async (characterId: string) => {
    const loadedSkills = await loadItems<CharacterSkill>(
      'skills',
      characterId,
      mapSkillFromDb,
      [{ column: 'name', ascending: true }]
    );

    setSkills(loadedSkills);
  }, []);

  // Auto-load attributes and skills when selectedCharacterId changes
  useEffect(() => {
    if (selectedCharacterId) {
      setLoading(true);
      setError(null);

      Promise.all([
        loadAttributes(selectedCharacterId),
        loadSkills(selectedCharacterId),
      ])
        .catch(err => {
          setError('Erro ao carregar atributos e perícias');
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setAttributes(null);
      setSkills([]);
    }
  }, [selectedCharacterId, loadAttributes, loadSkills]);

  // Refresh attributes
  const refreshAttributes = useCallback(async () => {
    if (selectedCharacterId) {
      await loadAttributes(selectedCharacterId);
    }
  }, [selectedCharacterId, loadAttributes]);

  // Refresh skills
  const refreshSkills = useCallback(async () => {
    if (selectedCharacterId) {
      await loadSkills(selectedCharacterId);
    }
  }, [selectedCharacterId, loadSkills]);

  // Update attributes
  const updateAttributes = async (updates: Partial<Omit<CharacterAttributes, 'id' | 'characterId'>>) => {
    validateCharacterId(selectedCharacterId, 'updateAttributes');

    await executeWithLogging(
      async () => {
        const dbUpdates = mapAttributesToDb(updates);

        await supabase
          .from('character_attributes')
          .update(dbUpdates)
          .eq('character_id', selectedCharacterId!);

        // Update local state
        setAttributes(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            ...updates,
          };
        });
      },
      'atualizar atributos',
      'Atributos atualizados com sucesso!'
    );
  };

  // Update skill
  const updateSkill = async (skillId: string, updates: Partial<Omit<Skill, 'name' | 'attribute'>>) => {
    validateCharacterId(selectedCharacterId, 'updateSkill');

    await executeWithLogging(
      async () => {
        const dbUpdates = mapSkillToDb(updates);

        await updateItem('skills', skillId, dbUpdates, selectedCharacterId, 'Perícia atualizada com sucesso!');

        // Update local state
        setSkills(prev =>
          prev.map(skill =>
            skill.id === skillId
              ? { ...skill, ...updates }
              : skill
          )
        );
      },
      'atualizar perícia'
    );
  };

  const value = {
    attributes,
    skills,
    loading,
    error,
    updateAttributes,
    refreshAttributes,
    updateSkill,
    refreshSkills,
  };

  return (
    <AttributesContext.Provider value={value}>
      {children}
    </AttributesContext.Provider>
  );
};
