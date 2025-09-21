import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner, Progress } from "flowbite-react";
import axios from "axios";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import clientConfig from "../../../../client-config.json";
import ProductoCardItem from "./ProductoCardItem";

// ===== Helpers =====
const slug = (s) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim();

// Labels (UI) y Keys (estables)
const TRAINED_LABELS = clientConfig.sections?.trained || [];
const TRAINED_KEYS = clientConfig.products?.trainedKeys?.length
  ? clientConfig.products.trainedKeys
  : TRAINED_LABELS.map(slug);

// Mapeo key → label (por índice)
const keyToLabel = Object.fromEntries(
  TRAINED_LABELS.map((lbl, i) => [TRAINED_KEYS[i] || slug(lbl), lbl])
);

// Emojis configurados por LABEL
const emojisByLabel = clientConfig.ui?.emojiDefaults || {};
const DEFAULT_EMOJI = "📦";

// Emoji con fallbacks
const computeEmoji = (label, key) => {
  if (emojisByLabel[label]) return emojisByLabel[label];
  const altLabel = keyToLabel[key];
  if (altLabel && emojisByLabel[altLabel]) return emojisByLabel[altLabel];
  const stripped = label.replace(/\d+$/u, "").trim();
  if (emojisByLabel[stripped]) return emojisByLabel[stripped];
  return DEFAULT_EMOJI;
};

function ProductosEntrenados({ planData, allProducts = [] }) {
  const navigate = useNavigate();
  const [countsByKey, setCountsByKey] = useState({});
  const [loading, setLoading] = useState(true);

  // === Totales globales ===
  const totalProductos = allProducts.length || 0;
  const maxProductos = planData?.maxProductosTotales || 0;

  useEffect(() => {
    async function fetchCounts() {
      try {
        const { data } = await axios.get("http://localhost:5000/api/productos");
        const initCounts = {};
        TRAINED_KEYS.forEach((k) => (initCounts[k] = 0));

        data.forEach((p) => {
          const k = p?.categoryKey || slug(p?.category);
          if (k in initCounts) initCounts[k] = (initCounts[k] || 0) + 1;
        });

        setCountsByKey(initCounts);
      } catch (e) {
        console.error("Error fetching products:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchCounts();
  }, []);

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
          <span className="text-[34px] bold text-transparent bg-clip-text bg-gradient-to-r from-black via-blue-800 to-violet-800 dark:from-white dark:via-blue-400 dark:to-violet-400">
            Productos Entrenados ({TRAINED_LABELS.length})
          </span>

          {/* Subtítulo y progress */}
          <div className="mt-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Productos totales globales creados
            </p>
            <Progress
              progress={
                maxProductos
                  ? Math.round((totalProductos / maxProductos) * 100)
                  : 0
              }
              size="sm"
              color="purple"
            />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {totalProductos} / {maxProductos} productos usados
            </span>
          </div>
        </motion.h1>

        <div className="flex space-x-2">
          <motion.button
            onClick={() => navigate("/productos-sin-entrenamiento")}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="py-3 px-4 text-sm bg-violet-600 text-white rounded-lg font-semibold shadow-md hover:opacity-90"
          >
            Tus listas
          </motion.button>

          <motion.button
            onClick={() => navigate("/dashboard")}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-3 text-sm bg-yellow-400 text-black rounded-lg font-medium shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <span className="text-md">Volver</span>
          </motion.button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {TRAINED_LABELS.map((label, i) => {
          const key = TRAINED_KEYS[i] || slug(label);
          const count = countsByKey[key] || 0;
          const icon = computeEmoji(label, key);
          return (
            <ProductoCardItem
              key={key}
              title={label}
              icon={icon}
              count={count}
              onClick={() =>
                navigate(`/productos/${encodeURIComponent(key)}`)
              }
            />
          );
        })}
      </div>
    </div>
  );
}

export default ProductosEntrenados;
