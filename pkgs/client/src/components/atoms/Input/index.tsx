import React from 'react';

import './Input.css';

type InputProps = {
  className?: string;
  label?: string;
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
};

export const Input: React.FC<InputProps> = ({ className, value, onChange, placeholder, type = 'text' }) => {
  return (
    <div className="input">
        <input
          className={`input-field ${className}`}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
    </div>
  );
};