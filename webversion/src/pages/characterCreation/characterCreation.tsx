import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import { characterApi } from '../../services/api';
import { supabase } from '../../config/supabase';
import './characterCreation.css';

// Tamanhos disponíveis
const SIZES = [
  { id: 'Tiny', name: 'Minúsculo', description: '2,5 pés' },
  { id: 'Small', name: 'Pequeno', description: '5 pés' },
  { id: 'Medium', name: 'Médio', description: '5 pés' },
  { id: 'Large', name: 'Grande', description: '10 pés' },
  { id: 'Huge', name: 'Enorme', description: '15 pés' },
  { id: 'Colossal', name: 'Colossal', description: '20+ pés' },
];

// Raças disponíveis
const RACES = [
  { id: 'human', name: 'Humano', description: 'Versátil e adaptável' },
  { id: 'elf', name: 'Elfo', description: 'Ágil e sábio' },
  { id: 'dwarf', name: 'Anão', description: 'Resistente e forte' },
  { id: 'halfling', name: 'Halfling', description: 'Pequeno e sortudo' },
  { id: 'orc', name: 'Orc', description: 'Feroz e poderoso' },
  { id: 'tiefling', name: 'Tiefling', description: 'Misterioso e carismático' },
  { id: 'dragonborn', name: 'Draconato', description: 'Nobre e honorável' },
  { id: 'gnome', name: 'Gnomo', description: 'Curioso e inteligente' },
];

// Classes disponíveis (Tormenta RPG)
const CLASSES = [
  { id: 'arcanista', name: 'Arcanista', description: 'Mestre das artes arcanas e magias' },
  { id: 'barbaro', name: 'Bárbaro', description: 'Lutador selvagem e furioso' },
  { id: 'bardo', name: 'Bardo', description: 'Artista versátil e inspirador' },
  { id: 'bucaneiro', name: 'Bucaneiro', description: 'Aventureiro dos mares e combatente ágil' },
  { id: 'cacador', name: 'Caçador', description: 'Rastreador experiente e mestre do combate à distância' },
  { id: 'cavaleiro', name: 'Cavaleiro', description: 'Guerreiro montado e protetor' },
  { id: 'clerigo', name: 'Clérigo', description: 'Servo divino e curador' },
  { id: 'druida', name: 'Druida', description: 'Guardião da natureza e metamorfo' },
  { id: 'guerreiro', name: 'Guerreiro', description: 'Especialista em combate e armas' },
  { id: 'inventor', name: 'Inventor', description: 'Criador de dispositivos e engenhocas' },
  { id: 'ladino', name: 'Ladino', description: 'Furtivo, habilidoso e astuto' },
  { id: 'lutador', name: 'Lutador', description: 'Mestre do combate desarmado' },
  { id: 'nobre', name: 'Nobre', description: 'Líder carismático e influente' },
  { id: 'paladino', name: 'Paladino', description: 'Guerreiro sagrado e campeão da justiça' },
];

// Origens disponíveis
const ORIGINS = [
  { id: 'noble', name: 'Nobre', description: 'Nasceu em berço de ouro' },
  { id: 'soldier', name: 'Soldado', description: 'Veterano de guerra' },
  { id: 'criminal', name: 'Criminoso', description: 'Vida nas sombras' },
  { id: 'scholar', name: 'Erudito', description: 'Estudioso dedicado' },
  { id: 'folk-hero', name: 'Herói Popular', description: 'Defensor do povo' },
  { id: 'outlander', name: 'Forasteiro', description: 'Das terras selvagens' },
  { id: 'artisan', name: 'Artesão', description: 'Mestre de um ofício' },
  { id: 'merchant', name: 'Mercador', description: 'Comerciante habilidoso' },
];

// Divindades disponíveis
const DEITIES = [
  { id: 'none', name: 'Nenhuma', description: 'Sem devoção religiosa' },
  { id: 'allihanna', name: 'Allihanna', description: 'Deusa da natureza' },
  { id: 'azgher', name: 'Azgher', description: 'Deus do sol e da justiça' },
  { id: 'khalmyr', name: 'Khalmyr', description: 'Deus da justiça e honra' },
  { id: 'lena', name: 'Lena', description: 'Deusa da vida e cura' },
  { id: 'marah', name: 'Marah', description: 'Deusa da paz e esperança' },
  { id: 'thyatis', name: 'Thyatis', description: 'Deusa da guerra e coragem' },
  { id: 'valkaria', name: 'Valkaria', description: 'Deusa da ambição e ganância' },
  { id: 'arsenal', name: 'Arsenal', description: 'Deus da guerra e artesanato' },
  { id: 'tanna-toh', name: 'Tanna-Toh', description: 'Deusa da conhecimento' },
];

