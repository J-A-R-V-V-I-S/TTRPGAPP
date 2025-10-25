import { useState, useEffect, useRef } from 'react';
import './backstory.css';

interface BackstoryProps {
  initialValue?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  isSecret?: boolean;
  onSecretChange?: (isSecret: boolean) => void;
}

const Backstory = ({ 
  initialValue = '', 
  placeholder = 'Enter your character backstory...',
  onChange,
  isSecret = false,
  onSecretChange
}: BackstoryProps) => {
  const [value, setValue] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  // Debounce: Only call onChange after user stops typing for 1 second
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (onChange && value !== initialValue) {
        onChange(value);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [value]);

  const toggleSecret = () => {
    if (onSecretChange) {
      onSecretChange(!isSecret);
    }
  };

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <div className="backstory-widget">
      <div className="backstory-container">
        <label className="backstory-label">Backstory</label>
        <textarea
          ref={textareaRef}
          className="backstory-input"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          rows={1}
        />
        <div className="backstory-privacy">
          <button 
            className={`backstory-privacy-button ${isSecret ? 'secret' : 'public'}`}
            onClick={toggleSecret}
          >
            {isSecret ? 'Deixar outros verem sua Backstory' : 'Deixar Backstory secreta'}
          </button>
          <p className="backstory-privacy-description">
            {isSecret 
              ? 'Sua backstory está secreta' 
              : 'Isso é para impedir que outros jogadores possam acessar sua backstory por inteiro.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Backstory;

