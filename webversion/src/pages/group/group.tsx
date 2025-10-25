import { useState, useEffect } from 'react';
import Navbar from '../../components/navbar/navbar';
import GroupChest from '../../components/groupChest/groupChest';
import GroupCurrency from '../../components/currency/GroupCurrency';
import Modal from '../../components/modal/modal';
import GroupForm from '../../components/modal/forms/GroupForm';
import type { GroupFormData } from '../../components/modal/forms/GroupForm';
import { useCharacter } from '../../contexts/CharacterContext';
import { supabase } from '../../config/supabase';
import './group.css';


interface AvailableGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  maxMembers: number;
  levelRange: string;
  createdBy: string;
  isPrivate: boolean;
}

interface GroupData {
  id: string;
  name: string;
  description: string | null;
  gold: number;
  silver: number;
  bronze: number;
  created_at: string;
  updated_at: string;
}

interface GroupMember {
  id: string;
  group_id: string;
  character_id: string;
  role: string;
  joined_at: string;
  character?: {
    id: string;
    name: string;
    class: string;
    race: string;
    level: number;
    current_health: number;
    max_health: number;
    profile_img: string | null;
  };
}

const Group = () => {
  const { character } = useCharacter();
  const [isInGroup, setIsInGroup] = useState<boolean>(false);
  const [availableGroups, setAvailableGroups] = useState<AvailableGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentGroup, setCurrentGroup] = useState<GroupData | null>(null);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [isJoiningGroup, setIsJoiningGroup] = useState(false);
  const [joinMessage, setJoinMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [groupChestItems, setGroupChestItems] = useState<any[]>([]);
  const [groupStorageId, setGroupStorageId] = useState<string | null>(null);

  // Verificar se o personagem está em um grupo e carregar grupos disponíveis
  useEffect(() => {
    const checkGroupMembership = async () => {
      if (!character) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Verificar se o personagem está em algum grupo
        const { data: membershipData, error: membershipError } = await supabase
          .from('group_members')
          .select(`
            *,
            groups:group_id (
              id,
              name,
              description,
              gold,
              silver,
              bronze,
              created_at,
              updated_at
            )
          `)
          .eq('character_id', character.id)
          .single();

        if (membershipError && membershipError.code !== 'PGRST116') {
          throw membershipError;
        }

        if (membershipData) {
          // Personagem está em um grupo
          setIsInGroup(true);
          setCurrentGroup(membershipData.groups);
          
          // Carregar membros do grupo
          const { data: membersData, error: membersError } = await supabase
            .from('group_members')
            .select(`
              *,
              character:character_id (
                id,
                name,
                class,
                race,
                level,
                current_health,
                max_health,
                profile_img
              )
            `)
            .eq('group_id', membershipData.group_id);

          if (membersError) {
            throw membersError;
          }

          setGroupMembers(membersData || []);
        } else {
          // Personagem não está em grupo - carregar grupos disponíveis
          setIsInGroup(false);
          
          const { data: groupsData, error: groupsError } = await supabase
            .from('groups')
            .select(`
              *,
              group_members (
                id,
                character_id
              )
            `);

          if (groupsError) {
            throw groupsError;
          }

          // Transformar dados dos grupos para o formato da interface
          const availableGroupsData: AvailableGroup[] = (groupsData || []).map(group => {
            const memberCount = group.group_members?.length || 0;
            const maxMembers = 6; // Valor padrão, pode ser configurável no futuro
            
            return {
              id: group.id,
              name: group.name,
              description: group.description || '',
              memberCount,
              maxMembers,
              levelRange: '1-20', // Valor padrão, pode ser calculado baseado nos membros
              createdBy: 'Sistema', // Pode ser obtido do criador do grupo
              isPrivate: false // Por enquanto todos são públicos
            };
          });

          setAvailableGroups(availableGroupsData);
        }
      } catch (error) {
        console.error('Erro ao verificar grupos:', error);
        setError('Erro ao carregar dados dos grupos');
      } finally {
        setLoading(false);
      }
    };

    checkGroupMembership();
  }, [character]);

  // Load group storage items when in a group
  useEffect(() => {
    const loadGroupStorage = async () => {
      if (!currentGroup) {
        setGroupChestItems([]);
        setGroupStorageId(null);
        return;
      }

      try {
        // Get or create group storage
        let { data: storageData, error: storageError } = await supabase
          .from('group_storage')
          .select('*')
          .eq('group_id', currentGroup.id)
          .single();

        if (storageError && storageError.code === 'PGRST116') {
          // Storage doesn't exist, create it
          const { data: newStorage, error: createError } = await supabase
            .from('group_storage')
            .insert({
              group_id: currentGroup.id,
              name: 'Baú do Grupo',
              location: 'Base',
              description: 'Armazenamento compartilhado do grupo'
            })
            .select()
            .single();

          if (createError) throw createError;
          storageData = newStorage;
        } else if (storageError) {
          throw storageError;
        }

        if (storageData) {
          setGroupStorageId(storageData.id);

          // Load items from group storage
          const { data: itemsData, error: itemsError } = await supabase
            .from('group_storage_items')
            .select(`
              id,
              quantity,
              items:item_id (
                id,
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
            .eq('storage_id', storageData.id);

          if (itemsError) throw itemsError;

          // Transform the data to match our interface
          const transformedItems = (itemsData || []).map((storageItem: any) => ({
            id: storageItem.id,
            name: storageItem.items.name,
            description: storageItem.items.description || '',
            quantity: storageItem.quantity,
            slots: storageItem.items.slots_per_each,
            price: storageItem.items.price,
            category: storageItem.items.category,
            attack_roll: storageItem.items.attack_roll,
            damage: storageItem.items.damage,
            crit: storageItem.items.crit,
            range: storageItem.items.range,
            damage_type: storageItem.items.damage_type,
            armor_bonus: storageItem.items.armor_bonus,
            armor_penalty: storageItem.items.armor_penalty,
            effect: storageItem.items.effect,
          }));

          setGroupChestItems(transformedItems);
        }
      } catch (err) {
        console.error('Error loading group storage:', err);
      }
    };

    loadGroupStorage();
  }, [currentGroup]);



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return '#4ecca3';
      case 'injured':
        return '#f4a261';
      case 'critical':
        return '#e94560';
      case 'unconscious':
        return '#6c757d';
      default:
        return '#fff';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'Saudável';
      case 'injured':
        return 'Ferido';
      case 'critical':
        return 'Crítico';
      case 'unconscious':
        return 'Inconsciente';
      default:
        return status;
    }
  };



  // Group chest item handlers
  const handleAddChestItem = async (item: any) => {
    if (!groupStorageId) return;
    
    try {
      // Create the item in the items table
      const itemData: any = {
        name: item.name,
        description: item.description || null,
        price: item.price || 0,
        category: item.category || 'misc',
        slots_per_each: item.slots || 0,
      };

      // Add category-specific fields
      if (item.attack_roll) itemData.attack_roll = item.attack_roll;
      if (item.damage) itemData.damage = item.damage;
      if (item.crit) itemData.crit = item.crit;
      if (item.range) itemData.range = item.range;
      if (item.damage_type) itemData.damage_type = item.damage_type;
      if (item.armor_bonus !== undefined) itemData.armor_bonus = item.armor_bonus;
      if (item.armor_penalty !== undefined) itemData.armor_penalty = item.armor_penalty;
      if (item.effect) itemData.effect = item.effect;

      const { data: newItem, error: itemError } = await supabase
        .from('items')
        .insert(itemData)
        .select()
        .single();

      if (itemError) throw itemError;

      // Add to group storage
      const { error: storageError } = await supabase
        .from('group_storage_items')
        .insert({
          storage_id: groupStorageId,
          item_id: newItem.id,
          quantity: item.quantity
        });

      if (storageError) throw storageError;

      // Reload items
      const loadGroupStorage = async () => {
        const { data: itemsData, error } = await supabase
          .from('group_storage_items')
          .select(`
            id,
            quantity,
            items:item_id (
              id,
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
          .eq('storage_id', groupStorageId);

        if (error) throw error;

        const transformedItems = (itemsData || []).map((storageItem: any) => ({
          id: storageItem.id,
          name: storageItem.items.name,
          description: storageItem.items.description || '',
          quantity: storageItem.quantity,
          slots: storageItem.items.slots_per_each,
          price: storageItem.items.price,
          category: storageItem.items.category,
          attack_roll: storageItem.items.attack_roll,
          damage: storageItem.items.damage,
          crit: storageItem.items.crit,
          range: storageItem.items.range,
          damage_type: storageItem.items.damage_type,
          armor_bonus: storageItem.items.armor_bonus,
          armor_penalty: storageItem.items.armor_penalty,
          effect: storageItem.items.effect,
        }));

        setGroupChestItems(transformedItems);
      };

      loadGroupStorage();
    } catch (err) {
      console.error('Error adding chest item:', err);
    }
  };

  const handleEditChestItem = (itemId: string) => {
    console.log('Editar item do baú:', itemId);
    // TODO: Implementar modal de edição de item
  };

  const handleDeleteChestItem = async (itemId: string) => {
    if (!confirm('Tem certeza que deseja deletar este item?')) return;
    
    try {
      const { error } = await supabase
        .from('group_storage_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      // Remove from state
      setGroupChestItems(prev => prev.filter(item => item.id !== itemId));
    } catch (err) {
      console.error('Error deleting chest item:', err);
    }
  };

  const handleMoveToInventory = (itemId: string) => {
    console.log('Mover item para o inventário:', itemId);
    // TODO: Implementar lógica de movimentação de item
  };

  const handleSellChestItem = (itemId: string) => {
    console.log('Vender item do baú:', itemId);
    // TODO: Implementar lógica de venda de item
  };

  const handleConsumeChestItem = async (itemId: string) => {
    try {
      const item = groupChestItems.find(i => i.id === itemId);
      if (!item) return;

      const newQuantity = item.quantity - 1;

      if (newQuantity <= 0) {
        // Delete item if quantity becomes 0
        await handleDeleteChestItem(itemId);
      } else {
        // Update quantity
        const { error } = await supabase
          .from('group_storage_items')
          .update({ quantity: newQuantity })
          .eq('id', itemId);

        if (error) throw error;

        // Update state
        setGroupChestItems(prev =>
          prev.map(i => (i.id === itemId ? { ...i, quantity: newQuantity } : i))
        );
      }
    } catch (err) {
      console.error('Error consuming chest item:', err);
    }
  };

  const handleUpdateChestItemQuantity = async (itemId: string, newQuantity: number) => {
    try {
      const { error } = await supabase
        .from('group_storage_items')
        .update({ quantity: newQuantity })
        .eq('id', itemId);

      if (error) throw error;

      // Update state
      setGroupChestItems(prev =>
        prev.map(i => (i.id === itemId ? { ...i, quantity: newQuantity } : i))
      );
    } catch (err) {
      console.error('Error updating chest item quantity:', err);
    }
  };

  const handleChestArrowsChange = (newValue: number) => {
    console.log('Flechas do baú alteradas:', newValue);
    // TODO: Implementar lógica de atualização de flechas do grupo
  };

  const handleChestBulletsChange = (newValue: number) => {
    console.log('Balas do baú alteradas:', newValue);
    // TODO: Implementar lógica de atualização de balas do grupo
  };

  // Função para atualizar as moedas do grupo
  const handleUpdateGroupCurrency = async (newGold: number, newSilver: number, newBronze: number) => {
    if (!currentGroup) return;

    try {
      const { error } = await supabase
        .from('groups')
        .update({
          gold: newGold,
          silver: newSilver,
          bronze: newBronze,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentGroup.id);

      if (error) {
        throw error;
      }

      // Atualizar o estado local
      setCurrentGroup(prev => prev ? {
        ...prev,
        gold: newGold,
        silver: newSilver,
        bronze: newBronze
      } : null);

      console.log('✅ Moedas do grupo atualizadas com sucesso!');
    } catch (err) {
      console.error('❌ Erro ao atualizar moedas do grupo:', err);
      throw err;
    }
  };

  // Funções para gerenciar grupos
  const handleCreateGroup = () => {
    setIsCreateGroupModalOpen(true);
  };

  const handleCloseCreateGroupModal = () => {
    setIsCreateGroupModalOpen(false);
  };

  const handleSubmitGroup = async (data: GroupFormData) => {
    if (!character) {
      alert('Erro: Personagem não encontrado');
      return;
    }

    try {
      // Criar o grupo no banco de dados
      const { data: newGroup, error: groupError } = await supabase
        .from('groups')
        .insert({
          name: data.name,
          description: data.description || null,
          gold: data.gold || 0,
          silver: data.silver || 0,
          bronze: data.bronze || 0,
        })
        .select()
        .single();

      if (groupError) {
        throw groupError;
      }

      if (!newGroup) {
        throw new Error('Grupo não foi criado');
      }

      // Adicionar o personagem ao grupo como membro
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: newGroup.id,
          character_id: character.id,
          role: 'leader', // O criador do grupo é o líder
        });

      if (memberError) {
        // Se falhar ao adicionar membro, deletar o grupo criado
        await supabase.from('groups').delete().eq('id', newGroup.id);
        throw memberError;
      }

      // Atualizar a interface
      setIsInGroup(true);
      setCurrentGroup(newGroup);
      setAvailableGroups([]);
      handleCloseCreateGroupModal();

      // Recarregar os dados para atualizar a interface
      window.location.reload();
    } catch (err) {
      console.error('Erro ao criar grupo:', err);
      alert('Erro ao criar grupo. Tente novamente.');
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    if (!character) {
      setJoinMessage({type: 'error', text: 'Erro: Personagem não encontrado'});
      return;
    }

    setIsJoiningGroup(true);
    setJoinMessage(null);

    try {
      // Verificar se o grupo ainda tem vagas
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .select(`
          *,
          group_members (
            id,
            character_id
          )
        `)
        .eq('id', groupId)
        .single();

      if (groupError) {
        throw groupError;
      }

      if (!groupData) {
        setJoinMessage({type: 'error', text: 'Grupo não encontrado'});
        return;
      }

      const memberCount = groupData.group_members?.length || 0;
      const maxMembers = 6; // Valor padrão, pode ser configurável no futuro

      if (memberCount >= maxMembers) {
        setJoinMessage({type: 'error', text: 'Este grupo já está cheio!'});
        return;
      }

      // Verificar se o personagem já está em algum grupo
      const { data: existingMembership, error: membershipError } = await supabase
        .from('group_members')
        .select('id')
        .eq('character_id', character.id)
        .single();

      if (membershipError && membershipError.code !== 'PGRST116') {
        throw membershipError;
      }

      if (existingMembership) {
        setJoinMessage({type: 'error', text: 'Você já está em um grupo! Deixe o grupo atual antes de entrar em outro.'});
        return;
      }

      // Adicionar o personagem ao grupo
      const { error: joinError } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
          character_id: character.id,
          role: 'member', // Novo membro tem role 'member'
        });

      if (joinError) {
        throw joinError;
      }

      // Atualizar a interface
      setJoinMessage({type: 'success', text: 'Você entrou no grupo com sucesso!'});
      
      // Recarregar a página após um pequeno delay para mostrar a mensagem
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (err) {
      console.error('Erro ao entrar no grupo:', err);
      setJoinMessage({type: 'error', text: 'Erro ao entrar no grupo. Tente novamente.'});
    } finally {
      setIsJoiningGroup(false);
    }
  };

  if (loading) {
    return (
      <div className="with-navbar">
        <Navbar showBackButton={true} />
        <div className="group-container">
          <div className="group-content">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Carregando grupos...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="with-navbar">
        <Navbar showBackButton={true} />
        <div className="group-container">
          <div className="group-content">
            <div className="error-container">
              <div className="error-icon">⚠️</div>
              <h3>Erro ao carregar grupos</h3>
              <p>{error}</p>
              <button 
                className="retry-btn"
                onClick={() => window.location.reload()}
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="with-navbar">
      <Navbar showBackButton={true} />
      <Modal
        isOpen={isCreateGroupModalOpen}
        onClose={handleCloseCreateGroupModal}
        title="Criar Novo Grupo"
        size="medium"
      >
        <GroupForm
          onSubmit={handleSubmitGroup}
          onCancel={handleCloseCreateGroupModal}
        />
      </Modal>
      <div className="group-container">
        <div className="group-content">
          {isInGroup ? (
            // Interface quando o personagem está em um grupo
            <>
              <div className="group-header">
                <h1 className="group-title">{currentGroup?.name || 'Grupo de Aventureiros'}</h1>
                <div className="group-stats">
                  <div className="stat-item">
                    <span className="stat-label">Membros:</span>
                    <span className="stat-value">{groupMembers.length}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Nível Médio:</span>
                    <span className="stat-value">
                      {groupMembers.length > 0 
                        ? Math.round(groupMembers.reduce((acc, m) => acc + (m.character?.level || 0), 0) / groupMembers.length)
                        : 0
                      }
                    </span>
                  </div>
                </div>
              </div>

              <div className="party-members-grid">
                {groupMembers.map(member => {
                  const character = member.character;
                  if (!character) return null;
                  
                  const hpPercentage = character.max_health > 0 
                    ? (character.current_health / character.max_health) * 100 
                    : 0;
                  
                  const status = hpPercentage > 75 ? 'healthy' : 
                                hpPercentage > 50 ? 'injured' : 
                                hpPercentage > 25 ? 'critical' : 'unconscious';
                  
                  return (
                    <div key={member.id} className="member-card">
                      <div className="member-header">
                        <div className="member-avatar">
                          {character.profile_img ? (
                            <img src={character.profile_img} alt={character.name} />
                          ) : (
                            <div className="avatar-placeholder">
                              {character.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="member-info">
                          <h3 className="member-name">{character.name}</h3>
                          <p className="member-details">
                            {character.race} {character.class} - Nível {character.level}
                          </p>
                        </div>
                      </div>

                      <div className="member-hp-section">
                        <div className="hp-header">
                          <span className="hp-label">Pontos de Vida</span>
                          <span className="hp-values">
                            {character.current_health} / {character.max_health}
                          </span>
                        </div>
                        <div className="hp-bar">
                          <div 
                            className="hp-fill"
                            style={{
                              width: `${hpPercentage}%`,
                              backgroundColor: getStatusColor(status)
                            }}
                          />
                        </div>
                      </div>

                      <div className="member-status">
                        <span 
                          className="status-badge"
                          style={{
                            backgroundColor: `${getStatusColor(status)}20`,
                            color: getStatusColor(status),
                            borderColor: getStatusColor(status)
                          }}
                        >
                          {getStatusLabel(status)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {currentGroup && (
                <GroupCurrency
                  groupId={currentGroup.id}
                  gold={currentGroup.gold}
                  silver={currentGroup.silver}
                  bronze={currentGroup.bronze}
                  onUpdateCurrency={handleUpdateGroupCurrency}
                />
              )}

              <GroupChest 
                arrows={150}
                bullets={80}
                items={groupChestItems}
                onAddItem={handleAddChestItem}
                onEditItem={handleEditChestItem}
                onDeleteItem={handleDeleteChestItem}
                onMoveToInventory={handleMoveToInventory}
                onSellItem={handleSellChestItem}
                onConsumeItem={handleConsumeChestItem}
                onArrowsChange={handleChestArrowsChange}
                onBulletsChange={handleChestBulletsChange}
                onUpdateItemQuantity={handleUpdateChestItemQuantity}
              />
            </>
          ) : (
            // Interface quando o personagem não está em um grupo
            <>
              <div className="group-header">
                <h1 className="group-title">Grupos Disponíveis</h1>
                <button 
                  className="create-group-btn"
                  onClick={handleCreateGroup}
                >
                  <span className="btn-icon">+</span>
                  Criar Grupo
                </button>
              </div>

              <div className="available-groups-container">
                {joinMessage && (
                  <div className={`join-message ${joinMessage.type}`}>
                    <span className="message-icon">
                      {joinMessage.type === 'success' ? '✅' : '❌'}
                    </span>
                    <span className="message-text">{joinMessage.text}</span>
                  </div>
                )}
                
                <div className="groups-grid">
                  {availableGroups.map(group => (
                    <div key={group.id} className="group-card">
                      <div className="group-card-header">
                        <div className="group-info">
                          <h3 className="group-name">{group.name}</h3>
                          <p className="group-description">{group.description}</p>
                        </div>
                        <div className="group-badges">
                          {group.isPrivate && (
                            <span className="private-badge">Privado</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="group-details">
                        <div className="group-stat">
                          <span className="stat-label">Membros:</span>
                          <span className="stat-value">{group.memberCount}/{group.maxMembers}</span>
                        </div>
                        <div className="group-stat">
                          <span className="stat-label">Nível:</span>
                          <span className="stat-value">{group.levelRange}</span>
                        </div>
                        <div className="group-stat">
                          <span className="stat-label">Criado por:</span>
                          <span className="stat-value">{group.createdBy}</span>
                        </div>
                      </div>

                      <div className="group-actions">
                        <button 
                          className="join-group-btn"
                          onClick={() => handleJoinGroup(group.id)}
                          disabled={group.memberCount >= group.maxMembers || isJoiningGroup}
                        >
                          {isJoiningGroup ? 'Entrando...' : 
                           group.memberCount >= group.maxMembers ? 'Grupo Cheio' : 'Entrar em Grupo'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {availableGroups.length === 0 && (
                  <div className="no-groups-message">
                    <div className="no-groups-icon">🏰</div>
                    <h3>Nenhum grupo disponível</h3>
                    <p>Seja o primeiro a criar um grupo de aventureiros!</p>
                    <button 
                      className="create-group-btn primary"
                      onClick={handleCreateGroup}
                    >
                      <span className="btn-icon">+</span>
                      Criar Primeiro Grupo
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Group;

