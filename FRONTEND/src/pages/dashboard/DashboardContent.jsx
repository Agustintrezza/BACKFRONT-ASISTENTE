// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import clientConfig from "../../../client-config.json";

import PlanCard from "./PlanCard";
import ProductCard from "./ProductCards";
import SectionCard from "./SectionCard";

// ========= Helpers =========
const slug = (s) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim();

// ----- Secciones (labels ↔ keys) -----
const SECTION_LABELS = clientConfig.sections?.special || [];
const SECTION_KEYS = clientConfig.sections?.specialKeys?.length
  ? clientConfig.sections.specialKeys
  : SECTION_LABELS.map(slug);

const labelToSectionKey = Object.fromEntries(
  SECTION_LABELS.map((lbl, i) => [lbl, SECTION_KEYS[i] || slug(lbl)])
);
const TRAINED_SECTION_KEY_SET = new Set(SECTION_KEYS);

// ----- Productos (labels ↔ keys) -----
const PRODUCT_LABELS = clientConfig.sections?.trained || [];
const PRODUCT_KEYS = clientConfig.products?.trainedKeys?.length
  ? clientConfig.products.trainedKeys
  : PRODUCT_LABELS.map(slug);

const labelToProductKey = Object.fromEntries(
  PRODUCT_LABELS.map((lbl, i) => [lbl, PRODUCT_KEYS[i] || slug(lbl)])
);
const TRAINED_PRODUCT_KEY_SET = new Set(PRODUCT_KEYS);

// ----- Getters -----
const getProductKey = (p) => p?.categoryKey || slug(p?.category);
const getSectionKey = (s) => s?.key || slug(s?.title);

function DashboardContent({
  navigate,
  allProducts,
  allSections,
  reservas,
  conversaciones,
  asistenteStatus,
  mensajeOffline,
  setShowModal,
  planData,
}) {
  // ===== Contadores por label =====
  const countProductosByLabel = (label) => {
    const key = labelToProductKey[label] || slug(label);
    return allProducts.filter((p) => getProductKey(p) === key).length;
  };

  const countSeccionesByLabel = (label) => {
    const key = labelToSectionKey[label] || slug(label);
    return allSections.filter((s) => getSectionKey(s) === key).length;
  };

  // ===== Filtrar sin entrenar =====
  const productosSinEntrenarItems = allProducts.filter(
    (p) => !TRAINED_PRODUCT_KEY_SET.has(getProductKey(p))
  );

  const seccionesSinEntrenarItems = allSections.filter(
    (s) => !TRAINED_SECTION_KEY_SET.has(getSectionKey(s))
  );

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Tu Plan - ocupa fila completa */}
      <PlanCard
        planData={planData}
        allProducts={allProducts}
        allSections={allSections}
        productosSinEntrenarItems={productosSinEntrenarItems}
        seccionesSinEntrenarItems={seccionesSinEntrenarItems}
      />

      {/* Cards en 2 columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProductCard
          navigate={navigate}
          productosSinEntrenarItems={productosSinEntrenarItems}
          countProductosByLabel={countProductosByLabel}
          PRODUCT_LABELS={PRODUCT_LABELS}
          planData={planData}
        />

        <SectionCard
          navigate={navigate}
          seccionesSinEntrenarItems={seccionesSinEntrenarItems}
          countSeccionesByLabel={countSeccionesByLabel}
          SECTION_LABELS={SECTION_LABELS}
          planData={planData}
        />
      </div>

      {/* Reservas + Conversaciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reservas */}
        <motion.div
          onClick={() => navigate("/reservas")}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          whileHover={{ scale: 1.01 }}
          className="cursor-pointer bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl p-5 shadow hover:shadow-violet-200 dark:hover:shadow-violet-800"
        >
          <div className="bg-gradient-to-r from-violet-50 to-violet-100 dark:from-gray-800 dark:to-gray-700 p-4 rounded-md shadow-md h-full">
            <h2 className="text-lg font-semibold mb-4">
              🗓️ Reservas ({reservas.length})
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
              Administrá las reservas con IA personalizada.
            </p>
            <ul className="list-disc list-inside leading-relaxed text-sm">
              <li>
                🟡 Pendientes:{" "}
                <span className="font-bold">
                  {reservas.filter((r) => r.estado === "pendiente").length}
                </span>
              </li>
              <li>
                🟢 Atendidas:{" "}
                <span className="font-bold">
                  {reservas.filter((r) => r.estado === "atendida").length}
                </span>
              </li>
              <li>
                ⚫ Cerradas:{" "}
                <span className="font-bold">
                  {reservas.filter((r) => r.estado === "cerrada").length}
                </span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Conversaciones */}
        <motion.div
          onClick={() => navigate("/chat")}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          whileHover={{ scale: 1.01 }}
          className="cursor-pointer bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl p-5 shadow hover:shadow-violet-200 dark:hover:shadow-violet-800"
        >
          <div className="bg-gradient-to-r from-violet-50 to-violet-100 dark:from-gray-800 dark:to-gray-700 p-4 rounded-md shadow-md h-full">
            <h2 className="text-lg font-semibold mb-4">
              💬 Conversaciones ({conversaciones.length})
            </h2>
            <ul className="list-disc list-inside leading-relaxed text-sm">
              <li>
                🕒 Última:{" "}
                <span className="font-bold">
                  {conversaciones[0]?.lastMessage?.slice(0, 50) ||
                    "Sin mensajes"}
                </span>
              </li>
              <li>
                👥 Participantes únicos:{" "}
                <span className="font-bold">
                  {new Set(conversaciones.map((c) => c.userId)).size}
                </span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Asistente Virtual */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          onClick={() => setShowModal(true)}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          whileHover={{ scale: 1.01 }}
          className="cursor-pointer bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl p-5 shadow hover:shadow-violet-200 dark:hover:shadow-violet-800"
        >
          <div className="bg-gradient-to-r from-violet-50 to-violet-100 dark:from-gray-800 dark:to-gray-700 p-4 rounded-md shadow-md h-full">
            <h2 className="text-lg font-semibold mb-4">🤖 Asistente Virtual</h2>
            <ul className="list-disc list-inside leading-relaxed text-sm">
              <li>
                🔘 Estado:{" "}
                <span className="font-bold capitalize">{asistenteStatus}</span>
              </li>
              <li>
                📣 Mensaje offline:{" "}
                <span className="font-bold italic">"{mensajeOffline}"</span>
              </li>
              <li>
                💬 Conversaciones activas:{" "}
                <span className="font-bold">{conversaciones.length}</span>
              </li>
              <li>
                📨 Último mensaje:{" "}
                <span className="font-bold">
                  {conversaciones[0]?.lastMessage?.slice(0, 50) ||
                    "Sin mensajes"}
                </span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default DashboardContent;
