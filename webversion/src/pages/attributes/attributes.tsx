import { useState, useEffect } from 'react';
import Navbar from '../../components/navbar/navbar';
import { useCharacter } from '../../contexts/CharacterContext';
import { useAttributes } from '../../contexts/AttributesContext';
import type { CharacterAttributes } from '../../types/character_attributes';
import AddCraftModal from '../../components/modal/forms/AddCraftModal';
import './attributes.css';

interface Attribute {
  name: string;
  dbField: 'forca' | 'destreza' | 'constituicao' | 'inteligencia' | 'sabedoria' | 'carisma';
  value: number;
  modifier: number;
}

interface Skill {
  id: string;
  name: string;
  attribute: string;
  trained: boolean;
  trainedOnly: boolean;
  armorPenalty: boolean;
  total: number;
  halfLevel: number;
  attributeBonus: number;
  training: number;
  others: number;
  specialization?: string;
  isEditable?: boolean;
}

const Attributes = () => {
  const { character } = useCharacter();
  const { attributes: characterAttributes, skills: characterSkills, updateAttributes, updateSkill, refreshSkills } = useAttributes();
  const [skillSearch, setSkillSearch] = useState('');
  const [showAddCraftModal, setShowAddCraftModal] = useState(false);
  const [attributes, setAttributes] = useState<Attribute[]>([
    { name: 'For', dbField: 'forca', value: 10, modifier: 0 },
    { name: 'Des', dbField: 'destreza', value: 10, modifier: 0 },
    { name: 'Con', dbField: 'constituicao', value: 10, modifier: 0 },
    { name: 'Int', dbField: 'inteligencia', value: 10, modifier: 0 },
    { name: 'Sab', dbField: 'sabedoria', value: 10, modifier: 0 },
    { name: 'Car', dbField: 'carisma', value: 10, modifier: 0 }
  ]);

  // Load attributes from attributes context
  useEffect(() => {
    if (characterAttributes) {
      setAttributes([
        { name: 'For', dbField: 'forca', value: characterAttributes.forca, modifier: characterAttributes.forcaTempMod || 0 },
        { name: 'Des', dbField: 'destreza', value: characterAttributes.destreza, modifier: characterAttributes.destrezaTempMod || 0 },
        { name: 'Con', dbField: 'constituicao', value: characterAttributes.constituicao, modifier: characterAttributes.constituicaoTempMod || 0 },
        { name: 'Int', dbField: 'inteligencia', value: characterAttributes.inteligencia, modifier: characterAttributes.inteligenciaTempMod || 0 },
        { name: 'Sab', dbField: 'sabedoria', value: characterAttributes.sabedoria, modifier: characterAttributes.sabedoriaTempMod || 0 },
        { name: 'Car', dbField: 'carisma', value: characterAttributes.carisma, modifier: characterAttributes.carismaTempMod || 0 }
      ]);
    }
  }, [characterAttributes]);

  // Helper function to convert attribute name to short form
  const getAttributeShortName = (attributeName: string): string => {
    const attrMap: { [key: string]: string } = {
      'Força': 'For',
      'Destreza': 'Des',
      'Constituição': 'Con',
      'Inteligência': 'Int',
      'Sabedoria': 'Sab',
      'Carisma': 'Car'
    };
    return attrMap[attributeName] || attributeName;
  };

  // Helper function to get attribute bonus (direct value, no calculation needed)
  const getAttributeBonus = (attributeValue: number): number => {
    return attributeValue;
  };

  // Helper function to get full attribute value (base + temp mod)
  const getFullAttributeValue = (attributeName: string): number => {
    if (!characterAttributes) return 10;

    const attrMap: { [key: string]: number } = {
      'Força': characterAttributes.forca + (characterAttributes.forcaTempMod || 0),
      'Destreza': characterAttributes.destreza + (characterAttributes.destrezaTempMod || 0),
      'Constituição': characterAttributes.constituicao + (characterAttributes.constituicaoTempMod || 0),
      'Inteligência': characterAttributes.inteligencia + (characterAttributes.inteligenciaTempMod || 0),
      'Sabedoria': characterAttributes.sabedoria + (characterAttributes.sabedoriaTempMod || 0),
      'Carisma': characterAttributes.carisma + (characterAttributes.carismaTempMod || 0)
    };

    return attrMap[attributeName] || 10;
  };

  // Load skills on mount
  useEffect(() => {
    if (character?.id) {
      refreshSkills();
    }
  }, [character?.id]);

  // Load skills from attributes context
  useEffect(() => {
    if (characterSkills && characterAttributes) {
      const transformedSkills = characterSkills.map(skill => {
        const attributeValue = getFullAttributeValue(skill.attribute);
        const attributeBonus = getAttributeBonus(attributeValue);
        const total = attributeBonus + skill.halfLevel + (skill.isTrained ? skill.trainedBonus : 0) + skill.others;

        return {
          id: skill.id,
          name: skill.name,
          attribute: getAttributeShortName(skill.attribute),
          trained: skill.isTrained,
          trainedOnly: skill.onlyTrained,
          armorPenalty: skill.armorPenalty,
          total: total,
          halfLevel: skill.halfLevel,
          attributeBonus: attributeBonus,
          training: skill.isTrained ? skill.trainedBonus : 0,
          others: skill.others,
        };
      });

      setSkills(transformedSkills);
    }
  }, [characterSkills, characterAttributes]);

  const updateAttributeValue = async (attrName: string, newValue: number) => {
    const attr = attributes.find(a => a.name === attrName);
    if (!attr) return;

    // Update local state immediately for better UX (keep modifier unchanged)
    const updatedAttributes = attributes.map(a => {
      if (a.name === attrName) {
        return {
          ...a,
          value: newValue
        };
      }
      return a;
    });
    setAttributes(updatedAttributes);

    // Update database
    try {
      await updateAttributes({
        [attr.dbField]: newValue
      });
    } catch (err) {
      console.error('Erro ao atualizar atributo:', err);
      // Revert local state on error
      if (characterAttributes) {
        setAttributes([
          { name: 'For', dbField: 'forca', value: characterAttributes.forca, modifier: 0 },
          { name: 'Des', dbField: 'destreza', value: characterAttributes.destreza, modifier: 0 },
          { name: 'Con', dbField: 'constituicao', value: characterAttributes.constituicao, modifier: 0 },
          { name: 'Int', dbField: 'inteligencia', value: characterAttributes.inteligencia, modifier: 0 },
          { name: 'Sab', dbField: 'sabedoria', value: characterAttributes.sabedoria, modifier: 0 },
          { name: 'Car', dbField: 'carisma', value: characterAttributes.carisma, modifier: 0 }
        ]);
      }
    }
  };

  const updateAttributeModifier = async (attrName: string, newModifier: number) => {
    const attr = attributes.find(a => a.name === attrName);
    if (!attr) return;

    // Update local state immediately for better UX
    const updatedAttributes = attributes.map(a => {
      if (a.name === attrName) {
        return {
          ...a,
          modifier: newModifier
        };
      }
      return a;
    });
    setAttributes(updatedAttributes);

    // Map attribute name to temp mod field
    const tempModFieldMap: { [key: string]: keyof CharacterAttributes } = {
      'For': 'forcaTempMod',
      'Des': 'destrezaTempMod',
      'Con': 'constituicaoTempMod',
      'Int': 'inteligenciaTempMod',
      'Sab': 'sabedoriaTempMod',
      'Car': 'carismaTempMod',
    };

    const tempModField = tempModFieldMap[attrName];
    if (!tempModField) return;

    // Update database
    try {
      await updateAttributes({
        [tempModField]: newModifier
      } as any);
    } catch (err) {
      console.error('Erro ao atualizar modificador temporário:', err);
      // Revert local state on error
      if (characterAttributes) {
        setAttributes([
          { name: 'For', dbField: 'forca', value: characterAttributes.forca, modifier: characterAttributes.forcaTempMod || 0 },
          { name: 'Des', dbField: 'destreza', value: characterAttributes.destreza, modifier: characterAttributes.destrezaTempMod || 0 },
          { name: 'Con', dbField: 'constituicao', value: characterAttributes.constituicao, modifier: characterAttributes.constituicaoTempMod || 0 },
          { name: 'Int', dbField: 'inteligencia', value: characterAttributes.inteligencia, modifier: characterAttributes.inteligenciaTempMod || 0 },
          { name: 'Sab', dbField: 'sabedoria', value: characterAttributes.sabedoria, modifier: characterAttributes.sabedoriaTempMod || 0 },
          { name: 'Car', dbField: 'carisma', value: characterAttributes.carisma, modifier: characterAttributes.carismaTempMod || 0 }
        ]);
      }
    }
  };


  const [skills, setSkills] = useState<Skill[]>([]);


  const getAttributeColor = (name: string) => {
    const colors: { [key: string]: string } = {
      'For': '#e74c3c',
      'Des': '#27ae60',
      'Con': '#e67e22',
      'Int': '#3498db',
      'Sab': '#9b59b6',
      'Car': '#e91e63'
    };
    return colors[name] || '#e94560';
  };

  const rollSkill = (skill: Skill) => {
    const roll = Math.floor(Math.random() * 20) + 1;
    const total = roll + skill.total;
    console.log(`${skill.name}: d20(${roll}) + ${skill.total} = ${total}`);
    // TODO: Implementar sistema de rolagem visual
  };

  const updateSkillSpecialization = (index: number, newSpecialization: string) => {
    const updatedSkills = [...skills];
    updatedSkills[index].specialization = newSpecialization;
    setSkills(updatedSkills);
  };

  const updateSkillAttribute = (index: number, newAttribute: string) => {
    const updatedSkills = [...skills];
    updatedSkills[index].attribute = newAttribute;
    // Get the attribute value directly (no calculation)
    const attr = attributes.find(a => a.name === newAttribute);
    updatedSkills[index].attributeBonus = attr ? (attr.value + attr.modifier) : 0;
    setSkills(updatedSkills);
  };

  const updateSkillField = (index: number, field: keyof Skill, value: number) => {
    const updatedSkills = [...skills];
    (updatedSkills[index] as any)[field] = value;
    setSkills(updatedSkills);
  };

  const updateSkillTraining = async (index: number, newTrainingValue: number) => {
    // Validate that training is >= 0
    if (newTrainingValue < 0) {
      console.warn('Valor de treino não pode ser negativo');
      return;
    }

    const skill = skills[index];
    if (!skill) return;

    // Determine if trained based on training value
    const isTrained = newTrainingValue > 0;

    // Update local state immediately for better UX
    const updatedSkills = [...skills];
    updatedSkills[index] = {
      ...skill,
      training: newTrainingValue,
      trained: isTrained,
      total: skill.attributeBonus + skill.halfLevel + newTrainingValue + skill.others
    };
    setSkills(updatedSkills);

    // Update database
    try {
      await updateSkill(skill.id, {
        trainedBonus: newTrainingValue,
        isTrained: isTrained
      });
      console.log('✅ Treino atualizado com sucesso!');
    } catch (err) {
      console.error('❌ Erro ao atualizar treino:', err);
      // Revert local state on error
      await refreshSkills();
    }
  };

  const updateSkillOthers = async (index: number, newOthersValue: number) => {
    const skill = skills[index];
    if (!skill) return;

    // Update local state immediately for better UX
    const updatedSkills = [...skills];
    updatedSkills[index] = {
      ...skill,
      others: newOthersValue,
      total: skill.attributeBonus + skill.halfLevel + skill.training + newOthersValue
    };
    setSkills(updatedSkills);

    // Update database
    try {
      await updateSkill(skill.id, {
        others: newOthersValue
      });
      console.log('✅ Outros modificadores atualizados com sucesso!');
    } catch (err) {
      console.error('❌ Erro ao atualizar outros modificadores:', err);
      // Revert local state on error
      await refreshSkills();
    }
  };

  const filteredSkills = skills.filter(skill => {
    const searchTerm = skillSearch.toLowerCase();
    const skillName = skill.name.toLowerCase();
    const specialization = skill.specialization?.toLowerCase() || '';
    return skillName.includes(searchTerm) || specialization.includes(searchTerm);
  });

  return (
    <div className="with-navbar">
      <Navbar showBackButton={true} />
      <div className="attributes-container">
        <div className="attributes-content">
          <div className="attributes-header">
            <h1 className="attributes-title">Atributos & Perícias</h1>
          </div>

          <div className="attributes-grid">
            {attributes.map(attr => (
              <div 
                key={attr.name} 
                className="attribute-card"
                style={{ borderColor: getAttributeColor(attr.name) }}
              >
                <div className="attribute-name">{attr.name}</div>
                <input
                  type="number"
                  className="attribute-value-input"
                  value={attr.value}
                  min={-5}
                  max={20}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    
                    // Allow empty string or just "-" while typing
                    if (inputValue === '' || inputValue === '-') {
                      return;
                    }

                    const value = parseInt(inputValue);
                    // Tormenta 20: atributos vão de -5 até 20
                    if (!isNaN(value) && value >= -5 && value <= 20) {
                      updateAttributeValue(attr.name, value);
                    }
                  }}
                  onBlur={(e) => {
                    // On blur, if empty or invalid, set to 0
                    const inputValue = e.target.value;
                    if (inputValue === '' || inputValue === '-') {
                      updateAttributeValue(attr.name, 0);
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                  style={{ color: getAttributeColor(attr.name) }}
                />
                <div className="attribute-modifier-section">
                  <label className="attribute-modifier-label">Modificador Temporário</label>
                  <input
                    type="number"
                    className="attribute-modifier-input"
                    value={attr.modifier}
                    min={-20}
                    max={20}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      
                      // Allow empty string or just "-" while typing
                      if (inputValue === '' || inputValue === '-') {
                        return;
                      }

                      const value = parseInt(inputValue);
                      if (!isNaN(value) && value >= -20 && value <= 20) {
                        updateAttributeModifier(attr.name, value);
                      }
                    }}
                    onBlur={(e) => {
                      // On blur, if empty or invalid, set to 0
                      const inputValue = e.target.value;
                      if (inputValue === '' || inputValue === '-') {
                        updateAttributeModifier(attr.name, 0);
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="skills-section">
            <div className="skills-header">
              <h2>Perícias</h2>
              <button 
                className="add-craft-button"
                onClick={() => setShowAddCraftModal(true)}
                title="Adicionar Ofício"
              >
                + Adicionar Ofício
              </button>
            </div>
            <div className="skills-search-container">
              <input
                type="text"
                className="skills-search-input"
                placeholder="Buscar perícia..."
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
              />
              {skillSearch && (
                <button 
                  className="skills-search-clear"
                  onClick={() => setSkillSearch('')}
                  aria-label="Limpar busca"
                >
                  ✕
                </button>
              )}
            </div>
            {filteredSkills.length === 0 ? (
              <div className="skills-no-results">
                {skills.length === 0 ? (
                  <>
                    <p>Nenhuma perícia encontrada para este personagem.</p>
                    <p className="hint">As perícias são criadas automaticamente quando você cria um novo personagem.</p>
                  </>
                ) : (
                  <p>Nenhuma perícia encontrada para "{skillSearch}"</p>
                )}
              </div>
            ) : (
              <div className="skills-grid">
                {filteredSkills.map((skill) => {
                  const originalIndex = skills.findIndex(s => s === skill);
                  return (
                <div 
                  key={`${skill.name}-${originalIndex}`}
                  className={`skill-item-new ${skill.trained ? 'trained' : ''}`}
                >
                  <div className="skill-header-row">
                    <div className="skill-title-section">
                      {skill.trained && <span className="trained-indicator">●</span>}
                      <div className="skill-name-area">
                        <div className="skill-name-wrapper">
                          <span className="skill-name">{skill.name}</span>
                          {skill.isEditable && skill.specialization && (
                            <input
                              type="text"
                              className="skill-specialization-input"
                              value={skill.specialization}
                              onChange={(e) => {
                                e.stopPropagation();
                                updateSkillSpecialization(originalIndex, e.target.value);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              placeholder="Especialização"
                            />
                          )}
                        </div>
                        <div className="skill-tags">
                          {skill.trainedOnly && <span className="skill-tag trained-only" title="Somente Treinada">T</span>}
                          {skill.armorPenalty && <span className="skill-tag armor-penalty" title="Penalidade de Armadura">A</span>}
                        </div>
                      </div>
                    </div>
                    <div className="skill-total-display" onClick={() => rollSkill(skill)}>
                      <span className="skill-total-label">Total</span>
                      <span className="skill-total-value">{skill.total >= 0 ? '+' : ''}{skill.total}</span>
                    </div>
                  </div>
                  
                  <div className="skill-fields-row">
                    <div className="skill-field">
                      <label>1/2 Nível</label>
                      <input
                        type="number"
                        value={skill.halfLevel}
                        onChange={(e) => updateSkillField(originalIndex, 'halfLevel', parseInt(e.target.value) || 0)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    
                    <div className="skill-field">
                      <label>
                        {skill.isEditable ? (
                          <select
                            className="skill-attribute-select-inline"
                            value={skill.attribute}
                            onChange={(e) => {
                              e.stopPropagation();
                              updateSkillAttribute(originalIndex, e.target.value);
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <option value="For">For</option>
                            <option value="Des">Des</option>
                            <option value="Con">Con</option>
                            <option value="Int">Int</option>
                            <option value="Sab">Sab</option>
                            <option value="Car">Car</option>
                          </select>
                        ) : (
                          skill.attribute
                        )}
                      </label>
                      <input
                        type="number"
                        value={skill.attributeBonus}
                        readOnly
                        disabled
                        onClick={(e) => e.stopPropagation()}
                        title="Valor calculado automaticamente do atributo"
                      />
                    </div>
                    
                    <div className="skill-field">
                      <label>Treino</label>
                      <input
                        type="number"
                        value={skill.training}
                        min={0}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          
                          // Allow empty string while typing
                          if (inputValue === '') {
                            return;
                          }

                          const value = parseInt(inputValue);
                          // Only allow values >= 0
                          if (!isNaN(value) && value >= 0) {
                            updateSkillTraining(originalIndex, value);
                          }
                        }}
                        onBlur={(e) => {
                          // On blur, if empty, set to 0
                          const inputValue = e.target.value;
                          if (inputValue === '') {
                            updateSkillTraining(originalIndex, 0);
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    
                    <div className="skill-field">
                      <label>Outros</label>
                      <input
                        type="number"
                        value={skill.others}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          
                          // Allow empty string or just "-" while typing
                          if (inputValue === '' || inputValue === '-') {
                            return;
                          }

                          const value = parseInt(inputValue);
                          // Allow any integer value (positive or negative)
                          if (!isNaN(value)) {
                            updateSkillOthers(originalIndex, value);
                          }
                        }}
                        onBlur={(e) => {
                          // On blur, if empty or invalid, set to 0
                          const inputValue = e.target.value;
                          if (inputValue === '' || inputValue === '-') {
                            updateSkillOthers(originalIndex, 0);
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="legend">
            <div className="legend-item">
              <span className="trained-indicator">●</span>
              <span>Treinado</span>
            </div>
            <div className="legend-item">
              <span className="skill-tag trained-only">T</span>
              <span>Somente Treinada</span>
            </div>
            <div className="legend-item">
              <span className="skill-tag armor-penalty">A</span>
              <span>Penalidade de Armadura</span>
            </div>
            <div className="legend-text">
              Clique em qualquer atributo ou perícia para rolar
            </div>
          </div>
        </div>
      </div>

      <AddCraftModal
        isOpen={showAddCraftModal}
        onClose={() => setShowAddCraftModal(false)}
      />
    </div>
  );
};

export default Attributes;

