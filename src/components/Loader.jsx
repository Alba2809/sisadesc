import { motion } from 'framer-motion';

const Loader = () => {

  const loaderVariants = {
    initial: { rotate: 0 },
    animate: { rotate: 360 },
  };

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className="w-10 h-10 border-t-4 border-blue-500 border-solid rounded-full"
        variants={loaderVariants}
        initial="initial"
        animate="animate"
        transition={{ ease: 'linear', repeat: Infinity, duration: 1 }}
      />
    </div>
  );
};

export default Loader;
