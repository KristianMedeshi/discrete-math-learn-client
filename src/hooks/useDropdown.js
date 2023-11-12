import { useEffect, useRef, useState } from 'react';
import { useClickAway, useKeyPress } from 'react-use';
import useFocusTrap from '@charlietango/use-focus-trap';

const useDropdown = () => {
  const dropDownRef = useRef(null);
  const inputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const focusTrapRef = useFocusTrap(isOpen);
  const hasEnterPressed = useKeyPress('Enter');
  const hasEscapePressed = useKeyPress('Escape');
  const openDropDown = () => setIsOpen(true);
  const closeDropDown = () => setIsOpen(false);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [document.activeElement]);

  useEffect(() => {
    if (!isOpen) {
      document.activeElement?.blur();
    }
  }, [isOpen]);

  useClickAway(dropDownRef, closeDropDown);

  useEffect(() => {
    if (isOpen && hasEnterPressed) {
      document.activeElement?.click();
    }
  }, [hasEnterPressed]);

  useEffect(() => {
    if (isOpen && hasEscapePressed) {
      closeDropDown();
    }
  }, [hasEscapePressed]);

  return {
    isOpen,
    openDropDown,
    closeDropDown,
    inputRef,
    dropDownRef,
    focusTrapRef,
  };
};

export default useDropdown;
