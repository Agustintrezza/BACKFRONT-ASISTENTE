import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "flowbite-react";
import axios from "axios";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import clientConfig from "../../../client-config.json";

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

const emojiVariants = {
  animate: {
    x: [0, 3, 0],
    transition: { repeat: Infinity, repeatDelay: 2, duration: 0.8 },
  },
};

function ProductosEntrenados() {
  const navigate = useNavigate();
  const [countsByKey, setCountsByKey] = useState({});
  const [loading, setLoading] = useState(true);

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

  const Card = ({ title, icon, count, onClick }) => (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ scale: 1.01 }}
      className="cursor-pointer bg-white text-gray-900 rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all flex flex-col justify-between hover:shadow-violet-200"
    >
      <div>
        <h2 className="text-2xl font-bold mb-4 flex justify-between items-center px-4 py-2">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-blue-800 to-violet-800">
            {title}
          </span>
          <motion.span className="text-4xl ml-2" variants={emojiVariants} animate="animate">
            {icon}
          </motion.span>
        </h2>
        <p className="text-gray-700 text-sm">
          Total de productos: <span className="font-bold text-blue-600">{count}</span>
        </p>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" className="w-16 h-16 text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-violet-200 text-gray-800 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <motion.h1
          className="text-4xl font-extrabold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-blue-800 to-violet-800">
            Productos Entrenados ({TRAINED_LABELS.length})
          </span>
        </motion.h1>
        <div className="flex space-x-2">
          <motion.button
            onClick={() => navigate("/productos-sin-entrenamiento")}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="py-2 px-4 text-sm bg-gradient-to-r from-blue-600 to-violet-700 text-white rounded-lg font-semibold shadow-md hover:opacity-90 transition-all"
          >
            🔍 Ir a Sin Entrenamiento
          </motion.button>

          <motion.button
            onClick={() => navigate("/dashboard")}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-2 text-sm bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-500 ease-in-out flex items-center gap-2"
          >
            <span className="text-xl">⬅️</span>
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
            <Card
              key={key}
              title={label}
              icon={icon}
              count={count}
              // 👉 Navegar por KEY (detalles filtran por key en front)
              onClick={() => navigate(`/productos/${encodeURIComponent(key)}`)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ProductosEntrenados;
