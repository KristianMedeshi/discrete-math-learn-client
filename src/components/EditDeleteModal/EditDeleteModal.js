import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { useClickAway } from 'react-use';
import { MdDeleteOutline, MdOutlineEdit } from 'react-icons/md';

function EditDeleteModal({
  className, isOpen, handleClose, onEdit, onDelete,
}) {
  const [t] = useTranslation('global');
  const ref = useRef(null);
  useClickAway(ref, handleClose);

  return (
    <AnimatePresence
      initial={false}
      mode="wait"
    >
      {isOpen && (
        <motion.div
          ref={ref}
          className={`absolute menu ${className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            className="menu-option min-w-[100px] justify-start gap-2"
            onClick={onEdit}
          >
            <MdOutlineEdit size={22} />
            <p>{t('edit')}</p>
          </button>
          <div className="divider-x" />
          <button
            type="button"
            className="menu-option min-w-[100px] justify-start gap-2 text-red"
            onClick={onDelete}
          >
            <MdDeleteOutline size={22} />
            <p>{t('delete')}</p>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default EditDeleteModal;
