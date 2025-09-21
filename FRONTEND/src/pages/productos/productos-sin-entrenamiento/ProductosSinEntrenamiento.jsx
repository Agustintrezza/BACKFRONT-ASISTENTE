import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner, Progress } from "flowbite-react";
import axios from "axios";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import clientConfig from "../../../../client-config.json";

const slug = (s) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim();

const PRODUCT_LABELS = clientConfig.sections?.trained || [];
const PRODUCT_KEYS =
  clientConfig.products?.trainedKeys?.length
    ? clientConfig.products.trainedKeys
    : PRODUCT_LABELS.map(slug);

const TRAINED_PRODUCT_KEY_SET = new Set(PRODUCT_KEYS);
const getProductKey = (p) => p?.categoryKey || slug(p?.category);

function ProductosSinEntrenamiento({ planData }) {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const maxComodines = planData?.maxProductosComodines || 0;

  useEffect(() => {
    async function fetchProductos() {
      setLoading(true);
      try {
        const { data } = await axios.get("http://localhost:5000/api/productos");
        const sin = data.filter(
          (p) => !TRAINED_PRODUCT_KEY_SET.has(getProductKey(p))
        );
        setProductos(sin);
      } catch (err) {
        console.error("Error cargando productos:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProductos();
  }, []);

  // Agrupamos por categoría
  const categorias = productos.reduce((acc, p) => {
    const key = getProductKey(p);
    if (!acc[key]) acc[key] = { categoria: p.category || key, count: 0 };
    acc[key].count += 1;
    return acc;
  }, {});

  const categoriasArr = Object.entries(categorias).map(([key, obj]) => ({
    key,
    ...obj,
  }));

  const totalCategorias = categoriasArr.length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <Spinner size="xl" className="w-16 h-16 text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-violet-200 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <motion.h1
          className="text-4xl font-extrabold"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-[30px] bold text-transparent bg-clip-text bg-gradient-to-r from-black via-blue-800 to-violet-800 dark:from-white dark:via-blue-400 dark:to-violet-400">
            Productos Sin Entrenamiento ({totalCategorias})
          </span>

          {/* Subtítulo y progress */}
          <div className="mt-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Categorías creadas (comodines)
            </p>
            <Progress
              progress={
                maxComodines
                  ? Math.round((totalCategorias / maxComodines) * 100)
                  : 0
              }
              size="sm"
              color="purple"
            />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {totalCategorias} / {maxComodines} categorías usadas
            </span>
          </div>
        </motion.h1>

        {/* Botones */}
        <div className="flex flex-wrap gap-2 ml-4">
          <motion.button
            onClick={() => navigate("/producto/nuevo")}
            disabled={totalCategorias >= maxComodines}
            className={`py-3 px-4 text-sm rounded-lg font-semibold shadow-md
              ${
                totalCategorias >= maxComodines
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:opacity-90"
              }`}
          >
            Crear producto
          </motion.button>

          <motion.button
            onClick={() => navigate("/productos-entrenados")}
            className="py-3 px-4 text-sm bg-violet-600 text-white rounded-lg font-semibold shadow-md hover:opacity-90"
          >
            Ir a entrenados
          </motion.button>

          <motion.button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 text-sm bg-yellow-400 text-black rounded-lg font-medium shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <span className="text-md">Volver</span>
          </motion.button>
        </div>
      </div>

      {/* Cards por categoría */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categoriasArr.map((cat) => (
          <motion.div
            key={cat.key}
            onClick={() =>
              navigate(`/productos-sin-entrenamiento/${encodeURIComponent(cat.key)}`)
            }
            whileHover={{ scale: 1.02 }}
            className="cursor-pointer bg-white dark:bg-gray-800 rounded-2xl p-5 shadow hover:shadow-violet-200 dark:hover:shadow-violet-900"
          >
            <h2 className="text-xl font-bold mb-2 text-violet-800 dark:text-violet-400">
              {cat.categoria}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {cat.count} productos sin entrenar
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default ProductosSinEntrenamiento;
