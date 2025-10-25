import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { useUser } from '../../contexts/UserContext';
import { useCharacter } from '../../contexts/CharacterContext';
import Navbar from '../../components/navbar/navbar';
import ProfileHeader from '../../components/profileHeader/profileHeader';
import Description from '../../components/description/description';
import ActionButtons from '../../components/actionButtons/actionButtons';
import Currency from '../../components/currency/currency';
import Backpack from '../../components/backpack/backpack';
import Proficiencies from '../../components/proficiencies/proficiencies';
import './profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { characterId } = useParams<{ characterId: string }>();
  const { setSelectedCharacterId } = useUser();
  const {
    character,
    loading,
    error,
    updateDescription,
    updateProficienciesAndHabilities,
    updateMaxInventorySlots,
    addItemToInventory,
    updateItemQuantity,
    addTransaction,
    deleteTransaction,
  } = useCharacter();

  // Set the selected character when the component mounts
  useEffect(() => {
    if (characterId) {
      setSelectedCharacterId(characterId);
    }
  }, [characterId, setSelectedCharacterId]);

  const handleDescriptionChange = async (value: string) => {
    console.log('Description changed:', value);
    try {
      await updateDescription(value);
    } catch (err) {
      console.error('Erro ao atualizar descrição:', err);
    }
  };

  const handleProficienciesChange = async (value: string) => {
    console.log('Proficiencies changed:', value);
    try {
      await updateProficienciesAndHabilities(value);
    } catch (err) {
      console.error('Erro ao atualizar proficiências:', err);
    }
  };


  const handleNotesClick = () => {
    navigate('/notes');
  };

  const handleBackstoryClick = () => {
    navigate('/backstory');
  };

  const handleOptionsClick = () => {
    console.log('Options button clicked');
  };

  const handleSelectCharacter = () => {
    navigate('/');
  };

  // Backpack item handlers
  const handleEditItem = (itemId: string) => {
    console.log('Editar item:', itemId);
    // TODO: Implementar modal de edição de item
  };

  const handleDeleteItem = (itemId: string) => {
    console.log('Deletar item:', itemId);
    // TODO: Implementar confirmação e remoção do item
  };

  const handleMoveToChest = (itemId: string) => {
    console.log('Mover item para o baú do grupo:', itemId);
    // TODO: Implementar lógica de movimentação de item
  };

  const handleSellItem = (itemId: string) => {
    console.log('Vender item:', itemId);
    // TODO: Implementar lógica de venda de item
  };

  const handleConsumeItem = async (itemId: string) => {
    console.log('Consumir item:', itemId);
    
    try {
      // Encontrar o item no inventário
      const item = character?.inventory?.find(inv => inv.id === itemId);
      
      if (!item) {
        console.error('Item não encontrado no inventário');
        return;
      }
      
      // Diminuir a quantidade em 1
      const newQuantity = item.quantity - 1;
      
      // Atualizar a quantidade (se for 0, será removido automaticamente)
      await updateItemQuantity(itemId, newQuantity);
      
      console.log(`Item ${item.name} consumido. Nova quantidade: ${newQuantity}`);
    } catch (err) {
      console.error('Erro ao consumir item:', err);
      // TODO: Mostrar mensagem de erro para o usuário
    }
  };

  const handleMaxCapacityChange = async (newValue: number) => {
    console.log('Capacidade máxima alterada:', newValue);
    try {
      await updateMaxInventorySlots(newValue);
    } catch (err) {
      console.error('Erro ao atualizar capacidade máxima:', err);
      // TODO: Mostrar mensagem de erro para o usuário
    }
  };

  const handleUpdateItemQuantity = async (itemId: string, newQuantity: number) => {
    console.log('Atualizando quantidade do item:', itemId, 'para:', newQuantity);
    try {
      await updateItemQuantity(itemId, newQuantity);
    } catch (err) {
      console.error('Erro ao atualizar quantidade do item:', err);
      // TODO: Mostrar mensagem de erro para o usuário
    }
  };

  const handleAddItem = async (item: any) => {
    console.log('Adicionando item:', item);
    
    try {
      // Preparar os dados do item, incluindo campos específicos da categoria
      const itemData: any = {
        name: item.name,
        description: item.description || null,
        price: item.price || 0,
        category: item.category || 'misc',
        slots_per_each: item.slots,
      };

      // Adicionar campos específicos da categoria (se existirem)
      if (item.attack_roll) itemData.attack_roll = item.attack_roll;
      if (item.damage) itemData.damage = item.damage;
      if (item.crit) itemData.crit = item.crit;
      if (item.range) itemData.range = item.range;
      if (item.damage_type) itemData.damage_type = item.damage_type;
      if (item.armor_bonus !== undefined) itemData.armor_bonus = item.armor_bonus;
      if (item.armor_penalty !== undefined) itemData.armor_penalty = item.armor_penalty;
      if (item.effect) itemData.effect = item.effect;

      // Primeiro, criar o item na tabela items
      const { data: newItem, error: itemError } = await supabase
        .from('items')
        .insert(itemData)
        .select()
        .single();

      if (itemError) throw itemError;

      // Depois, adicionar ao inventário do personagem
      if (newItem) {
        await addItemToInventory(newItem.id, item.quantity);
        console.log('Item adicionado com sucesso!');
      }
    } catch (err) {
      console.error('Erro ao adicionar item:', err);
      // TODO: Mostrar mensagem de erro para o usuário
    }
  };


  if (loading) {
    return (
      <div className="with-navbar">
        <Navbar />
        <div className="profile-container">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Carregando personagem...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="with-navbar">
        <Navbar />
        <div className="profile-container">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: 'red' }}>{error || 'Personagem não encontrado'}</p>
            <button onClick={() => navigate('/')}>Voltar para Home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="with-navbar">
      <Navbar />
      <div className="profile-container">
        <ProfileHeader 
          username={character.name}
          level={character.level}
          classe={character.class}
          raca={character.race}
          divindade={character.deity}
          origem={character.origin}
          size={character.size}
          movement={character.movement || '6 quadrados'}
          profileImage={character.profile_img || undefined}
          backgroundImage={character.background_img || undefined}
          onOptionsClick={handleOptionsClick}
          onSelectCharacter={handleSelectCharacter}
        />
        <ActionButtons 
          onNotesClick={handleNotesClick}
          onBackstoryClick={handleBackstoryClick}
        />
        
        <div className="profile-content-row">
          <Description 
            placeholder="Tell us about your character..."
            onChange={handleDescriptionChange}
            initialValue={character.description || ''}
          />
          <Proficiencies
            onChange={handleProficienciesChange}
            initialValue={character.proficiencies_and_habilities || ''}
          />
        </div>
        
        <Currency
          transactions={character.transactions}
          onAddTransaction={addTransaction}
          onDeleteTransaction={deleteTransaction}
          characterId={character.id}
        />
        
        <Backpack 
          maxCapacity={character.max_inventory_slots}
          currentLoad={character.current_load}
          items={(character.inventory || []).map(item => ({
            id: item.id,
            name: item.name,
            description: item.description,
            quantity: item.quantity,
            slots: item.slots_per_each,
            price: item.price,
            category: item.category,
            effect: item.effect,
            // Campos específicos de armas
            attack_roll: item.attack_roll,
            damage: item.damage,
            crit: item.crit,
            range: item.range,
            damage_type: item.damage_type,
            // Campos específicos de armadura
            armor_bonus: item.armor_bonus,
            armor_penalty: item.armor_penalty,
          }))}
          onAddItem={handleAddItem}
          onEditItem={handleEditItem}
          onDeleteItem={handleDeleteItem}
          onMoveToChest={handleMoveToChest}
          onSellItem={handleSellItem}
          onConsumeItem={handleConsumeItem}
          onMaxCapacityChange={handleMaxCapacityChange}
          onUpdateItemQuantity={handleUpdateItemQuantity}
        />
      </div>
    </div>
  );
};

export default Profile;

