import React from 'react';

import type { JSX } from 'react';

import './Button.css';

type ButtonProps = {
  className: string;
  children: JSX.Element 
  label?: string;
  type?: 'button' | 'submit';
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export const Button: React.FC<ButtonProps> = (props) => {
  return (
    <div className="button">
        <button
          className={props.className}
          type={props.type || 'button'}
          onClick={props.onClick}
        >
            {props.children}
        </button>
    </div>
  );
};