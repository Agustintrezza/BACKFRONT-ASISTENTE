// src/pages/dashboard/SectionCard.jsx
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Progress } from "flowbite-react";
import clientConfig from "../../../client-config.json";

const SectionCard = ({
  navigate,
  seccionesSinEntrenarItems = [],
  countSeccionesByLabel,
  SECTION_LABELS = [],
  planData,
}) => {
  // ===== Totales =====
  const totalEntrenadas = SECTION_LABELS.reduce(
    (acc, label) => acc + countSeccionesByLabel(label),
    0
  );
  const totalSinEntrenar = seccionesSinEntrenarItems.length;
  const totalSecciones = totalEntrenadas + totalSinEntrenar;

  // ===== Límite del plan =====
  const maxSecciones = planData?.maxSeccionesTotales || 0;
  const porcentaje =
    maxSecciones > 0 ? Math.round((totalSecciones / maxSecciones) * 100) : 0;

  // ===== Emojis desde config =====
  const emojiDefaults = clientConfig.ui?.emojiDefaults || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ scale: 1.01 }}
      className="cursor-pointer bg-white dark:bg-gray-900 
                 text-gray-900 dark:text-gray-100 
                 rounded-2xl p-5 shadow 
                 hover:shadow-violet-200 dark:hover:shadow-violet-800"
    >
      {/* ===== Título global con Progress ===== */}
      <h2 className="text-lg font-semibold mb-2 flex flex-col gap-2 
                     px-4 py-2 rounded-md 
                     bg-gradient-to-r from-gray-100 to-gray-50 
                     dark:from-gray-800 dark:to-gray-700 
                     text-black dark:text-white">
        🧩 Secciones ({totalSecciones})
        <Progress progress={porcentaje} size="sm" color="purple" />
        <span className="text-xs text-gray-600 dark:text-gray-400">
          {totalSecciones} / {maxSecciones} secciones usadas
        </span>
      </h2>

      <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">
        Gestioná tus secciones según su entrenamiento.
      </p>

      {/* ===== Secciones Entrenadas ===== */}
      <div
        onClick={() => navigate("/secciones-entrenadas")}
        className="mb-4 bg-gradient-to-r from-violet-50 to-violet-100 
                   dark:from-gray-800 dark:to-gray-700 
                   p-4 rounded-md shadow-md"
      >
        <h3 className="text-md font-semibold mb-2 
                       text-violet-800 dark:text-violet-400">
          ✅ Secciones Entrenadas ({totalEntrenadas})
        </h3>
        <ul className="list-disc list-inside text-sm 
                       text-gray-800 dark:text-gray-200 space-y-1">
          {SECTION_LABELS.map((secLabel) => (
            <li key={secLabel}>
              {emojiDefaults[secLabel] || "🧩"} {secLabel} (
              <span className="font-bold">
                {countSeccionesByLabel(secLabel)}
              </span>
              )
            </li>
          ))}
        </ul>
      </div>

      {/* ===== Secciones Sin Entrenamiento ===== */}
      <div
        onClick={() => navigate("/secciones-sin-entrenamiento")}
        className="bg-gradient-to-r from-violet-50 to-violet-100 
                   dark:from-gray-800 dark:to-gray-700 
                   p-4 rounded-md shadow-md"
      >
        <h3 className="text-md font-semibold mb-2 
                       text-violet-800 dark:text-violet-400">
          🧪 Secciones Sin Entrenamiento ({totalSinEntrenar})
        </h3>
        {totalSinEntrenar === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            No hay secciones sin entrenar.
          </p>
        ) : (
          <ul className="list-disc list-inside text-sm 
                         text-gray-800 dark:text-gray-200 
                         max-h-[120px] overflow-y-auto space-y-1">
            {seccionesSinEntrenarItems.map((s) => (
              <li key={s._id}>🧩 {s.title || "Sin título"}</li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
};

export default SectionCard;
