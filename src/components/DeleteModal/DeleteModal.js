import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Backdrop from '../Backdrop';
import dropIn from '../../constants/dropInAnimation';

function DeleteModal({
  isOpen, deleteHeader, deleteMessage, handleClose, onDelete,
}) {
  const [t] = useTranslation('global');

  return (
    <AnimatePresence
      initial={false}
      mode="wait"
    >
      {isOpen && (
        <Backdrop onClick={handleClose}>
          <motion.div
            onClick={(e) => e.stopPropagation()}
            variants={dropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="modal h-[min(90vh,230px)]"
          >
            <div className="flex flex-col text-center">
              <h1 className="heading-m">{deleteHeader}</h1>
              <p className="body-text-m">{deleteMessage}</p>
            </div>
            <div className="flex gap-5">
              <button
                type="button"
                onClick={handleClose}
                className="button-primary px-8"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="button-destructive px-8"
              >
                {t('delete')}
              </button>
            </div>
          </motion.div>
        </Backdrop>
      )}
    </AnimatePresence>
  );
}

export default DeleteModal;
