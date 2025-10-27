import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Attack } from '../types/attack';
import type { Spell, Aprimoramento } from '../types/spell';
import type { Ability, Power } from '../types/ability';
import { supabase } from '../config/supabase';
import { useUser } from './UserContext';
import { validateCharacterId, executeWithLogging, logError } from '../utils/errorHandler';
import { createSimpleTableLoader, createJunctionTableLoader } from '../utils/tableLoaders';

interface CombatContextType {
  attacks: Attack[];
  spells: Spell[];
  abilities: Ability[];
  powers: Power[];
  loading: boolean;
  error: string | null;

  // Attacks management
  addAttack: (attack: Omit<Attack, 'id'>) => Promise<void>;
  updateAttack: (attackId: string, updates: Partial<Omit<Attack, 'id'>>) => Promise<void>;
  deleteAttack: (attackId: string) => Promise<void>;
  refreshAttacks: () => Promise<void>;

  // Spells management
  addSpell: (spell: Omit<Spell, 'id' | 'aprimoramentos'>) => Promise<void>;
  updateSpell: (spellId: string, updates: Partial<Omit<Spell, 'id' | 'aprimoramentos'>>) => Promise<void>;
  deleteSpell: (spellId: string) => Promise<void>;
  refreshSpells: () => Promise<void>;
  addSpellEnhancement: (spellId: string, enhancement: Omit<Aprimoramento, 'id'>) => Promise<void>;
  updateSpellEnhancement: (spellId: string, enhancementId: string, updates: Partial<Omit<Aprimoramento, 'id'>>) => Promise<void>;
  deleteSpellEnhancement: (spellId: string, enhancementId: string) => Promise<void>;

  // Abilities management
  addAbility: (ability: Omit<Ability, 'id'>) => Promise<void>;
  updateAbility: (abilityId: string, updates: Partial<Omit<Ability, 'id'>>) => Promise<void>;
  deleteAbility: (abilityId: string) => Promise<void>;
  refreshAbilities: () => Promise<void>;

  // Powers management
  addPower: (power: Omit<Power, 'id'>) => Promise<void>;
  updatePower: (powerId: string, updates: Partial<Omit<Power, 'id'>>) => Promise<void>;
  deletePower: (powerId: string) => Promise<void>;
  refreshPowers: () => Promise<void>;
}

const CombatContext = createContext<CombatContextType | undefined>(undefined);

export const useCombat = () => {
  const context = useContext(CombatContext);
  if (!context) {
    throw new Error('useCombat must be used within a CombatProvider');
  }
  return context;
};

interface CombatProviderProps {
  children: ReactNode;
}