// Perícias padrão
const DEFAULT_SKILLS = [
  { name: 'Acrobacia', attribute: 'Destreza', only_trained: false, armor_penalty: true },
  { name: 'Adestramento', attribute: 'Carisma', only_trained: true, armor_penalty: false },
  { name: 'Atletismo', attribute: 'Força', only_trained: false, armor_penalty: false },
  { name: 'Atuação', attribute: 'Carisma', only_trained: true, armor_penalty: false },
  { name: 'Cavalgar', attribute: 'Destreza', only_trained: false, armor_penalty: false },
  { name: 'Conhecimento', attribute: 'Inteligência', only_trained: true, armor_penalty: false },
  { name: 'Cura', attribute: 'Sabedoria', only_trained: false, armor_penalty: false },
  { name: 'Diplomacia', attribute: 'Carisma', only_trained: false, armor_penalty: false },
  { name: 'Enganação', attribute: 'Carisma', only_trained: false, armor_penalty: false },
  { name: 'Furtividade', attribute: 'Destreza', only_trained: false, armor_penalty: true },
  { name: 'Guerra', attribute: 'Inteligência', only_trained: true, armor_penalty: false },
  { name: 'Iniciativa', attribute: 'Destreza', only_trained: false, armor_penalty: false },
  { name: 'Intimidação', attribute: 'Carisma', only_trained: false, armor_penalty: false },
  { name: 'Intuição', attribute: 'Sabedoria', only_trained: false, armor_penalty: false },
  { name: 'Investigação', attribute: 'Inteligência', only_trained: false, armor_penalty: false },
  { name: 'Jogatina', attribute: 'Carisma', only_trained: true, armor_penalty: false },
  { name: 'Ladinagem', attribute: 'Destreza', only_trained: true, armor_penalty: true },
  { name: 'Luta', attribute: 'Força', only_trained: false, armor_penalty: false },
  { name: 'Misticismo', attribute: 'Inteligência', only_trained: true, armor_penalty: false },
  { name: 'Nobreza', attribute: 'Inteligência', only_trained: true, armor_penalty: false },
  { name: 'Percepção', attribute: 'Sabedoria', only_trained: false, armor_penalty: false },
  { name: 'Pilotagem', attribute: 'Destreza', only_trained: true, armor_penalty: false },
  { name: 'Pontaria', attribute: 'Destreza', only_trained: false, armor_penalty: false },
  { name: 'Religião', attribute: 'Sabedoria', only_trained: true, armor_penalty: false },
  { name: 'Sobrevivência', attribute: 'Sabedoria', only_trained: false, armor_penalty: false },
  // Testes de Resistência
  { name: 'Vontade', attribute: 'Sabedoria', only_trained: false, armor_penalty: false },
  { name: 'Reflexos', attribute: 'Destreza', only_trained: false, armor_penalty: false },
  { name: 'Fortitude', attribute: 'Constituição', only_trained: false, armor_penalty: false },
];

