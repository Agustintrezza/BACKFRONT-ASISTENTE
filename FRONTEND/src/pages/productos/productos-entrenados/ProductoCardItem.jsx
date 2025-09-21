// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const emojiVariants = {
  animate: {
    x: [0, 3, 0],
    transition: { repeat: Infinity, repeatDelay: 2, duration: 0.8 },
  },
};

function ProductoCardItem({ title, icon, count, onClick }) {
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ scale: 1.01 }}
      className="cursor-pointer bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all flex flex-col justify-between hover:shadow-violet-200 dark:hover:shadow-violet-900"
    >
      <div>
        <h2 className="text-2xl font-bold mb-4 flex justify-between items-center py-2">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-blue-800 to-violet-800 dark:from-white dark:via-blue-400 dark:to-violet-400">
            {title}
          </span>
          <motion.span
            className="text-5xl ml-2"
            variants={emojiVariants}
            animate="animate"
          >
            {icon}
          </motion.span>
        </h2>
        <p className="text-gray-700 dark:text-white text-md">
          Total creados:{" "}
          <span className="font-bold text-blue-600 dark:text-blue-400">
            {count}
          </span>
        </p>
      </div>
    </motion.div>
  );
}

export default ProductoCardItem;
