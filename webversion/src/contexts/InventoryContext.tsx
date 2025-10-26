import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { InventoryItem } from '../types/inventory';
import { supabase } from '../config/supabase';
import { useUser } from './UserContext';
import { validateCharacterId, executeWithLogging, logError, logSuccess, logWarning } from '../utils/errorHandler';

interface InventoryContextType {
  inventory: InventoryItem[];
  currentLoad: number;
  loading: boolean;
  error: string | null;

  // Inventory management
  addItemToInventory: (itemId: string, quantity?: number) => Promise<void>;
  removeItemFromInventory: (characterItemId: string) => Promise<void>;
  updateItemQuantity: (characterItemId: string, quantity: number) => Promise<void>;
  refreshInventory: () => Promise<void>;

  // Load management
  calculateCurrentLoad: (items: InventoryItem[]) => number;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

interface InventoryProviderProps {
  children: ReactNode;
}

export const InventoryProvider = ({ children }: InventoryProviderProps) => {
  const { selectedCharacterId } = useUser();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [currentLoad, setCurrentLoad] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate current load from inventory
  const calculateCurrentLoad = useCallback((items: InventoryItem[]): number => {
    return items.reduce((total, item) => {
      return total + (item.quantity * item.slots_per_each);
    }, 0);
  }, []);

  // Update current load in database
  const updateCurrentLoadInDb = useCallback(async (characterId: string, newLoad: number) => {
    try {
      const { error: updateError } = await supabase
        .from('characters')
        .update({ current_load: newLoad })
        .eq('id', characterId);

      if (updateError) {
        logError('atualizar carga atual', updateError);
        throw updateError;
      }

      logSuccess(`Carga atualizada: ${newLoad}`);
    } catch (err) {
      logError('atualizar carga', err);
      throw err;
    }
  }, []);

  // Load inventory from database
  const loadInventory = useCallback(async (characterId: string): Promise<InventoryItem[]> => {
    try {
      const { data, error: inventoryError } = await supabase
        .from('character_items')
        .select(`
          id,
          character_id,
          item_id,
          quantity,
          items!inner (
            name,
            description,
            price,
            category,
            slots_per_each,
            attack_roll,
            damage,
            crit,
            range,
            damage_type,
            armor_bonus,
            armor_penalty,
            effect
          )
        `)
        .eq('character_id', characterId);

      if (inventoryError) {
        logError('carregar inventário', inventoryError);
        return [];
      }

      if (!data || data.length === 0) {
        logSuccess(`Inventário vazio para o personagem: ${characterId}`);
        return [];
      }

      // Transform the data to flatten the items object
      const items = (data || []).map((item: any) => {
        if (!item.items) {
          logWarning('Item sem dados relacionados');
          return null;
        }

        return {
          id: item.id,
          character_id: item.character_id,
          item_id: item.item_id,
          quantity: item.quantity,
          name: item.items.name,
          description: item.items.description,
          price: item.items.price,
          category: item.items.category,
          slots_per_each: item.items.slots_per_each,
          attack_roll: item.items.attack_roll,
          damage: item.items.damage,
          crit: item.items.crit,
          range: item.items.range,
          damage_type: item.items.damage_type,
          armor_bonus: item.items.armor_bonus,
          armor_penalty: item.items.armor_penalty,
          effect: item.items.effect,
        };
      }).filter(item => item !== null);

      logSuccess(`Inventário carregado: ${items.length} itens`);
      return items as InventoryItem[];
    } catch (err) {
      logError('carregar inventário', err);
      return [];
    }
  }, []);

  // Auto-load inventory when selectedCharacterId changes
  useEffect(() => {
    if (selectedCharacterId) {
      setLoading(true);
      setError(null);

      loadInventory(selectedCharacterId)
        .then(items => {
          setInventory(items);
          const newLoad = calculateCurrentLoad(items);
          setCurrentLoad(newLoad);
          // Update load in database
          return updateCurrentLoadInDb(selectedCharacterId, newLoad);
        })
        .catch(err => {
          setError('Erro ao carregar inventário');
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setInventory([]);
      setCurrentLoad(0);
    }
  }, [selectedCharacterId, loadInventory, calculateCurrentLoad, updateCurrentLoadInDb]);

  // Refresh inventory
  const refreshInventory = useCallback(async () => {
    if (selectedCharacterId) {
      const items = await loadInventory(selectedCharacterId);
      setInventory(items);

      const newLoad = calculateCurrentLoad(items);
      setCurrentLoad(newLoad);

      // Update load in database
      await updateCurrentLoadInDb(selectedCharacterId, newLoad);
    }
  }, [selectedCharacterId, loadInventory, calculateCurrentLoad, updateCurrentLoadInDb]);

  // Add item to inventory
  const addItemToInventory = async (itemId: string, quantity: number = 1) => {
    validateCharacterId(selectedCharacterId, 'addItemToInventory');

    await executeWithLogging(
      async () => {
        // Check if item already exists in inventory
        const { data: existingItem } = await supabase
          .from('character_items')
          .select('id, quantity')
          .eq('character_id', selectedCharacterId!)
          .eq('item_id', itemId)
          .single();

        if (existingItem) {
          // Update quantity if item exists
          await updateItemQuantity(existingItem.id, existingItem.quantity + quantity);
        } else {
          // Insert new item
          const { error: insertError } = await supabase
            .from('character_items')
            .insert({
              character_id: selectedCharacterId!,
              item_id: itemId,
              quantity,
            });

          if (insertError) throw insertError;

          // Refresh inventory (this will automatically update the load)
          await refreshInventory();
        }
      },
      'adicionar item ao inventário'
    );
  };

  // Remove item from inventory
  const removeItemFromInventory = async (characterItemId: string) => {
    validateCharacterId(selectedCharacterId, 'removeItemFromInventory');

    await executeWithLogging(
      async () => {
        const { error: deleteError } = await supabase
          .from('character_items')
          .delete()
          .eq('id', characterItemId)
          .eq('character_id', selectedCharacterId!);

        if (deleteError) throw deleteError;

        // Update local state
        const updatedInventory = inventory.filter(item => item.id !== characterItemId);
        setInventory(updatedInventory);

        // Update current load
        const newLoad = calculateCurrentLoad(updatedInventory);
        setCurrentLoad(newLoad);
        await updateCurrentLoadInDb(selectedCharacterId!, newLoad);
      },
      'remover item do inventário'
    );
  };

  // Update item quantity
  const updateItemQuantity = async (characterItemId: string, quantity: number) => {
    validateCharacterId(selectedCharacterId, 'updateItemQuantity');

    await executeWithLogging(
      async () => {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or less
          await removeItemFromInventory(characterItemId);
          return;
        }

        const { error: updateError } = await supabase
          .from('character_items')
          .update({ quantity })
          .eq('id', characterItemId)
          .eq('character_id', selectedCharacterId!);

        if (updateError) throw updateError;

        // Update local state
        const updatedInventory = inventory.map(item =>
          item.id === characterItemId ? { ...item, quantity } : item
        );

        setInventory(updatedInventory);

        // Update current load
        const newLoad = calculateCurrentLoad(updatedInventory);
        setCurrentLoad(newLoad);
        await updateCurrentLoadInDb(selectedCharacterId!, newLoad);
      },
      'atualizar quantidade do item'
    );
  };

  const value = {
    inventory,
    currentLoad,
    loading,
    error,
    addItemToInventory,
    removeItemFromInventory,
    updateItemQuantity,
    refreshInventory,
    calculateCurrentLoad,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};
