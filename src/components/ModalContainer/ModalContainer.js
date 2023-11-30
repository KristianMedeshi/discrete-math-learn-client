import { AnimatePresence } from 'framer-motion';

function ModalContainer({ children }) {
  return (
    <AnimatePresence
      initial={false}
      mode="wait"
    >
      {children}
    </AnimatePresence>
  );
}

export default ModalContainer;
