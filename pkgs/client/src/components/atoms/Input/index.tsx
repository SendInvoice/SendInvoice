import React from 'react';

import './Input.css';

type InputProps = {
  className: string;
  label?: string;          // The label for the text field
  value: string;         // The current value of the text field
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // Function to handle changes
  placeholder?: string;  // Optional placeholder text
  type?: string;         // Optional type of the input (e.g., "text", "password")
};

export const Input: React.FC<InputProps> = ({ className, label, value, onChange, placeholder, type = 'text' }) => {
  return (
    <div className="input">
        <input
          className={className}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
    </div>
  );
};