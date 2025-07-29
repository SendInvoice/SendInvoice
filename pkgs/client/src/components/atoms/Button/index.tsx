import React from 'react';

import './Button.css';

type ButtonProps = {
  className: string;
  children: React.ReactNode;
  label?: string;
  type?: 'button' | 'submit';
  href?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export const Button: React.FC<ButtonProps> = (props) => {
  return (
      <button
        className={`button ${props.className}`}
        type={props.type || 'button'}
        onClick={props.onClick}
      >
          {props.children}
      </button>
  );
};