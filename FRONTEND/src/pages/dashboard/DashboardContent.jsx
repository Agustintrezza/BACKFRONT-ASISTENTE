// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import clientConfig from "../../../client-config.json";
import PlanCard from "./PlanCard";

const slug = (s) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim();

// ----- Labels/Keys -----
const SECTION_LABELS = clientConfig.sections?.special || [];
const SECTION_KEYS = clientConfig.sections?.specialKeys?.length
  ? clientConfig.sections.specialKeys
  : SECTION_LABELS.map(slug);

const labelToSectionKey = Object.fromEntries(
  SECTION_LABELS.map((lbl, i) => [lbl, SECTION_KEYS[i] || slug(lbl)])
);
const TRAINED_SECTION_KEY_SET = new Set(SECTION_KEYS);

const PRODUCT_LABELS = clientConfig.sections?.trained || [];
const PRODUCT_KEYS = clientConfig.products?.trainedKeys?.length
  ? clientConfig.products.trainedKeys
  : PRODUCT_LABELS.map(slug);

const labelToProductKey = Object.fromEntries(
  PRODUCT_LABELS.map((lbl, i) => [lbl, PRODUCT_KEYS[i] || slug(lbl)])
);
const TRAINED_PRODUCT_KEY_SET = new Set(PRODUCT_KEYS);

const getProductKey = (p) => p?.categoryKey || slug(p?.category);
const getSectionKey = (s) => s?.key || slug(s?.title);

const emojiVariants = {
  animate: {
    x: [0, 3, 0],
    transition: { repeat: Infinity, repeatDelay: 2, duration: 0.8 },
  },
};

