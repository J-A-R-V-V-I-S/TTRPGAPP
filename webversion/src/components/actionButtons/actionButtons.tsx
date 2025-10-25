import './actionButtons.css';

interface ActionButtonsProps {
  onNotesClick?: () => void;
  onBackstoryClick?: () => void;
}

const ActionButtons = ({ 
  onNotesClick, 
  onBackstoryClick 
}: ActionButtonsProps) => {
  return (
    <div className="action-buttons-widget">
      <div className="action-buttons-container">
        <button 
          className="action-button notes-button"
          onClick={onNotesClick}
        >
          <span className="button-icon">📝</span>
          <span className="button-text">Anotações</span>
        </button>
        <button 
          className="action-button backstory-button"
          onClick={onBackstoryClick}
        >
          <span className="button-icon">📖</span>
          <span className="button-text">Backstory</span>
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;

