import { motion } from 'framer-motion';
import './Backdrop.scss';

function Backdrop({ children, onClick }) {
  return (
    <motion.div
      className="backdrop overflow-auto"
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
}

export default Backdrop;
