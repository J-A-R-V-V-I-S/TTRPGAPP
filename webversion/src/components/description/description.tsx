import { useState, useEffect, useRef } from 'react';
import './description.css';

interface DescriptionProps {
  initialValue?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}

const Description = ({ 
  initialValue = '', 
  placeholder = 'Enter your character description...',
  onChange 
}: DescriptionProps) => {
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

  // Auto-resize textarea based on content (only on mobile)
  useEffect(() => {
    if (textareaRef.current && window.innerWidth < 800) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <div className="description-widget">
      <div className="description-container">
        <label className="description-label">Description</label>
        <textarea
          ref={textareaRef}
          className="description-input"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          rows={1}
        />
      </div>
    </div>
  );
};

export default Description;

