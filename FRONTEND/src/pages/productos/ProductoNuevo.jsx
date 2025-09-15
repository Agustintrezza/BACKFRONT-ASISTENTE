import { useNavigate, useLocation, useParams } from "react-router-dom";
import ProductoModal from "../../components/productos/ProductoModal";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

function ProductoNuevo() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // 👈 capturamos el id si está presente
  const categoria = location.state?.categoria || null;

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-white to-violet-200 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-center mb-8 flex-wrap gap-2">
        <motion.h1
          className="text-4xl font-extrabold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-blue-800 to-violet-800 dark:from-white dark:via-blue-400 dark:to-violet-400">
            {id ? "Editar Producto" : "Crear Nuevo Producto"}
          </span>
        </motion.h1>

        <motion.button
          onClick={() => navigate("/productos-sin-entrenamiento")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          ⬅️ Volver
        </motion.button>
      </div>

      <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 rounded-lg w-full max-w-5xl mx-auto shadow-md">
        <ProductoModal
          productoId={id} // 👈 le pasamos el id para que cargue la data
          category={categoria}
          onClose={() => navigate("/productos-sin-entrenamiento")}
          onSuccess={() => navigate("/productos-sin-entrenamiento")}
        />
      </div>
    </div>
  );
}

export default ProductoNuevo;
