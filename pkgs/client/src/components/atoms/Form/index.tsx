import React from 'react';

import './Form.css';

type FormProps = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
  children: React.ReactNode;
};

export const Form: React.FC<FormProps> = ({ onSubmit, className = '', children }) => {
  return (
    <form className={`form ${className}`} onSubmit={onSubmit}>
      {children}
    </form>
  );
};
