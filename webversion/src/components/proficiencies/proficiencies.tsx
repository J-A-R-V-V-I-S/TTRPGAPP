import { useState, useEffect } from 'react';
import './proficiencies.css';

interface ProficienciesProps {
  initialValue?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}

const Proficiencies = ({ 
  initialValue = '', 
  placeholder = 'Liste suas proficiências e outras características...',
  onChange 
}: ProficienciesProps) => {
  const [value, setValue] = useState(initialValue);

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

  return (
    <div className="proficiencies-widget">
      <div className="proficiencies-container">
        <label className="proficiencies-label">Proficiências e Características</label>
        <textarea
          className="proficiencies-input"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default Proficiencies;

