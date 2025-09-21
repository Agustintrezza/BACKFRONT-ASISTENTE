// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

function ProductoSinEntrenamientoItem({ producto, onEdit, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ scale: 1.01 }}
      className="cursor-pointer bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.1)] flex flex-col justify-between hover:shadow-violet-200 dark:hover:shadow-violet-900"
    >
      <h2 className="text-lg font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-black via-blue-800 to-violet-800 dark:from-white dark:via-blue-400 dark:to-violet-400">
        {producto.title || "Sin título"}
      </h2>

      <div className="text-sm space-y-1">
        <p>💰 <strong>Precio:</strong> ${producto.price}</p>
        <p>📦 <strong>Stock:</strong> {producto.stock}</p>
        <p>🕒 <strong>Duración:</strong> {producto.duration}</p>
      </div>

      <div className="flex justify-end gap-4 mt-4 text-xl">
        <span
          role="button"
          className="hover:text-yellow-600"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          ✏️
        </span>
        <span
          role="button"
          className="hover:text-red-600"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          🔥
        </span>
      </div>
    </motion.div>
  );
}

export default ProductoSinEntrenamientoItem;