export const CombatProvider = ({ children }: CombatProviderProps) => {
  const { selectedCharacterId } = useUser();
  const [attacks, setAttacks] = useState<Attack[]>([]);
  const [spells, setSpells] = useState<Spell[]>([]);
  const [abilities, setAbilities] = useState<Ability[]>([]);
  const [powers, setPowers] = useState<Power[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ========== ATTACKS ==========

  // Using factory pattern to eliminate repetitive loader code
  const loadAttacks = useCallback(
    createSimpleTableLoader<Attack>('attacks', 'carregar ataques'),
    []
  );

  const refreshAttacks = useCallback(async () => {
    if (selectedCharacterId) {
      const loadedAttacks = await loadAttacks(selectedCharacterId);
      setAttacks(loadedAttacks);
    }
  }, [selectedCharacterId, loadAttacks]);

  const addAttack = async (attack: Omit<Attack, 'id'>) => {
    validateCharacterId(selectedCharacterId, 'addAttack');

    await executeWithLogging(
      async () => {
        const { data, error } = await supabase
          .from('attacks')
          .insert({
            character_id: selectedCharacterId!,
            name: attack.name,
            type: attack.type,
            teste_ataque: attack.testeAtaque,
            damage: attack.damage,
            critico: attack.critico,
            range: attack.range,
            description: attack.description,
          })
          .select()
          .single();

        if (error) throw error;

        // Update local state
        setAttacks(prev => [data, ...prev]);
      },
      'adicionar ataque',
      'Ataque adicionado com sucesso!'
    );
  };

  const updateAttack = async (attackId: string, updates: Partial<Omit<Attack, 'id'>>) => {
    validateCharacterId(selectedCharacterId, 'updateAttack');

    await executeWithLogging(
      async () => {
        const { error } = await supabase
          .from('attacks')
          .update({
            name: updates.name,
            type: updates.type,
            teste_ataque: updates.testeAtaque,
            damage: updates.damage,
            critico: updates.critico,
            range: updates.range,
            description: updates.description,
          })
          .eq('id', attackId)
          .eq('character_id', selectedCharacterId!);

        if (error) throw error;

        // Update local state
        setAttacks(prev =>
          prev.map(attack =>
            attack.id === attackId
              ? { ...attack, ...updates }
              : attack
          )
        );
      },
      'atualizar ataque',
      'Ataque atualizado com sucesso!'
    );
  };

  const deleteAttack = async (attackId: string) => {
    validateCharacterId(selectedCharacterId, 'deleteAttack');

    await executeWithLogging(
      async () => {
        const { error } = await supabase
          .from('attacks')
          .delete()
          .eq('id', attackId)
          .eq('character_id', selectedCharacterId!);

        if (error) throw error;

        // Update local state
        setAttacks(prev => prev.filter(attack => attack.id !== attackId));
      },
      'deletar ataque',
      'Ataque deletado com sucesso!'
    );
  };

  // ========== SPELLS ==========

  const loadSpells = useCallback(async (characterId: string): Promise<Spell[]> => {
    try {
      // Get character_spells to get spell IDs
      const { data: characterSpells, error: characterSpellsError } = await supabase
        .from('character_spells')
        .select('spell_id')
        .eq('character_id', characterId);

      if (characterSpellsError) {
        logError('carregar character_spells', characterSpellsError);
        return [];
      }

      if (!characterSpells || characterSpells.length === 0) {
        return [];
      }

      const spellIds = characterSpells.map(cs => cs.spell_id);

      // Get spells data
      const { data: spellsData, error: spellsError } = await supabase
        .from('spells')
        .select('*')
        .in('id', spellIds);

      if (spellsError) {
        logError('carregar magias', spellsError);
        return [];
      }

      // Load enhancements for each spell
      const spells: Spell[] = [];
      for (const spell of spellsData || []) {
        const { data: enhancements, error: enhancementError } = await supabase
          .from('spell_enhancements')
          .select('*')
          .eq('spell_id', spell.id);

        if (enhancementError) {
          logError('carregar aprimoramentos', enhancementError);
          spells.push({ ...spell, aprimoramentos: [] });
        } else {
          spells.push({
            ...spell,
            aprimoramentos: (enhancements || []).map(enh => ({
              id: enh.id,
              custoAdicionalPM: enh.custo_adicional_pm,
              reaplicavel: enh.reaplicavel,
              descricao: enh.descricao,
              aplicacoes: 0, // Managed locally
            })),
          });
        }
      }

      return spells;
    } catch (err) {
      logError('carregar magias', err);
      return [];
    }
  }, []);

  const refreshSpells = useCallback(async () => {
    if (selectedCharacterId) {
      const loadedSpells = await loadSpells(selectedCharacterId);
      setSpells(loadedSpells);
    }
  }, [selectedCharacterId, loadSpells]);

  const addSpell = async (spell: Omit<Spell, 'id' | 'aprimoramentos'>) => {
    validateCharacterId(selectedCharacterId, 'addSpell');

    await executeWithLogging(
      async () => {
        // Create spell
        const { data: spellData, error: spellError } = await supabase
          .from('spells')
          .insert({
            name: spell.name,
            escola: spell.escola,
            execucao: spell.execucao,
            alcance: spell.alcance,
            area: spell.area,
            alvo: spell.alvo,
            efeito: spell.efeito,
            duracao: spell.duracao,
            resistencia: spell.resistencia,
            fonte: spell.fonte,
          })
          .select()
          .single();

        if (spellError) throw spellError;

        // Link to character
        const { error: linkError } = await supabase
          .from('character_spells')
          .insert({
            character_id: selectedCharacterId!,
            spell_id: spellData.id,
          });

        if (linkError) throw linkError;

        // Update local state
        setSpells(prev => [{ ...spellData, aprimoramentos: [] }, ...prev]);
      },
      'adicionar magia',
      'Magia adicionada com sucesso!'
    );
  };

  const updateSpell = async (spellId: string, updates: Partial<Omit<Spell, 'id' | 'aprimoramentos'>>) => {
    await executeWithLogging(
      async () => {
        const { error } = await supabase
          .from('spells')
          .update({
            name: updates.name,
            escola: updates.escola,
            execucao: updates.execucao,
            alcance: updates.alcance,
            area: updates.area,
            alvo: updates.alvo,
            efeito: updates.efeito,
            duracao: updates.duracao,
            resistencia: updates.resistencia,
            fonte: updates.fonte,
          })
          .eq('id', spellId);

        if (error) throw error;

        // Update local state
        setSpells(prev =>
          prev.map(spell =>
            spell.id === spellId
              ? { ...spell, ...updates }
              : spell
          )
        );
      },
      'atualizar magia',
      'Magia atualizada com sucesso!'
    );
  };

  const deleteSpell = async (spellId: string) => {
    validateCharacterId(selectedCharacterId, 'deleteSpell');

    await executeWithLogging(
      async () => {
        // Unlink from character
        const { error: unlinkError } = await supabase
          .from('character_spells')
          .delete()
          .eq('character_id', selectedCharacterId!)
          .eq('spell_id', spellId);

        if (unlinkError) throw unlinkError;

        // Delete spell
        const { error: deleteError } = await supabase
          .from('spells')
          .delete()
          .eq('id', spellId);

        if (deleteError) throw deleteError;

        // Update local state
        setSpells(prev => prev.filter(spell => spell.id !== spellId));
      },
      'deletar magia',
      'Magia deletada com sucesso!'
    );
  };

  const addSpellEnhancement = async (spellId: string, enhancement: Omit<Aprimoramento, 'id'>) => {
    await executeWithLogging(
      async () => {
        const { data, error } = await supabase
          .from('spell_enhancements')
          .insert({
            spell_id: spellId,
            custo_adicional_pm: enhancement.custoAdicionalPM,
            reaplicavel: enhancement.reaplicavel,
            descricao: enhancement.descricao,
          })
          .select()
          .single();

        if (error) throw error;

        // Update local state
        setSpells(prev =>
          prev.map(spell =>
            spell.id === spellId
              ? { ...spell, aprimoramentos: [...spell.aprimoramentos, data] }
              : spell
          )
        );
      },
      'adicionar aprimoramento',
      'Aprimoramento adicionado com sucesso!'
    );
  };

  const updateSpellEnhancement = async (
    spellId: string,
    enhancementId: string,
    updates: Partial<Omit<Aprimoramento, 'id'>>
  ) => {
    await executeWithLogging(
      async () => {
        const { error } = await supabase
          .from('spell_enhancements')
          .update({
            custo_adicional_pm: updates.custoAdicionalPM,
            reaplicavel: updates.reaplicavel,
            descricao: updates.descricao,
          })
          .eq('id', enhancementId);

        if (error) throw error;

        // Update local state
        setSpells(prev =>
          prev.map(spell =>
            spell.id === spellId
              ? {
                  ...spell,
                  aprimoramentos: spell.aprimoramentos.map(enh =>
                    enh.id === enhancementId ? { ...enh, ...updates } : enh
                  ),
                }
              : spell
          )
        );
      },
      'atualizar aprimoramento',
      'Aprimoramento atualizado com sucesso!'
    );
  };

  const deleteSpellEnhancement = async (spellId: string, enhancementId: string) => {
    await executeWithLogging(
      async () => {
        const { error } = await supabase
          .from('spell_enhancements')
          .delete()
          .eq('id', enhancementId);

        if (error) throw error;

        // Update local state
        setSpells(prev =>
          prev.map(spell =>
            spell.id === spellId
              ? {
                  ...spell,
                  aprimoramentos: spell.aprimoramentos.filter(enh => enh.id !== enhancementId),
                }
              : spell
          )
        );
      },
      'deletar aprimoramento',
      'Aprimoramento deletado com sucesso!'
    );
  };

  // ========== ABILITIES ==========

  const loadAbilities = useCallback(
    createJunctionTableLoader<Ability>(
      'character_abilities',
      'ability_id',
      'abilities',
      { field: 'type', value: 'ability' },
      'carregar habilidades'
    ),
    []
  );

  const refreshAbilities = useCallback(async () => {
    if (selectedCharacterId) {
      const loadedAbilities = await loadAbilities(selectedCharacterId);
      setAbilities(loadedAbilities);
    }
  }, [selectedCharacterId, loadAbilities]);

  const addAbility = async (ability: Omit<Ability, 'id'>) => {
    validateCharacterId(selectedCharacterId, 'addAbility');

    await executeWithLogging(
      async () => {
        // Create ability
        const { data: abilityData, error: abilityError } = await supabase
          .from('abilities')
          .insert({
            name: ability.name,
            type: ability.type,
            description: ability.description,
            prerequisites: ability.prerequisites,
            cost: ability.cost,
          })
          .select()
          .single();

        if (abilityError) throw abilityError;

        // Link to character
        const { error: linkError } = await supabase
          .from('character_abilities')
          .insert({
            character_id: selectedCharacterId!,
            ability_id: abilityData.id,
          });

        if (linkError) throw linkError;

        // Update local state
        setAbilities(prev => [abilityData, ...prev]);
      },
      'adicionar habilidade',
      'Habilidade adicionada com sucesso!'
    );
  };

  const updateAbility = async (abilityId: string, updates: Partial<Omit<Ability, 'id'>>) => {
    await executeWithLogging(
      async () => {
        const { error } = await supabase
          .from('abilities')
          .update({
            name: updates.name,
            type: updates.type,
            description: updates.description,
            prerequisites: updates.prerequisites,
            cost: updates.cost,
          })
          .eq('id', abilityId);

        if (error) throw error;

        // Update local state
        setAbilities(prev =>
          prev.map(ability =>
            ability.id === abilityId
              ? { ...ability, ...updates }
              : ability
          )
        );
      },
      'atualizar habilidade',
      'Habilidade atualizada com sucesso!'
    );
  };

  const deleteAbility = async (abilityId: string) => {
    validateCharacterId(selectedCharacterId, 'deleteAbility');

    await executeWithLogging(
      async () => {
        // Unlink from character
        const { error: unlinkError } = await supabase
          .from('character_abilities')
          .delete()
          .eq('character_id', selectedCharacterId!)
          .eq('ability_id', abilityId);

        if (unlinkError) throw unlinkError;

        // Delete ability
        const { error: deleteError } = await supabase
          .from('abilities')
          .delete()
          .eq('id', abilityId);

        if (deleteError) throw deleteError;

        // Update local state
        setAbilities(prev => prev.filter(ability => ability.id !== abilityId));
      },
      'deletar habilidade',
      'Habilidade deletada com sucesso!'
    );
  };

  // ========== POWERS ==========

  const loadPowers = useCallback(
    createJunctionTableLoader<Power>(
      'character_abilities',
      'ability_id',
      'abilities',
      { field: 'type', value: 'power' },
      'carregar poderes'
    ),
    []
  );

  const refreshPowers = useCallback(async () => {
    if (selectedCharacterId) {
      const loadedPowers = await loadPowers(selectedCharacterId);
      setPowers(loadedPowers);
    }
  }, [selectedCharacterId, loadPowers]);

  const addPower = async (power: Omit<Power, 'id'>) => {
    validateCharacterId(selectedCharacterId, 'addPower');

    await executeWithLogging(
      async () => {
        // Create power
        const { data: powerData, error: powerError } = await supabase
          .from('abilities')
          .insert({
            name: power.name,
            type: 'power',
            category: power.category,
            description: power.description,
            prerequisites: power.prerequisites,
            cost: power.cost,
          })
          .select()
          .single();

        if (powerError) throw powerError;

        // Link to character
        const { error: linkError } = await supabase
          .from('character_abilities')
          .insert({
            character_id: selectedCharacterId!,
            ability_id: powerData.id,
          });

        if (linkError) throw linkError;

        // Update local state
        setPowers(prev => [powerData, ...prev]);
      },
      'adicionar poder',
      'Poder adicionado com sucesso!'
    );
  };

  const updatePower = async (powerId: string, updates: Partial<Omit<Power, 'id'>>) => {
    await executeWithLogging(
      async () => {
        const { error } = await supabase
          .from('abilities')
          .update({
            name: updates.name,
            type: 'power',
            category: updates.category,
            description: updates.description,
            prerequisites: updates.prerequisites,
            cost: updates.cost,
          })
          .eq('id', powerId);

        if (error) throw error;

        // Update local state
        setPowers(prev =>
          prev.map(power =>
            power.id === powerId
              ? { ...power, ...updates }
              : power
          )
        );
      },
      'atualizar poder',
      'Poder atualizado com sucesso!'
    );
  };

  const deletePower = async (powerId: string) => {
    validateCharacterId(selectedCharacterId, 'deletePower');

    await executeWithLogging(
      async () => {
        // Unlink from character
        const { error: unlinkError } = await supabase
          .from('character_abilities')
          .delete()
          .eq('character_id', selectedCharacterId!)
          .eq('ability_id', powerId);

        if (unlinkError) throw unlinkError;

        // Delete power
        const { error: deleteError } = await supabase
          .from('abilities')
          .delete()
          .eq('id', powerId);

        if (deleteError) throw deleteError;

        // Update local state
        setPowers(prev => prev.filter(power => power.id !== powerId));
      },
      'deletar poder',
      'Poder deletado com sucesso!'
    );
  };

  // ========== AUTO-LOAD ==========

  useEffect(() => {
    if (selectedCharacterId) {
      setLoading(true);
      setError(null);

      Promise.all([
        loadAttacks(selectedCharacterId),
        loadSpells(selectedCharacterId),
        loadAbilities(selectedCharacterId),
        loadPowers(selectedCharacterId),
      ])
        .then(([attacks, spells, abilities, powers]) => {
          setAttacks(attacks);
          setSpells(spells);
          setAbilities(abilities);
          setPowers(powers);
        })
        .catch(err => {
          setError('Erro ao carregar dados de combate');
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setAttacks([]);
      setSpells([]);
      setAbilities([]);
      setPowers([]);
    }
  }, [selectedCharacterId, loadAttacks, loadSpells, loadAbilities, loadPowers]);

  const value = {
    attacks,
    spells,
    abilities,
    powers,
    loading,
    error,
    addAttack,
    updateAttack,
    deleteAttack,
    refreshAttacks,
    addSpell,
    updateSpell,
    deleteSpell,
    refreshSpells,
    addSpellEnhancement,
    updateSpellEnhancement,
    deleteSpellEnhancement,
    addAbility,
    updateAbility,
    deleteAbility,
    refreshAbilities,
    addPower,
    updatePower,
    deletePower,
    refreshPowers,
  };

  return (
    <CombatContext.Provider value={value}>
      {children}
    </CombatContext.Provider>
  );
};
