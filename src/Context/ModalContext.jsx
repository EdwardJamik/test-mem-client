import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState(null);

    const openModal = (data) => {
        setData(data);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setData(null);
    };

    return (
        <ModalContext.Provider value={{ isOpen, openModal, closeModal, data }}>
            {children}
        </ModalContext.Provider>
    );
};
