import { useEffect, useState } from 'react';

const useModal = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const close = () => setModalOpen(false);
  const open = () => setModalOpen(true);

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', modalOpen);

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [modalOpen]);

  return [modalOpen, open, close];
};

export default useModal;
