import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import './home.css';

const Home = () => {
  const navigate = useNavigate();
  const { userData, isGameMaster, characters, games, loading, setSelectedCharacterId } = useUser();

  const handleCharacterClick = (characterId: string) => {
    // Set the selected character
    setSelectedCharacterId(characterId);
    // Navigate to character profile
    navigate(`/profile/${characterId}`);
  };

  const handleCreateCharacter = () => {
    // Navigate to character creation
    navigate('/create-character');
  };

  const handleGameClick = (gameId: string) => {
    // Navigate to game management page
    navigate(`/game/${gameId}`);
  };

  const handleCreateGame = () => {
    // TODO: Implement game creation
    console.log('Create new game');
  };

  if (loading) {
    return (
      <div className="home-container">
        <div className="home-content">
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="player-name">{userData?.username || 'Usuário'}</h1>
        
        {/* Player View - Show Characters */}
        {!isGameMaster && (
          <div className="characters-section">
            <div className="characters-header">
              <h2>Seus Personagens</h2>
              <button className="create-character-btn" onClick={handleCreateCharacter}>
                + Novo Personagem
              </button>
            </div>
            
            {characters.length === 0 ? (
              <div className="empty-state">
                <p>Você ainda não tem personagens.</p>
                <p>Crie seu primeiro personagem para começar sua aventura!</p>
              </div>
            ) : (
              <div className="characters-list">
                {characters.map((character) => (
                  <div 
                    key={character.id} 
                    className="character-card"
                    onClick={() => handleCharacterClick(character.id)}
                  >
                    <div className="character-main-info">
                      <h3 className="character-name">{character.name}</h3>
                      <div className="character-details">
                        <span className="character-level">Nível {character.level}</span>
                        <span className="character-separator">•</span>
                        <span className="character-classe">{character.class}</span>
                      </div>
                    </div>
                    <div className="character-adventure">
                      <span className="adventure-label">Raça:</span>
                      <span className="adventure-name">{character.race}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Game Master View - Show Games */}
        {isGameMaster && (
          <div className="characters-section">
            <div className="characters-header">
              <h2>Seus Jogos</h2>
              <button className="create-character-btn" onClick={handleCreateGame}>
                + Novo Jogo
              </button>
            </div>
            
            {games.length === 0 ? (
              <div className="empty-state">
                <p>Você ainda não criou nenhum jogo.</p>
                <p>Crie seu primeiro jogo para começar a mestrar!</p>
              </div>
            ) : (
              <div className="characters-list">
                {games.map((game) => (
                  <div 
                    key={game.id} 
                    className="character-card game-card"
                    onClick={() => handleGameClick(game.id)}
                  >
                    <div className="character-main-info">
                      <h3 className="character-name">{game.name}</h3>
                      <div className="character-details">
                        <span className={`game-status ${game.isActive ? 'active' : 'inactive'}`}>
                          {game.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                    </div>
                    {game.description && (
                      <div className="character-adventure">
                        <span className="adventure-label">Descrição:</span>
                        <span className="adventure-name">{game.description}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

