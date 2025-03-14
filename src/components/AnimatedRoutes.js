
import { motion } from 'framer-motion';
import { useLocation, Outlet } from 'react-router-dom';

const pageVariants = {
  initial: {
    x: '100%',
    opacity: 0
  },
  in: {
    x: 0,
    opacity: 1
  },
  out: {
    x: '-100%',
    opacity: 0
  }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
};

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <motion.div
      key={location.pathname}
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <Outlet />
    </motion.div>
  );
}

export default AnimatedRoutes;