const Card = ({ title, icon, children, onClick, className = "" }) => (
  <motion.div
    onClick={onClick}
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    whileHover={{ scale: 1.01 }}
    className={`cursor-pointer bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-violet-200 dark:hover:shadow-violet-800 flex flex-col justify-between ${className}`}
  >
    <div>
      <h2 className="text-lg font-semibold mb-4 flex justify-between items-center px-4 py-2 rounded-md bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 text-black dark:text-white">
        {title}
        <motion.span
          className="text-4xl ml-2"
          variants={emojiVariants}
          animate="animate"
        >
          {icon}
        </motion.span>
      </h2>
      {children}
    </div>
  </motion.div>
);

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
  const countProductosByLabel = (label) => {
    const key = labelToProductKey[label] || slug(label);
    return allProducts.filter((p) => getProductKey(p) === key).length;
  };

  const countSeccionesByLabel = (label) => {
    const key = labelToSectionKey[label] || slug(label);
    return allSections.filter((s) => getSectionKey(s) === key).length;
  };

  const productosSinEntrenarItems = allProducts.filter(
    (p) => !TRAINED_PRODUCT_KEY_SET.has(getProductKey(p))
  );
  const seccionesSinEntrenarItems = allSections.filter(
    (s) => !TRAINED_SECTION_KEY_SET.has(getSectionKey(s))
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
      {/* 🔹 Tu Plan (ocupa todo el ancho) */}
      <div className="col-span-full">
        <PlanCard
          planData={planData}
          allProducts={allProducts}
          allSections={allSections}
        />
      </div>

      {/* Productos */}
      <Card title="Productos" icon="📦">
        <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm">
          Gestioná tus productos según su entrenamiento.
        </p>
        <div className="flex flex-col md:flex-row gap-4">
          <motion.div
            onClick={() => navigate("/productos-entrenados")}
            whileHover={{ scale: 1.01 }}
            className="flex-1 bg-gradient-to-r from-violet-50 to-violet-100 dark:from-gray-800 dark:to-gray-700 p-4 rounded-md shadow-md cursor-pointer"
          >
            <h3 className="text-md font-semibold mb-2 text-violet-800 dark:text-violet-400">
              ✅ Productos Entrenados
            </h3>
            <ul className="list-disc list-inside text-sm text-gray-800 dark:text-gray-200">
              {PRODUCT_LABELS.map((catLabel) => (
                <li key={catLabel}>
                  {catLabel} (
                  <span className="font-bold">
                    {countProductosByLabel(catLabel)}
                  </span>
                  )
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            onClick={() => navigate("/productos-sin-entrenamiento")}
            whileHover={{ scale: 1.01 }}
            className="flex-1 bg-gradient-to-r from-violet-50 to-violet-100 dark:from-gray-800 dark:to-gray-700 p-4 rounded-md shadow-md cursor-pointer"
          >
            <h3 className="text-md font-semibold mb-2 text-violet-800 dark:text-violet-400">
              ⚙️ Productos Sin Entrenamiento
            </h3>
            <ul className="list-disc list-inside text-sm text-gray-800 dark:text-gray-200 max-h-[120px] overflow-y-auto">
              {productosSinEntrenarItems.map((p) => (
                <li key={p._id}>{p.title}</li>
              ))}
            </ul>
          </motion.div>
        </div>
      </Card>

      {/* Secciones */}
      <Card title="Secciones" icon="🧩">
        <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm">
          Gestioná las secciones entrenadas o libres.
        </p>
        <div className="flex flex-col md:flex-row gap-4">
          <motion.div
            onClick={() => navigate("/secciones-entrenadas")}
            whileHover={{ scale: 1.01 }}
            className="flex-1 bg-gradient-to-r from-violet-50 to-violet-100 dark:from-gray-800 dark:to-gray-700 p-4 rounded-md shadow-md cursor-pointer"
          >
            <h3 className="text-md font-semibold mb-2 text-violet-800 dark:text-violet-400">
              ✅ Secciones Entrenadas
            </h3>
            <ul className="list-disc list-inside text-sm text-gray-800 dark:text-gray-200">
              {SECTION_LABELS.map((secLabel) => (
                <li key={secLabel}>
                  {secLabel} (
                  <span className="font-bold">
                    {countSeccionesByLabel(secLabel)}
                  </span>
                  )
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            onClick={() => navigate("/secciones-sin-entrenamiento")}
            whileHover={{ scale: 1.01 }}
            className="flex-1 bg-gradient-to-r from-violet-50 to-violet-100 dark:from-gray-800 dark:to-gray-700 p-4 rounded-md shadow-md cursor-pointer"
          >
            <h3 className="text-md font-semibold mb-2 text-violet-800 dark:text-violet-400">
              🧪 Secciones Sin Entrenamiento
            </h3>
            <ul className="list-disc list-inside text-sm text-gray-800 dark:text-gray-200 max-h-[120px] overflow-y-auto">
              {seccionesSinEntrenarItems.map((s) => (
                <li key={s._id}>{s.title || "Sin título"}</li>
              ))}
            </ul>
          </motion.div>
        </div>
      </Card>

      {/* Reservas */}
      <Card
        title={`Reservas (${reservas.length})`}
        icon="🗓️"
        onClick={() => navigate("/reservas")}
      >
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
          Administrá las reservas con IA personalizada.
        </p>
        <div className="bg-gradient-to-r from-violet-50 to-violet-100 dark:from-gray-800 dark:to-gray-700 p-4 rounded-md shadow-md text-gray-800 dark:text-gray-200 text-sm">
          <h3 className="text-md font-semibold mb-2 text-violet-800 dark:text-violet-400">
            Reservas por estado
          </h3>
          <ul className="list-disc list-inside leading-relaxed">
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
      </Card>

      {/* Chat y Estado Asistente */}
      <Card title="Asistente Virtual" icon="🤖">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Chat */}
          <div
            className="flex-1 bg-gradient-to-r from-violet-50 to-violet-100 dark:from-gray-800 dark:to-gray-700 p-4 rounded-md shadow-md text-sm text-gray-800 dark:text-gray-200 cursor-pointer"
            onClick={() => navigate("/chat")}
          >
            <h3 className="text-md font-semibold mb-2 text-violet-800 dark:text-violet-400">
              💬 Chat
            </h3>
            <ul className="list-disc list-inside leading-relaxed">
              <li>
                🟢 Activas:{" "}
                <span className="font-bold">{conversaciones.length}</span>
              </li>
              <li>
                🟡 Pendientes:{" "}
                <span className="font-bold">
                  {conversaciones.filter((c) => !c.respondido).length}
                </span>
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

          {/* Estado del asistente */}
          <div
            className="flex-1 bg-gradient-to-r from-violet-50 to-violet-100 dark:from-gray-800 dark:to-gray-700 p-4 rounded-md shadow-md text-sm text-gray-800 dark:text-gray-200 cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            <h3 className="text-md font-semibold mb-2 text-violet-800 dark:text-violet-400">
              📡 Estado del Asistente
            </h3>
            <ul className="list-disc list-inside leading-relaxed">
              <li>
                🔘 Estado:{" "}
                <span className="font-bold capitalize">{asistenteStatus}</span>
              </li>
              <li>
                📣 Mensaje offline:{" "}
                <span className="font-bold italic">
                  "{mensajeOffline}"
                </span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default DashboardContent;
