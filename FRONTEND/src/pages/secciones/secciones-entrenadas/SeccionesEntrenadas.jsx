// ==============================
// src/pages/secciones/secciones-entrenadas/SeccionesEntrenadas.jsx
// ==============================

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner, Progress } from "flowbite-react";
import axios from "axios";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import clientConfig from "../../../../client-config.json";
import { useUserPlan } from "../../../hooks/useUserPlan"; // ✅ importante para el plan del usuario

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

const emojiVariants = {
  animate: {
    x: [0, 3, 0],
    transition: { repeat: Infinity, repeatDelay: 2, duration: 0.8 },
  },
};

function SeccionesEntrenadas() {
  const navigate = useNavigate();
  const [countsByKey, setCountsByKey] = useState({});
  const [allSections, setAllSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const planData = useUserPlan(); // ✅ Traemos el plan actual

  // === Traer secciones del backend ===
  useEffect(() => {
    async function fetchSections() {
      try {
        const { data } = await axios.get("http://localhost:5000/api/secciones");
        setAllSections(data);

        const initCounts = {};
        SPECIAL_KEYS.forEach((k) => (initCounts[k] = 0));

        data.forEach((s) => {
          const k = s?.sectionKey || slug(s?.title);
          if (k in initCounts) initCounts[k] = (initCounts[k] || 0) + 1;
        });

        setCountsByKey(initCounts);
      } catch (err) {
        console.error("❌ Error al obtener secciones:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSections();
  }, []);

  // === Totales para progress bar ===
  const totalSecciones = allSections.length || 0;
  const maxSecciones = planData?.maxSeccionesTotales || 0;
  const porcentaje = maxSecciones
    ? Math.round((totalSecciones / maxSecciones) * 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <Spinner size="xl" className="w-16 h-16 text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-violet-200 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100 p-6">
      {/* Header + botones */}
      <div className="flex justify-between items-start mb-6 flex-wrap gap-3">
        <motion.h1
          className="text-4xl font-extrabold"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-blue-800 to-violet-800 dark:from-white dark:via-blue-400 dark:to-violet-400">
            Secciones Entrenadas ({SPECIAL_LABELS.length})
          </span>

          {/* Progress bar */}
          <div className="mt-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Secciones totales globales creadas
            </p>
            <Progress progress={porcentaje} size="sm" color="purple" />
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
            <motion.div
              key={key}
              onClick={() =>
                navigate(`/secciones/${encodeURIComponent(key)}`)
              }
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              whileHover={{ scale: 1.01 }}
              className="cursor-pointer bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all flex flex-col justify-between hover:shadow-violet-200"
            >
              <div>
                <h2 className="text-2xl font-bold mb-4 flex justify-between items-center px-2 py-2">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-blue-800 to-violet-800 dark:from-white dark:via-blue-400 dark:to-violet-400">
                    {label}
                  </span>
                  <motion.span
                    className="text-4xl ml-2"
                    variants={emojiVariants}
                    animate="animate"
                  >
                    {icon}
                  </motion.span>
                </h2>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Total de registros:{" "}
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {count}
                  </span>
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default SeccionesEntrenadas;