const CharacterCreation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setSelectedCharacterId, refreshCharacters } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [characterData, setCharacterData] = useState({
    name: '',
    race: '',
    class: '',
    origin: '',
    deity: '',
    size: '',
    level: 1,
    maxHealth: 0,
    maxMana: 0,
    maxInventorySlots: 20,
  });

  const handleInputChange = (field: string, value: string | number) => {
    setCharacterData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNumberChange = (field: string, value: string) => {
    const numValue = value === '' ? 0 : parseInt(value, 10);
    setCharacterData(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    console.log('🚀 SUBMIT INICIADO!');
    console.log('👤 Usuário:', user);
    console.log('📝 Dados do formulário:', characterData);
    
    if (!user) {
      setError('Você precisa estar logado para criar um personagem');
      return;
    }

    setLoading(true);

    try {
      // Convert camelCase to snake_case and add required fields
      const characterPayload = {
        user_id: user.id,
        name: characterData.name,
        race: characterData.race,
        class: characterData.class,
        origin: characterData.origin,
        deity: characterData.deity || null,
        size: characterData.size,
        level: characterData.level,
        max_health: characterData.maxHealth,
        current_health: characterData.maxHealth,  // Start at full health
        max_mana: characterData.maxMana,
        current_mana: characterData.maxMana,      // Start at full mana
        max_inventory_slots: characterData.maxInventorySlots,
      };

      console.log('📤 PAYLOAD ENVIADO PARA O SUPABASE:', characterPayload);
      console.log('📤 USER ID:', user.id);
      
      // Verify Supabase authentication
      const { data: { session } } = await supabase.auth.getSession();
      console.log('🔐 Supabase Session:', session ? 'Autenticado' : 'NÃO AUTENTICADO');
      console.log('🔐 Session User ID:', session?.user?.id);
      
      if (!session) {
        throw new Error('Você não está autenticado no Supabase. Faça login novamente.');
      }

      const newCharacter = await characterApi.createCharacter(characterPayload as any);
      
      console.log('✅ RESPOSTA DO SERVIDOR:', newCharacter);
      console.log('🎉 Personagem criado com sucesso!');
      
      // Create default attributes for the character
      if (newCharacter?.id) {
        console.log('🔧 Criando atributos padrão para o personagem...');
        try {
          const { error: attributesError } = await supabase
            .from('character_attributes')
            .insert({
              character_id: newCharacter.id,
              forca: 10,
              destreza: 10,
              constituicao: 10,
              inteligencia: 10,
              sabedoria: 10,
              carisma: 10,
            });

          if (attributesError) {
            console.error('⚠️ Erro ao criar atributos padrão:', attributesError);
            // Not throwing error as this is not critical - attributes will be created on first access
          } else {
            console.log('✅ Atributos padrão criados com sucesso!');
          }
        } catch (attrErr) {
          console.error('⚠️ Exceção ao criar atributos:', attrErr);
          // Not throwing error as this is not critical
        }

        // Create default skills for the character
        console.log('🔧 Criando perícias padrão para o personagem...');
        try {
          const halfLevel = Math.floor(characterData.level / 2);
          const skillsToInsert = DEFAULT_SKILLS.map(skill => ({
            character_id: newCharacter.id,
            name: skill.name,
            attribute: skill.attribute,
            is_trained: false,
            only_trained: skill.only_trained,
            armor_penalty: skill.armor_penalty,
            half_level: halfLevel,
            trained_bonus: 0,
            others: 0,
          }));

          const { error: skillsError } = await supabase
            .from('skills')
            .insert(skillsToInsert);

          if (skillsError) {
            console.error('⚠️ Erro ao criar perícias padrão:', skillsError);
            // Not throwing error as this is not critical
          } else {
            console.log('✅ Perícias padrão criadas com sucesso!', skillsToInsert.length, 'perícias');
          }
        } catch (skillsErr) {
          console.error('⚠️ Exceção ao criar perícias:', skillsErr);
          // Not throwing error as this is not critical
        }
      }
      
      // Select the newly created character and refresh the character list
      if (newCharacter?.id) {
        console.log('🎯 Selecionando o personagem criado:', newCharacter.id);
        setSelectedCharacterId(newCharacter.id);
        
        // Refresh the characters list to include the new character
        await refreshCharacters();
        
        console.log('✅ Navegando para o perfil do personagem...');
      }
      
      // Navigate to the character profile page
      navigate('/profile');
    } catch (err: any) {
      console.error('❌ ERRO AO CRIAR PERSONAGEM:', err);
      console.error('❌ DETALHES DO ERRO:', {
        message: err.message,
        details: err.details,
        hint: err.hint,
        code: err.code,
        status: err.status,
        statusText: err.statusText
      });
      setError(err.message || 'Erro ao criar personagem. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const selectedRace = RACES.find(race => race.id === characterData.race);
  const selectedClass = CLASSES.find(cls => cls.id === characterData.class);
  const selectedOrigin = ORIGINS.find(origin => origin.id === characterData.origin);
  const selectedDeity = DEITIES.find(deity => deity.id === characterData.deity);
  const selectedSize = SIZES.find(size => size.id === characterData.size);

  return (
    <div className="character-creation-container">
      <div className="character-creation-content">
        <h1 className="character-creation-title">Criação de Personagem</h1>
        
        {error && <div className="auth-error" style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#fee', color: '#c33', borderRadius: '8px' }}>{error}</div>}
        
        <form className="character-creation-form" onSubmit={handleSubmit}>
          {/* Nome do Personagem */}
          <div className="form-group">
            <label htmlFor="character-name" className="form-label">
              Nome do Personagem
            </label>
            <input
              type="text"
              id="character-name"
              className="form-input"
              placeholder="Digite o nome do seu personagem"
              value={characterData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* Dropdown de Raças */}
          <div className="form-group">
            <label htmlFor="character-race" className="form-label">
              Raça
            </label>
            <select
              id="character-race"
              className="form-select"
              value={characterData.race}
              onChange={(e) => handleInputChange('race', e.target.value)}
              required
              disabled={loading}
            >
              <option value="">Selecione uma raça</option>
              {RACES.map(race => (
                <option key={race.id} value={race.id}>
                  {race.name}
                </option>
              ))}
            </select>
            {selectedRace && (
              <p className="form-description">{selectedRace.description}</p>
            )}
          </div>

          {/* Dropdown de Classes */}
          <div className="form-group">
            <label htmlFor="character-class" className="form-label">
              Classe
            </label>
            <select
              id="character-class"
              className="form-select"
              value={characterData.class}
              onChange={(e) => handleInputChange('class', e.target.value)}
              required
              disabled={loading}
            >
              <option value="">Selecione uma classe</option>
              {CLASSES.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
            {selectedClass && (
              <p className="form-description">{selectedClass.description}</p>
            )}
          </div>

          {/* Dropdown de Origem */}
          <div className="form-group">
            <label htmlFor="character-origin" className="form-label">
              Origem
            </label>
            <select
              id="character-origin"
              className="form-select"
              value={characterData.origin}
              onChange={(e) => handleInputChange('origin', e.target.value)}
              required
              disabled={loading}
            >
              <option value="">Selecione uma origem</option>
              {ORIGINS.map(origin => (
                <option key={origin.id} value={origin.id}>
                  {origin.name}
                </option>
              ))}
            </select>
            {selectedOrigin && (
              <p className="form-description">{selectedOrigin.description}</p>
            )}
          </div>

          {/* Dropdown de Divindade */}
          <div className="form-group">
            <label htmlFor="character-deity" className="form-label">
              Divindade <span className="optional-label">(Opcional)</span>
            </label>
            <select
              id="character-deity"
              className="form-select"
              value={characterData.deity}
              onChange={(e) => handleInputChange('deity', e.target.value)}
              disabled={loading}
            >
              <option value="">Selecione uma divindade</option>
              {DEITIES.map(deity => (
                <option key={deity.id} value={deity.id}>
                  {deity.name}
                </option>
              ))}
            </select>
            {selectedDeity && (
              <p className="form-description">{selectedDeity.description}</p>
            )}
          </div>

          {/* Dropdown de Tamanho */}
          <div className="form-group">
            <label htmlFor="character-size" className="form-label">
              Tamanho
            </label>
            <select
              id="character-size"
              className="form-select"
              value={characterData.size}
              onChange={(e) => handleInputChange('size', e.target.value)}
              required
              disabled={loading}
            >
              <option value="">Selecione um tamanho</option>
              {SIZES.map(size => (
                <option key={size.id} value={size.id}>
                  {size.name}
                </option>
              ))}
            </select>
            {selectedSize && (
              <p className="form-description">{selectedSize.description}</p>
            )}
          </div>

          {/* Campos Numéricos - Level, Max Health e Max Mana */}
          <div className="numeric-fields-group">
            {/* Nível */}
            <div className="form-group">
              <label htmlFor="character-level" className="form-label">
                Nível
              </label>
              <input
                type="number"
                id="character-level"
                className="form-input"
                placeholder="1"
                min="1"
                max="20"
                value={characterData.level}
                onChange={(e) => handleNumberChange('level', e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {/* Vida Máxima */}
            <div className="form-group">
              <label htmlFor="character-max-health" className="form-label">
                Vida Máxima
              </label>
              <input
                type="number"
                id="character-max-health"
                className="form-input"
                placeholder="0"
                min="0"
                value={characterData.maxHealth}
                onChange={(e) => handleNumberChange('maxHealth', e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {/* Mana Máxima */}
            <div className="form-group">
              <label htmlFor="character-max-mana" className="form-label">
                Mana Máxima
              </label>
              <input
                type="number"
                id="character-max-mana"
                className="form-input"
                placeholder="0"
                min="0"
                value={characterData.maxMana}
                onChange={(e) => handleNumberChange('maxMana', e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {/* Slots Máximos da Mochila */}
            <div className="form-group">
              <label htmlFor="character-max-slots" className="form-label">
                Slots Máximos
              </label>
              <input
                type="number"
                id="character-max-slots"
                className="form-input"
                placeholder="20"
                min="0"
                value={characterData.maxInventorySlots}
                onChange={(e) => handleNumberChange('maxInventorySlots', e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Personagem'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => navigate('/home')}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CharacterCreation;

