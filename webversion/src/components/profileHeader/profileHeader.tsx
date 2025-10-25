import { useState, useRef, useEffect } from 'react';
import './profileHeader.css';

interface ProfileHeaderProps {
  username?: string;
  level?: number;
  classe?: string;
  raca?: string;
  divindade?: string;
  origem?: string;
  size?: string;
  movement?: string;
  backgroundImage?: string;
  profileImage?: string;
  onOptionsClick?: () => void;
  onSelectCharacter?: () => void;
}

const ProfileHeader = ({ 
  username = '', 
  level = 5,
  classe = 'Arcanista',
  raca = 'Humano',
  divindade = 'Skoll',
  origem = 'Bisbilhoteiro',
  size = 'Médio',
  movement = '6 quadrados',
  backgroundImage,
  profileImage,
  onOptionsClick,
  onSelectCharacter
}: ProfileHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleOptionsButtonClick = () => {
    setIsMenuOpen(!isMenuOpen);
    if (onOptionsClick) {
      onOptionsClick();
    }
  };

  const handleSelectCharacter = () => {
    setIsMenuOpen(false);
    if (onSelectCharacter) {
      onSelectCharacter();
    }
  };

  return (
    <div className="profile-header">
      <div 
        className="profile-background"
        style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}
      >
        <div className="profile-overlay"></div>
        <div className="profile-options-container" ref={menuRef}>
          <button 
            className="profile-options-button" 
            aria-label="Opções"
            onClick={handleOptionsButtonClick}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="4" r="1.5" fill="currentColor"/>
              <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
              <circle cx="10" cy="16" r="1.5" fill="currentColor"/>
            </svg>
          </button>

          {isMenuOpen && (
            <div className="profile-dropdown-menu">
              <button 
                onClick={handleSelectCharacter}
                className="profile-dropdown-item"
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span>Selecionar Personagem</span>
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="profile-content">
        <div className="profile-avatar-container">
          <div className="profile-avatar">
            {profileImage ? (
              <img src={profileImage} alt={username} className="profile-avatar-image" />
            ) : (
              <div className="profile-avatar-placeholder">
                {username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
        
        <div className="profile-info">
          <h2 className="profile-username">{username}</h2>
          <div className="profile-stats">
            <span className="profile-badge profile-level">Level {level}</span>
            <span className="profile-badge profile-class">{classe}</span>
            <span className="profile-badge profile-race">{raca}</span>
            <span className="profile-badge profile-deity">{divindade}</span>
            <span className="profile-badge profile-origin">{origem}</span>
            <span className="profile-badge profile-size">Tamanho: {size}</span>
            <span className="profile-badge profile-movement">Deslocamento: {movement}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;

