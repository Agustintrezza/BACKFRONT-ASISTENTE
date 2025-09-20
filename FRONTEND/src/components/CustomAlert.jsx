// pages/Dashboard.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Spinner } from "flowbite-react";
import axios from "axios";
import EstadoAsistenteModal from "../pages/EstadoAsistenteModal";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

// Config y hooks
import clientConfig from "../../client-config.json";
import { useUserPlan } from "../hooks/useUserPlan";

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
const SECTION_KEYS =
  clientConfig.sections?.specialKeys?.length
    ? clientConfig.sections.specialKeys
    : SECTION_LABELS.map(slug);

const labelToSectionKey = Object.fromEntries(
  SECTION_LABELS.map((lbl, i) => [lbl, SECTION_KEYS[i] || slug(lbl)])
);

const TRAINED_SECTION_KEY_SET = new Set(SECTION_KEYS);

// ----- Productos (labels ↔ keys) -----
const PRODUCT_LABELS = clientConfig.sections?.trained || [];
const PRODUCT_KEYS =
  clientConfig.products?.trainedKeys?.length
    ? clientConfig.products.trainedKeys
    : PRODUCT_LABELS.map(slug);

const labelToProductKey = Object.fromEntries(
  PRODUCT_LABELS.map((lbl, i) => [lbl, PRODUCT_KEYS[i] || slug(lbl)])
);

const TRAINED_PRODUCT_KEY_SET = new Set(PRODUCT_KEYS);

// ----- Getters de key en docs -----
const getProductKey = (p) => p?.categoryKey || slug(p?.category);
const getSectionKey = (s) => s?.key || slug(s?.title);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState([]);
  const [allSections, setAllSections] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [conversaciones, setConversaciones] = useState([]);
  const [asistenteStatus, setAsistenteStatus] = useState("online");
  const [mensajeOffline, setMensajeOffline] = useState("Volvemos en breve.");
  const [showModal, setShowModal] = useState(false);

  // 👉 Hook del plan de usuario (traído desde backend)
  const {
    planName,
    maxUsers,
    maxConsultas,
    consultasRestantes,
    channels,
    maxConversaciones,
    maxReservas,
    loading: planLoading,
  } = useUserPlan();

  useEffect(() => {
    const fetchConversaciones = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/chat/conversaciones`);
        setConversaciones(data);
        if (data.length > 0) {
          const conv = data[0];
          setAsistenteStatus(conv.modoOffline ? "offline" : "online");
          setMensajeOffline(conv.mensajeOffline || "");
        }
      } catch (err) {
        console.error("Error al traer conversaciones:", err);
      }
    };
    fetchConversaciones();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const resProd = await axios.get(`${API_URL}/productos`);
        const resSec = await axios.get(`${API_URL}/secciones`);
        const resRes = await axios.get(`${API_URL}/reservas`);
        setAllProducts(resProd.data || []);
        setAllSections(resSec.data || []);
        setReservas(resRes.data || []);
      } catch (err) {
        console.error("Error al traer datos:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // ===== Contadores por label =====
  const countProductosByLabel = (label) => {
    const key = labelToProductKey[label] || slug(label);
    return allProducts.filter((p) => getProductKey(p) === key).length;
  };

  const countSeccionesByLabel = (label) => {
    const key = labelToSectionKey[label] || slug(label);
    return allSections.filter((s) => getSectionKey(s) === key).length;
  };

  // ===== “Sin entrenamiento” =====
  const productosSinEntrenarItems = allProducts.filter(
    (p) => !TRAINED_PRODUCT_KEY_SET.has(getProductKey(p))
  );

  const seccionesSinEntrenarItems = allSections.filter(
    (s) => !TRAINED_SECTION_KEY_SET.has(getSectionKey(s))
  );

  const emojiVariants = {
    animate: {
      x: [0, 3, 0],
      transition: { repeat: Infinity, repeatDelay: 2, duration: 0.8 },
    },
  };

  const Card = ({ title, icon, children, onClick }) => (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ scale: 1.01 }}
      className="cursor-pointer bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-violet-200 dark:hover:shadow-violet-800 flex flex-col justify-between"
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

  if (loading || planLoading) {
    return (
      <div className="min-h-[300px] flex justify-center items-center">
        <Spinner size="xl" className="w-16 h-16 text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-violet-100 dark:from-gray-950 dark:to-gray-900 text-gray-900 dark:text-gray-100 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Panel del plan */}
        <Card title="Tu Plan" icon="📊">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
            Estás en el plan <span className="font-bold">{planName}</span>.
          </p>
          <ul className="list-disc list-inside text-sm leading-relaxed">
            <li>👥 Usuarios máximos: <span className="font-bold">{maxUsers}</span></li>
            <li>💬 Consultas: <span className="font-bold">{consultasRestantes} / {maxConsultas}</span></li>
            <li>🌐 Canales habilitados: <span className="font-bold">{channels.join(", ")}</span></li>
            <li>📦 Productos creados: <span className="font-bold">{allProducts.length}</span></li>
            <li>🧩 Secciones creadas: <span className="font-bold">{allSections.length}</span></li>
            <li>💾 Conversaciones archivables: <span className="font-bold">{maxConversaciones}</span></li>
            <li>🗓️ Reservas archivables: <span className="font-bold">{maxReservas}</span></li>
          </ul>
        </Card>

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
                  <span className="font-bold italic">"{mensajeOffline}"</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      <EstadoAsistenteModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={(updated) => {
          setAsistenteStatus(updated.modoOffline ? "offline" : "online");
          setMensajeOffline(updated.mensajeOffline || "");
        }}
      />
    </div>
  );
}

export default Dashboard;
