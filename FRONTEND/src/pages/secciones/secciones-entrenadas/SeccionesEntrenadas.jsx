import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner, Progress } from "flowbite-react";
import axios from "axios";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import clientConfig from "../../../client-config.json";
import SeccionCardItem from "./SeccionCardItem";

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

// Labels y Keys desde config
const SPECIAL_LABELS = clientConfig.sections?.special || [];
const SPECIAL_KEYS = clientConfig.sections?.specialKeys?.length
  ? clientConfig.sections.specialKeys
  : SPECIAL_LABELS.map(slug);

// key → label
const keyToLabel = Object.fromEntries(
  SPECIAL_LABELS.map((lbl, i) => [SPECIAL_KEYS[i] || slug(lbl), lbl])
);

// Emojis
const emojisByLabel = clientConfig.ui?.emojiDefaults || {};
const DEFAULT_EMOJI = "🧩";

const computeEmoji = (label, key) => {
  if (emojisByLabel[label]) return emojisByLabel[label];
  const altLabel = keyToLabel[key];
  if (altLabel && emojisByLabel[altLabel]) return emojisByLabel[altLabel];
  const stripped = label.replace(/\d+$/u, "").trim();
  if (emojisByLabel[stripped]) return emojisByLabel[stripped];
  return DEFAULT_EMOJI;
};

function SeccionesEntrenadas({ planData, allSections = [] }) {
  const navigate = useNavigate();
  const [countsByKey, setCountsByKey] = useState({});
  const [loading, setLoading] = useState(true);

  // Totales para progress
  const totalSecciones = allSections.length || 0;
  const maxSecciones = planData?.maxSeccionesTotales || 0;

  useEffect(() => {
    async function fetchCounts() {
      try {
        const { data } = await axios.get("http://localhost:5000/api/secciones");
        const init = {};
        SPECIAL_KEYS.forEach((k) => (init[k] = 0));

        data.forEach((s) => {
          const k = s?.sectionKey || slug(s?.title);
          if (k in init) init[k] = (init[k] || 0) + 1;
        });

        setCountsByKey(init);
      } catch (err) {
        console.error(err);
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
      <div className="flex justify-between items-start mb-6 flex-wrap gap-2">
        <motion.h1
          className="text-3xl font-extrabold text-violet-800 dark:text-violet-400"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Secciones Entrenadas ({SPECIAL_LABELS.length})
          <div className="mt-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Secciones totales globales creadas
            </p>
            <Progress
              progress={
                maxSecciones
                  ? Math.round((totalSecciones / maxSecciones) * 100)
                  : 0
              }
              size="sm"
              color="purple"
            />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {totalSecciones} / {maxSecciones} secciones usadas
            </span>
          </div>
        </motion.h1>

        <div className="flex gap-2">
          <button
            onClick={() => navigate("/secciones-sin-entrenamiento")}
            className="px-4 py-3 text-sm bg-violet-600 font-bold text-white rounded-lg shadow-md hover:scale-105 transition"
          >
            🔍 Ir a Sin Entrenamiento
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-3 text-sm bg-yellow-400 text-black rounded-lg shadow-md font-medium hover:scale-105 transition"
          >
            ⬅️ Volver
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {SPECIAL_LABELS.map((label, i) => {
          const key = SPECIAL_KEYS[i] || slug(label);
          const count = countsByKey[key] || 0;
          const icon = computeEmoji(label, key);
          return (
            <SeccionCardItem
              key={key}
              title={label}
              icon={icon}
              count={count}
              onClick={() => navigate(`/secciones/${encodeURIComponent(key)}`)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default SeccionesEntrenadas;
