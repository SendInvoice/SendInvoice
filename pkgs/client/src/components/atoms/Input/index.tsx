import React from 'react';

import './Input.css';

type InputProps = {
  className?: string;
  label?: string;
  name?: string;
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
};

export const Input: React.FC<InputProps> = ({ className, name, value, onChange, placeholder, type = 'text' }) => {
  return (
    <div className="input">
        <input
          name={name || 'unknown'}
          className={`input-field ${className}`}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
    </div>
  );
};
