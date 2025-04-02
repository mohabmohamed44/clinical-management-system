import { useState, useCallback } from 'react';

/**
 * Custom hook for managing modal state
 * @param {boolean} initialState - Initial state of the modal (default: false)
 * @returns {Object} Modal state and functions to control it
 */
const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleModal = useCallback(() => {
    setIsOpen(prevState => !prevState);
  }, []);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal
  };
};

export default useModal;