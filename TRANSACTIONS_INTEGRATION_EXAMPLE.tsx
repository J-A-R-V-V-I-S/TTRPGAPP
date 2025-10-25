// ==================================
// EXEMPLO DE INTEGRAÇÃO NO PROFILE
// ==================================

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
import TransactionHistory from '../../components/transactionHistory/transactionHistory'; // 👈 NOVO IMPORT
import type { TransactionFormData } from '../../components/modal'; // 👈 NOVO IMPORT
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
    updateCurrency,
    updateMaxInventorySlots,
    addItemToInventory,
    addTransaction,        // 👈 NOVO
    deleteTransaction,     // 👈 NOVO
  } = useCharacter();

  // ... código existente ...

  // 👇 NOVA FUNÇÃO: Adicionar Transação
  const handleAddTransaction = async (data: TransactionFormData) => {
    if (!character) return;
    
    try {
      await addTransaction({
        ...data,
        character_id: character.id,
      });
      console.log('✅ Transação registrada com sucesso!');
      // Opcional: Mostrar notificação de sucesso
    } catch (err) {
      console.error('❌ Erro ao registrar transação:', err);
      // Opcional: Mostrar notificação de erro
    }
  };

  // 👇 NOVA FUNÇÃO: Excluir Transação
  const handleDeleteTransaction = async (transactionId: string) => {
    try {
      await deleteTransaction(transactionId);
      console.log('✅ Transação excluída e moedas revertidas!');
      // Opcional: Mostrar notificação de sucesso
    } catch (err) {
      console.error('❌ Erro ao excluir transação:', err);
      // Opcional: Mostrar notificação de erro
    }
  };

  // ... resto do código ...

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
          profileImage={character.profile_img || undefined}
          backgroundImage={character.background_img || undefined}
          onOptionsClick={handleOptionsClick}
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
          initialGold={character.gold}
          initialSilver={character.silver}
          initialBronze={character.bronze}
          onCurrencyChange={handleCurrencyChange}
        />
        
        <Backpack 
          arrows={character.arrows}
          bullets={character.bullets}
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
          }))}
          onAddItem={handleAddItem}
          onEditItem={handleEditItem}
          onDeleteItem={handleDeleteItem}
          onMoveToChest={handleMoveToChest}
          onSellItem={handleSellItem}
          onConsumeItem={handleConsumeItem}
          onArrowsChange={handleArrowsChange}
          onBulletsChange={handleBulletsChange}
          onMaxCapacityChange={handleMaxCapacityChange}
        />

        {/* 👇 NOVO COMPONENTE: Histórico de Transações */}
        <TransactionHistory
          transactions={character.transactions || []}
          onAddTransaction={handleAddTransaction}
          onDeleteTransaction={handleDeleteTransaction}
        />
      </div>
    </div>
  );
};

export default Profile;

