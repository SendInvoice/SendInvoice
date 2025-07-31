import React from 'react';

import './Modal.css';

type ModalProps = {
    className?: string;
    children: React.ReactNode;
};

export const Modal: React.FC<ModalProps> = ({ className, children }) => {

return (
        <div id="modal">
            <div
                id="modal-content"
                className={`modal ${className}`}>
                {children}
            </div>
        </div>
    );
};