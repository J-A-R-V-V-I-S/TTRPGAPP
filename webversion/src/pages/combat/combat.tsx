import { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from '../../components/navbar/navbar';
import HealthBar from '../../components/healthBar/healthBar';
import ManaBar from '../../components/manaBar/manaBar';
import DefenseBar from '../../components/defenseBar/defenseBar';
import Modal from '../../components/modal/modal';
import AttackForm from '../../components/modal/forms/AttackForm';
import SpellForm from '../../components/modal/forms/SpellForm';
import AbilityForm from '../../components/modal/forms/AbilityForm';
import type { AttackFormData } from '../../components/modal/forms/AttackForm';
import type { SpellFormData } from '../../components/modal/forms/SpellForm';
import type { AbilityFormData } from '../../components/modal/forms/AbilityForm';
import { useCharacter } from '../../contexts/CharacterContext';
import { useCombat } from '../../contexts/CombatContext';
import AttacksList from '../../components/AttacksList/AttacksList';
import SpellsList from '../../components/SpellsList/SpellsList';
import SpellDetails from '../../components/SpellDetails/SpellDetails';
import AprimoramentoForm from '../../components/AprimoramentoForm/AprimoramentoForm';
import SkillsSection from '../../components/SkillsSection/SkillsSection';
import { generateSkillsTabData } from '../../utils/combatHelpers';
import './combat.css';

type TabType = 'attacks' | 'spells';
type AbilityTabType = 'abilities' | 'powers';

interface Attack {
  id: string;
  name: string;
  type: string;
  testeAtaque: string;
  damage: string;
  critico: string;
  range: string;
  description: string;
}

interface Aprimoramento {
  id: string;
  custoAdicionalPM: number;
  reaplicavel: boolean;
  descricao: string;
  aplicacoes: number;
}

interface Spell {
  id: string;
  name: string;
  escola: string;
  execucao: string;
  alcance: string;
  area?: string;
  duracao: string;
  resistencia: string;
  efeito?: string;
  aprimoramentos: Aprimoramento[];
}



const Combat = () => {
  const {
    character,
    updateHealth,
    updateMana,
    updateDefenseArmorBonus,
    updateDefenseAttributeBonus,
    updateDefenseOther,
  } = useCharacter();

  const {
    attacks,
    spells,
    abilities,
    powers,
    addAttack,
    updateAttack,
    deleteAttack,
    addSpell,
    updateSpell,
    deleteSpell,
    addSpellEnhancement,
    updateSpellEnhancement,
    deleteSpellEnhancement,
    addAbility,
    updateAbility,
    deleteAbility,
    addPower,
    updatePower,
    deletePower
  } = useCombat();
  const [activeTab, setActiveTab] = useState<TabType>('attacks');

  // Menu states
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Modal states
  const [attackModalOpen, setAttackModalOpen] = useState(false);
  const [spellModalOpen, setSpellModalOpen] = useState(false);
  const [abilityModalOpen, setAbilityModalOpen] = useState(false);
  const [powerModalOpen, setPowerModalOpen] = useState(false);

  // Edit states
  const [editingAttack, setEditingAttack] = useState<Attack | null>(null);
  const [editingSpell, setEditingSpell] = useState<Spell | null>(null);
  const [editingAbility, setEditingAbility] = useState<any>(null);
  const [editingPower, setEditingPower] = useState<any>(null);
  
  // Force refresh for TabbedItemList
  const [tabbedListRefreshKey, setTabbedListRefreshKey] = useState(0);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (openMenuId) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openMenuId]);

  // Handlers for health and mana updates
  const handleHpChange = async (newHp: number) => {
    if (character) {
      // Allow negative HP values for unconscious/dying characters
      await updateHealth(newHp, character.max_health, character.temporary_health);
    }
  };

  const handleTempHpChange = async (newTempHp: number) => {
    if (character) {
      await updateHealth(character.current_health, character.max_health, newTempHp);
    }
  };

  const handleManaChange = async (newMana: number) => {
    if (character) {
      await updateMana(newMana, character.max_mana, character.temporary_mana);
    }
  };

  // Attacks, spells, abilities, and powers now come from useCombat() hook

  const [selectedAttack, setSelectedAttack] = useState<Attack | null>(null);
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);
  const [showAprimoramentoForm, setShowAprimoramentoForm] = useState(false);
  const [currentSpellId, setCurrentSpellId] = useState<string>('');
  const [newAprimoramentoData, setNewAprimoramentoData] = useState({
    custoAdicionalPM: 1,
    reaplicavel: false,
    descricao: ''
  });
  
  // Estado local para gerenciar aplicações dos aprimoramentos
  const [aprimoramentoApplications, setAprimoramentoApplications] = useState<Record<string, number>>({});

  const toggleSpellPrepared = (spellId: string) => {
    /**
     * FUTURE ENHANCEMENT: Spell Preparation System
     *
     * D&D mechanic where spellcasters prepare a limited number of spells per day.
     * Implementation requires:
     * - Add 'prepared' boolean field to character_spells table
     * - Add max_prepared_spells calculation based on class/level
     * - UI toggle for marking spells as prepared
     * - Validation to prevent over-preparation
     *
     * Complexity: Medium | Priority: Low
     * Tracked in: Future backlog
     */
    console.log('Toggle spell prepared:', spellId);
  };

  const handleUpdateAttackField = async (attackId: string, field: keyof Attack, newValue: string) => {
    try {
      await updateAttack(attackId, { [field]: newValue });
    } catch (error) {
      console.error('Erro ao atualizar ataque:', error);
    }
  };

  const handleUpdateSpellField = async (spellId: string, field: keyof Spell, newValue: string | boolean) => {
    try {
      await updateSpell(spellId, { [field]: newValue });
    } catch (error) {
      console.error('Erro ao atualizar magia:', error);
    }
  };

  const handleAddAprimoramento = (spellId: string) => {
    setCurrentSpellId(spellId);
    setNewAprimoramentoData({
      custoAdicionalPM: 1,
      reaplicavel: false,
      descricao: ''
    });
    setShowAprimoramentoForm(true);
  };

  const handleCreateAprimoramento = async () => {
    try {
      await addSpellEnhancement(currentSpellId, {
        custoAdicionalPM: newAprimoramentoData.custoAdicionalPM,
        reaplicavel: newAprimoramentoData.reaplicavel,
        descricao: newAprimoramentoData.descricao || 'Novo aprimoramento',
        aplicacoes: 0 // Sempre começa com 0 aplicações
      });
      setShowAprimoramentoForm(false);
      setCurrentSpellId('');
    } catch (error) {
      console.error('Erro ao criar aprimoramento:', error);
    }
  };

  const handleCancelAprimoramento = () => {
    setShowAprimoramentoForm(false);
    setCurrentSpellId('');
    setNewAprimoramentoData({
      custoAdicionalPM: 1,
      reaplicavel: false,
      descricao: ''
    });
  };

  const handleUpdateAprimoramento = async (spellId: string, aprimoramentoId: string, field: keyof Aprimoramento, newValue: string | number | boolean) => {
    try {
      await updateSpellEnhancement(spellId, aprimoramentoId, { [field]: newValue });
    } catch (error) {
      console.error('Erro ao atualizar aprimoramento:', error);
    }
  };

  const handleRemoveAprimoramento = async (spellId: string, aprimoramentoId: string) => {
    try {
      await deleteSpellEnhancement(spellId, aprimoramentoId);
    } catch (error) {
      console.error('Erro ao remover aprimoramento:', error);
    }
  };

  const handleIncrementAplicacoes = (spellId: string, aprimoramentoId: string) => {
    const key = `${spellId}-${aprimoramentoId}`;
    setAprimoramentoApplications(prev => ({
      ...prev,
      [key]: (prev[key] || 0) + 1
    }));
  };

  const handleDecrementAplicacoes = (spellId: string, aprimoramentoId: string) => {
    const key = `${spellId}-${aprimoramentoId}`;
    setAprimoramentoApplications(prev => ({
      ...prev,
      [key]: Math.max(0, (prev[key] || 0) - 1)
    }));
  };


  const handleAddSkill = useCallback((tabKey: AbilityTabType) => {
    if (tabKey === 'abilities') {
      setAbilityModalOpen(true);
    } else {
      setPowerModalOpen(true);
    }
  }, []);

  const handleAddCombatItem = (type: TabType) => {
    if (type === 'attacks') {
      setAttackModalOpen(true);
    } else if (type === 'spells') {
      setSpellModalOpen(true);
    }
  };

  // Menu handlers
  const toggleMenu = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === itemId ? null : itemId);
  };

  const handleDeleteAttack = async (attackId: string) => {
    try {
      await deleteAttack(attackId);
      if (selectedAttack?.id === attackId) {
        setSelectedAttack(null);
      }
      setOpenMenuId(null);
    } catch (error) {
      console.error('Erro ao deletar ataque:', error);
    }
  };

  const handleDeleteSpell = async (spellId: string) => {
    try {
      await deleteSpell(spellId);
      if (selectedSpell?.id === spellId) {
        setSelectedSpell(null);
      }
      setOpenMenuId(null);
    } catch (error) {
      console.error('Erro ao deletar magia:', error);
    }
  };



  // Edit handlers
  const handleEditAttack = (attack: Attack) => {
    setEditingAttack(attack);
    setAttackModalOpen(true);
    setOpenMenuId(null);
  };

  const handleEditSpell = (spell: Spell) => {
    setEditingSpell(spell);
    setSpellModalOpen(true);
    setOpenMenuId(null);
  };

  const handleEditAbility = (ability: any) => {
    setEditingAbility(ability);
    setAbilityModalOpen(true);
    setOpenMenuId(null);
  };

  const handleEditPower = (power: any) => {
    setEditingPower(power);
    setPowerModalOpen(true);
    setOpenMenuId(null);
  };

  // Update selected items after editing
  const updateSelectedAttack = (updatedAttack: Attack) => {
    if (selectedAttack?.id === updatedAttack.id) {
      setSelectedAttack(updatedAttack);
    }
  };

  const updateSelectedSpell = (updatedSpell: Spell) => {
    if (selectedSpell?.id === updatedSpell.id) {
      setSelectedSpell(updatedSpell);
    }
  };

  // Handlers for abilities and powers
  const handleDeleteSkill = useCallback(async (skillId: string, tabKey: AbilityTabType) => {
    try {
      if (tabKey === 'abilities') {
        await deleteAbility(skillId);
      } else {
        await deletePower(skillId);
      }
      setOpenMenuId(null);
    } catch (error) {
      console.error('Erro ao deletar habilidade/poder:', error);
    }
  }, [deleteAbility, deletePower]);

  const handleEditSkill = useCallback((skill: any, tabKey: AbilityTabType) => {
    if (tabKey === 'abilities') {
      handleEditAbility(skill);
    } else {
      handleEditPower(skill);
    }
  }, [handleEditAbility, handleEditPower]);

  const handleUpdateSkillDescription = useCallback(async (skillId: string, tabKey: AbilityTabType, newDescription: string) => {
    try {
      if (tabKey === 'abilities') {
        await updateAbility(skillId, { description: newDescription });
      } else {
        await updatePower(skillId, { description: newDescription });
      }
    } catch (error) {
      console.error('Erro ao atualizar descrição:', error);
    }
  }, [updateAbility, updatePower]);


  // Tab data for abilities and powers section
  const skillsTabData = useMemo(
    () =>
      generateSkillsTabData(abilities, powers, {
        handleEditSkill,
        handleDeleteSkill,
        handleAddSkill,
        handleUpdateSkillDescription,
      }),
    [abilities, powers, handleEditSkill, handleDeleteSkill, handleAddSkill, handleUpdateSkillDescription]
  );

  return (
    <div className="with-navbar">
      <Navbar showBackButton={true} />
      <div className="combat-container">
        <div className="combat-content">
          {/* Combat Stats Section */}
          <div className="combat-stats-section">
            <div className="stats-grid">
              {character ? (
                <>
                  <HealthBar 
                    currentHp={character.current_health}
                    maxHp={character.max_health}
                    tempHp={character.temporary_health}
                    onHpChange={handleHpChange}
                    onTempHpChange={handleTempHpChange}
                  />
                  <ManaBar 
                    currentMana={character.current_mana}
                    maxMana={character.max_mana}
                    onManaChange={handleManaChange}
                  />
                </>
              ) : (
                <div className="loading-placeholder">
                  <p>Carregando dados do personagem...</p>
                </div>
              )}
              <DefenseBar
                dexterityBonus={character?.defence_attribute_bonus || 0}
                armorBonus={character?.defence_armor_bonus || 0}
                shieldBonus={0} /* FUTURE: Calculate from equipped items with type='shield' in inventory */
                otherBonus={character?.defence_other || 0}
                baseDefense={character?.defence_base || 10}
                onDexterityChange={updateDefenseAttributeBonus}
                onArmorChange={updateDefenseArmorBonus}
                onShieldChange={() => {}} /* FUTURE: Add updateDefenseShieldBonus handler when shield system is implemented */
                onOtherChange={updateDefenseOther}
              />
            </div>
          </div>

          <div className="combat-header">
            <h1 className="combat-title">Combate</h1>
            
            {/* Tabs Navigation */}
            <div className="tabs-container">
              <button
                className={`tab-button ${activeTab === 'attacks' ? 'active' : ''}`}
                onClick={() => setActiveTab('attacks')}
              >
                <span className="tab-icon">⚔️</span>
                <span>Ataques</span>
              </button>
              <button
                className={`tab-button ${activeTab === 'spells' ? 'active' : ''}`}
                onClick={() => setActiveTab('spells')}
              >
                <span className="tab-icon">✨</span>
                <span>Magias</span>
              </button>
            </div>

            {/* Spell Slots Info - Only show for spells tab */}
            {activeTab === 'spells' && (
              <div className="spell-slots-info">
                <div className="spell-slot-group">
                  <span className="slot-label">1º círculo:</span>
                  <span className="slot-count">4/4</span>
                </div>
                <div className="spell-slot-group">
                  <span className="slot-label">2º círculo:</span>
                  <span className="slot-count">3/3</span>
                </div>
                <div className="spell-slot-group">
                  <span className="slot-label">3º círculo:</span>
                  <span className="slot-count">2/2</span>
                </div>
              </div>
            )}
          </div>

          <div className="combat-layout">
            {/* ATTACKS TAB */}
            {activeTab === 'attacks' && (
              <div className="combat-list">
                <div className="list-header">
                  <h2>Ataques Disponíveis</h2>
                </div>
                <AttacksList
                  attacks={attacks}
                  selectedAttack={selectedAttack}
                  onSelectAttack={setSelectedAttack}
                  onEditAttack={handleEditAttack}
                  onDeleteAttack={handleDeleteAttack}
                  onAddAttack={() => handleAddCombatItem('attacks')}
                  openMenuId={openMenuId}
                  onToggleMenu={toggleMenu}
                />
              </div>
            )}

            {/* SPELLS TAB */}
            {activeTab === 'spells' && (
              <div className="combat-list">
                <div className="list-header">
                  <h2>Grimório</h2>
                </div>
                <SpellsList
                  spells={spells}
                  selectedSpell={selectedSpell}
                  onSelectSpell={setSelectedSpell}
                  onEditSpell={handleEditSpell}
                  onDeleteSpell={handleDeleteSpell}
                  onAddSpell={() => handleAddCombatItem('spells')}
                  onToggleSpellPrepared={toggleSpellPrepared}
                  openMenuId={openMenuId}
                  onToggleMenu={toggleMenu}
                />
              </div>
            )}


            {/* DETAILS PANEL */}
            <div className="combat-details">
              {/* Attack Details */}
              {activeTab === 'attacks' && selectedAttack && (
                <>
                  <div className="details-header">
                    <div className="editable-title">
                      <input 
                        type="text" 
                        value={selectedAttack.name}
                        onChange={(e) => handleUpdateAttackField(selectedAttack.id, 'name', e.target.value)}
                        className="attack-name-input"
                        placeholder="Nome do ataque"
                      />
                    </div>
                    <span className="details-level">{selectedAttack.type}</span>
                  </div>
                  
                  <div className="details-stats">
                    <div className="stat-row">
                      <strong>Teste de Ataque:</strong>
                      <div className="editable-stat">
                        <input 
                          type="text" 
                          value={selectedAttack.testeAtaque}
                          onChange={(e) => handleUpdateAttackField(selectedAttack.id, 'testeAtaque', e.target.value)}
                          className="teste-ataque-input"
                          placeholder="Ex: 1d20+5"
                        />
                      </div>
                    </div>
                    <div className="stat-row damage">
                      <strong>Dano:</strong>
                      <div className="editable-stat">
                        <input 
                          type="text" 
                          value={selectedAttack.damage}
                          onChange={(e) => handleUpdateAttackField(selectedAttack.id, 'damage', e.target.value)}
                          className="damage-input"
                          placeholder="Ex: 1d8+3 cortante"
                        />
                      </div>
                    </div>
                    <div className="stat-row">
                      <strong>Crítico:</strong>
                      <div className="editable-stat">
                        <input 
                          type="text" 
                          value={selectedAttack.critico}
                          onChange={(e) => handleUpdateAttackField(selectedAttack.id, 'critico', e.target.value)}
                          className="critico-input"
                          placeholder="Ex: 19-20/x2"
                        />
                      </div>
                    </div>
                    <div className="stat-row">
                      <strong>Alcance:</strong>
                      <div className="editable-stat">
                        <input 
                          type="text" 
                          value={selectedAttack.range}
                          onChange={(e) => handleUpdateAttackField(selectedAttack.id, 'range', e.target.value)}
                          className="range-input"
                          placeholder="Ex: 1,5m"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="details-description">
                    <h3>Descrição</h3>
                    <div className="editable-stat">
                      <textarea 
                        value={selectedAttack.description}
                        onChange={(e) => handleUpdateAttackField(selectedAttack.id, 'description', e.target.value)}
                        className="description-textarea"
                        placeholder="Descrição do ataque..."
                        rows={4}
                      />
                    </div>
                  </div>

                </>
              )}

              {/* Spell Details */}
              {activeTab === 'spells' && selectedSpell && (
                <>
                  <SpellDetails
                    spell={selectedSpell}
                    aprimoramentoApplications={aprimoramentoApplications}
                    onUpdateField={handleUpdateSpellField}
                    onUpdateAprimoramento={handleUpdateAprimoramento}
                    onIncrementAplicacoes={handleIncrementAplicacoes}
                    onDecrementAplicacoes={handleDecrementAplicacoes}
                    onRemoveAprimoramento={handleRemoveAprimoramento}
                    onAddAprimoramento={handleAddAprimoramento}
                    openMenuId={openMenuId}
                    onToggleMenu={toggleMenu}
                    onCloseMenu={() => setOpenMenuId(null)}
                  />

                  <AprimoramentoForm
                    isOpen={showAprimoramentoForm}
                    newAprimoramentoData={newAprimoramentoData}
                    onUpdateData={(data) => setNewAprimoramentoData(prev => ({ ...prev, ...data }))}
                    onCancel={handleCancelAprimoramento}
                    onCreate={handleCreateAprimoramento}
                  />
                </>
              )}


              {/* No Selection */}
              {((activeTab === 'attacks' && !selectedAttack) ||
                (activeTab === 'spells' && !selectedSpell)) && (
                <div className="no-selection">
                  <svg 
                    width="64" 
                    height="64" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                  <p>
                    {activeTab === 'attacks' && 'Selecione um ataque para ver os detalhes'}
                    {activeTab === 'spells' && 'Selecione uma magia para ver os detalhes'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Abilities and Powers Section */}
          <SkillsSection
            abilities={abilities}
            powers={powers}
            skillsTabData={skillsTabData}
            tabbedListRefreshKey={tabbedListRefreshKey}
          />
        </div>

        {/* Modais para adicionar itens */}
        
        {/* Modal de Ataque */}
        <Modal
          isOpen={attackModalOpen}
          onClose={() => {
            setAttackModalOpen(false);
            setEditingAttack(null);
          }}
          title={editingAttack ? "Editar Ataque" : "Adicionar Ataque"}
          size="medium"
        >
          <AttackForm
            onSubmit={async (data: AttackFormData) => {
              try {
                if (editingAttack) {
                  await updateAttack(editingAttack.id, data);
                  // Update selected attack if it's the same one being edited
                  const updatedAttack = { ...editingAttack, ...data };
                  updateSelectedAttack(updatedAttack);
                  setEditingAttack(null);
                } else {
                  await addAttack(data);
                }
                setAttackModalOpen(false);
              } catch (error) {
                console.error('Erro ao salvar ataque:', error);
              }
            }}
            onCancel={() => {
              setAttackModalOpen(false);
              setEditingAttack(null);
            }}
            initialData={editingAttack || undefined}
          />
        </Modal>

        {/* Modal de Magia */}
        <Modal
          isOpen={spellModalOpen}
          onClose={() => {
            setSpellModalOpen(false);
            setEditingSpell(null);
          }}
          title={editingSpell ? "Editar Magia" : "Adicionar Magia"}
          size="large"
        >
          <SpellForm
            onSubmit={async (data: SpellFormData) => {
              try {
                if (editingSpell) {
                  await updateSpell(editingSpell.id, data);
                  // Update selected spell if it's the same one being edited
                  const updatedSpell = { ...editingSpell, ...data };
                  updateSelectedSpell(updatedSpell);
                  setEditingSpell(null);
                } else {
                  await addSpell(data);
                }
                setSpellModalOpen(false);
              } catch (error) {
                console.error('Erro ao salvar magia:', error);
              }
            }}
            onCancel={() => {
              setSpellModalOpen(false);
              setEditingSpell(null);
            }}
            initialData={editingSpell || undefined}
          />
        </Modal>


        {/* Modal de Habilidade */}
        <Modal
          isOpen={abilityModalOpen}
          onClose={() => {
            setAbilityModalOpen(false);
            setEditingAbility(null);
          }}
          title={editingAbility ? "Editar Habilidade" : "Adicionar Habilidade"}
          size="medium"
        >
          <AbilityForm
            onSubmit={async (data: AbilityFormData) => {
              try {
                if (editingAbility) {
                  await updateAbility(editingAbility.id, {
                    name: data.name,
                    type: data.type as any,
                    description: data.description,
                    prerequisites: data.prerequisites,
                    cost: data.cost
                  });
                  setEditingAbility(null);
                  // Force refresh of TabbedItemList
                  setTabbedListRefreshKey(prev => prev + 1);
                } else {
                  await addAbility({
                    name: data.name,
                    type: data.type as any,
                    description: data.description,
                    prerequisites: data.prerequisites,
                    cost: data.cost
                  });
                }
                setAbilityModalOpen(false);
              } catch (error) {
                console.error('Erro ao salvar habilidade:', error);
              }
            }}
            onCancel={() => {
              setAbilityModalOpen(false);
              setEditingAbility(null);
            }}
            initialData={editingAbility || undefined}
            defaultType="ability"
          />
        </Modal>

        {/* Modal de Poder */}
        <Modal
          isOpen={powerModalOpen}
          onClose={() => {
            setPowerModalOpen(false);
            setEditingPower(null);
          }}
          title={editingPower ? "Editar Poder" : "Adicionar Poder"}
          size="medium"
        >
          <AbilityForm
            onSubmit={async (data: AbilityFormData) => {
              try {
                if (editingPower) {
                  await updatePower(editingPower.id, {
                    name: data.name,
                    category: data.category as any,
                    description: data.description,
                    prerequisites: data.prerequisites,
                    cost: data.cost
                  });
                  setEditingPower(null);
                  // Force refresh of TabbedItemList
                  setTabbedListRefreshKey(prev => prev + 1);
                } else {
                  await addPower({
                    name: data.name,
                    category: data.category as any,
                    description: data.description,
                    prerequisites: data.prerequisites,
                    cost: data.cost
                  });
                }
                setPowerModalOpen(false);
              } catch (error) {
                console.error('Erro ao salvar poder:', error);
              }
            }}
            onCancel={() => {
              setPowerModalOpen(false);
              setEditingPower(null);
            }}
            initialData={editingPower || undefined}
            defaultType="power"
          />
        </Modal>
      </div>
    </div>
  );
};

export default Combat;

