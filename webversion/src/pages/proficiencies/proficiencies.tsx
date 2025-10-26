import { useState, useEffect } from 'react';
import { useCharacter } from '../../contexts/CharacterContext';
import { useAttributes } from '../../contexts/AttributesContext';
import Navbar from '../../components/navbar/navbar';
import './proficiencies.css';

const Proficiencies = () => {
  const { character } = useCharacter();
  const { attributes, skills, updateSkill, refreshSkills } = useAttributes();
  const [editingSkill, setEditingSkill] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{
    isTrained: boolean;
    halfLevel: number;
    trainedBonus: number;
    others: number;
  }>({
    isTrained: false,
    halfLevel: 0,
    trainedBonus: 0,
    others: 0,
  });

  useEffect(() => {
    if (character?.id) {
      refreshSkills();
    }
  }, [character?.id]);

  const handleEditSkill = (skill: any) => {
    setEditingSkill(skill.id);
    setEditValues({
      isTrained: skill.isTrained,
      halfLevel: skill.halfLevel,
      trainedBonus: skill.trainedBonus,
      others: skill.others,
    });
  };

  const handleSaveSkill = async (skillId: string) => {
    try {
      await updateSkill(skillId, editValues);
      setEditingSkill(null);
    } catch (error) {
      console.error('Erro ao atualizar perícia:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingSkill(null);
  };

  // Get attribute bonus (direct value, no calculation needed)
  const getAttributeBonus = (attributeValue: number): number => {
    return attributeValue;
  };

  const getAttributeValue = (attributeName: string): number => {
    if (!attributes) return 10;

    const attrMap: { [key: string]: number } = {
      'Força': attributes.forca + (attributes.forcaTempMod || 0),
      'Destreza': attributes.destreza + (attributes.destrezaTempMod || 0),
      'Constituição': attributes.constituicao + (attributes.constituicaoTempMod || 0),
      'Inteligência': attributes.inteligencia + (attributes.inteligenciaTempMod || 0),
      'Sabedoria': attributes.sabedoria + (attributes.sabedoriaTempMod || 0),
      'Carisma': attributes.carisma + (attributes.carismaTempMod || 0),
    };

    return attrMap[attributeName] || 10;
  };

  const calculateSkillTotal = (skill: any): number => {
    const attributeValue = getAttributeValue(skill.attribute);
    const attributeBonus = getAttributeBonus(attributeValue);
    
    let total = attributeBonus + skill.halfLevel + skill.others;
    
    if (skill.isTrained) {
      total += skill.trainedBonus;
    }
    
    // Se a perícia é "Somente Treinada" e não está treinada, retorna um valor indicativo
    if (skill.onlyTrained && !skill.isTrained) {
      return -999; // Valor especial para indicar que não pode ser usada
    }
    
    return total;
  };

  if (!character) {
    return (
      <div className="with-navbar">
        <Navbar showBackButton={true} />
        <div className="proficiencies-container">
          <div className="loading">Carregando personagem...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="with-navbar">
      <Navbar showBackButton={true} />
      <div className="proficiencies-container">
        <div className="proficiencies-content">
          <h1 className="page-title">Perícias</h1>
          <p className="page-subtitle">Gerencie as perícias do seu personagem</p>
          
          <div className="skills-grid">
            {skills && skills.length > 0 ? (
              skills.map((skill) => {
                const skillTotal = calculateSkillTotal(skill);
                const isEditing = editingSkill === skill.id;
                const cannotUse = skill.onlyTrained && !skill.isTrained;
                const isSavingThrow = skill.name === 'Vontade' || skill.name === 'Reflexos' || skill.name === 'Fortitude';

                return (
                  <div 
                    key={skill.id} 
                    className={`skill-card ${skill.isTrained ? 'trained' : ''} ${cannotUse ? 'disabled' : ''} ${isSavingThrow ? 'saving-throw' : ''}`}
                  >
                    <div className="skill-header">
                      <h3 className="skill-name">{skill.name}</h3>
                      <div className="skill-total">
                        {cannotUse ? '—' : (skillTotal >= 0 ? `+${skillTotal}` : skillTotal)}
                      </div>
                    </div>
                    
                    <div className="skill-info">
                      <span className="skill-attribute">{skill.attribute}</span>
                      {isSavingThrow && (
                        <span className="skill-badge saving-throw">Teste de Resistência</span>
                      )}
                      {skill.onlyTrained && (
                        <span className="skill-badge trained-only">Somente Treinada</span>
                      )}
                      {skill.armorPenalty && (
                        <span className="skill-badge armor-penalty">Penalidade de Armadura</span>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="skill-edit">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={editValues.isTrained}
                            onChange={(e) => setEditValues({ ...editValues, isTrained: e.target.checked })}
                          />
                          Treinada
                        </label>
                        
                        <label className="input-label">
                          Metade do Nível:
                          <input
                            type="number"
                            value={editValues.halfLevel}
                            onChange={(e) => setEditValues({ ...editValues, halfLevel: parseInt(e.target.value) || 0 })}
                            disabled
                            className="readonly-input"
                          />
                        </label>
                        
                        <label className="input-label">
                          Bônus de Treinamento:
                          <input
                            type="number"
                            value={editValues.trainedBonus}
                            onChange={(e) => setEditValues({ ...editValues, trainedBonus: parseInt(e.target.value) || 0 })}
                          />
                        </label>
                        
                        <label className="input-label">
                          Outros:
                          <input
                            type="number"
                            value={editValues.others}
                            onChange={(e) => setEditValues({ ...editValues, others: parseInt(e.target.value) || 0 })}
                          />
                        </label>

                        <div className="skill-actions">
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => handleSaveSkill(skill.id)}
                          >
                            Salvar
                          </button>
                          <button 
                            className="btn btn-secondary btn-sm"
                            onClick={handleCancelEdit}
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="skill-details">
                        <div className="skill-breakdown">
                          <div className="breakdown-item">
                            <span className="breakdown-label">Atributo:</span>
                            <span className="breakdown-value">
                              {getAttributeBonus(getAttributeValue(skill.attribute)) >= 0 
                                ? `+${getAttributeBonus(getAttributeValue(skill.attribute))}`
                                : getAttributeBonus(getAttributeValue(skill.attribute))}
                            </span>
                          </div>
                          {skill.isTrained && (
                            <div className="breakdown-item">
                              <span className="breakdown-label">Treinamento:</span>
                              <span className="breakdown-value">+{skill.trainedBonus}</span>
                            </div>
                          )}
                          {skill.halfLevel > 0 && (
                            <div className="breakdown-item">
                              <span className="breakdown-label">½ Nível:</span>
                              <span className="breakdown-value">+{skill.halfLevel}</span>
                            </div>
                          )}
                          {skill.others !== 0 && (
                            <div className="breakdown-item">
                              <span className="breakdown-label">Outros:</span>
                              <span className="breakdown-value">
                                {skill.others >= 0 ? `+${skill.others}` : skill.others}
                              </span>
                            </div>
                          )}
                        </div>

                        <button 
                          className="btn btn-outline btn-sm"
                          onClick={() => handleEditSkill(skill)}
                        >
                          Editar
                        </button>
                      </div>
                    )}
                    
                    {cannotUse && (
                      <div className="skill-warning">
                        Esta perícia requer treinamento para ser usada
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="no-skills">
                <p>Nenhuma perícia encontrada para este personagem.</p>
                <p className="hint">As perícias são criadas automaticamente quando você cria um novo personagem.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Proficiencies;

