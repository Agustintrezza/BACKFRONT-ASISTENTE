// pages/Dashboard.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Spinner } from "flowbite-react";
import axios from "axios";
import EstadoAsistenteModal from "../pages/EstadoAsistenteModal"; // 🔄 Asegurate que el path sea correcto
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const productosEntrenadas = [
  "Tours y Excursiones",
  "Alojamiento",
  "Shows de Tango",
  "Programas",
  "Traslados",
];

const seccionesEntrenadas = [
  "Guía Turístico",
  "Tipo de cambio",
  "Preguntas Frecuentes",
  "Nosotros",
  "Contacto",
];

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

  useEffect(() => {
    const fetchConversaciones = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/chat/conversaciones`);
        setConversaciones(data);
        if (data.length > 0) {
          const conv = data[0]; // Suponemos que hay una sola config global
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
        setAllProducts(resProd.data);
        setAllSections(resSec.data);
        setReservas(resRes.data);
      } catch (err) {
        console.error("Error al traer datos:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const countProductosByCategory = (cat) =>
    allProducts.filter((p) => p.category === cat).length;

  const countSeccionesByTitle = (title) =>
    allSections.filter((s) =>
      (s.title || "").toLowerCase().trim().includes(title.toLowerCase().trim())
    ).length;

  const productosSinEntrenarItems = allProducts.filter(
    (p) => !productosEntrenadas.includes(p.category)
  );

  const seccionesSinEntrenarItems = allSections.filter(
    (s) =>
      !seccionesEntrenadas.some((ent) =>
        (s.title || "").toLowerCase().includes(ent.toLowerCase())
      )
  );

  const emojiVariants = {
    animate: {
      x: [0, 3, 0],
      transition: {
        repeat: Infinity,
        repeatDelay: 2,
        duration: 0.8,
      },
    },
  };

  const Card = ({ title, icon, children, onClick }) => (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ scale: 1.01 }}
      className="cursor-pointer bg-white text-gray-900 rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all flex flex-col justify-between hover:shadow-violet-200"
    >
      <div>
        <h2 className="text-lg font-semibold mb-4 flex justify-between items-center px-4 py-2 rounded-md bg-gradient-to-r from-gray-100 to-gray-50 text-black">
          {title}
          <motion.span className="text-4xl ml-2" variants={emojiVariants} animate="animate">
            {icon}
          </motion.span>
        </h2>
        {children}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-violet-100 text-white p-4">
      {loading ? (
        <div className="min-h-[300px] flex justify-center items-center">
          <Spinner size="xl" className="w-16 h-16 text-purple-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Productos */}
          <Card title="Productos" icon="📦">
            <p className="text-gray-700 mb-3 text-sm">
              Gestioná tus productos según su entrenamiento.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <motion.div
                onClick={() => navigate("/productos-entrenados")}
                whileHover={{ scale: 1.01 }}
                className="flex-1 bg-gradient-to-r from-violet-50 to-violet-100 p-4 rounded-md shadow-md cursor-pointer"
              >
                <h3 className="text-md font-semibold mb-2 text-violet-800">
                  ✅ Productos Entrenados
                </h3>
                <ul className="list-disc list-inside text-sm text-gray-800">
                  {productosEntrenadas.map((cat) => (
                    <li key={cat}>
                      {cat} (<span className="font-bold">{countProductosByCategory(cat)}</span>)
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div
                onClick={() => navigate("/productos-sin-entrenamiento")}
                whileHover={{ scale: 1.01 }}
                className="flex-1 bg-gradient-to-r from-violet-50 to-violet-100 p-4 rounded-md shadow-md cursor-pointer"
              >
                <h3 className="text-md font-semibold mb-2 text-violet-800">
                  ⚙️ Productos Sin Entrenamiento
                </h3>
                <ul className="list-disc list-inside text-sm text-gray-800 max-h-[120px] overflow-y-auto">
                  {productosSinEntrenarItems.map((p) => (
                    <li key={p._id}>{p.title}</li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </Card>

          {/* Secciones */}
          <Card title="Secciones" icon="🧩">
            <p className="text-gray-700 mb-3 text-sm">
              Gestioná las secciones entrenadas o libres.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <motion.div
                onClick={() => navigate("/secciones-entrenadas")}
                whileHover={{ scale: 1.01 }}
                className="flex-1 bg-gradient-to-r from-violet-50 to-violet-100 p-4 rounded-md shadow-md cursor-pointer"
              >
                <h3 className="text-md font-semibold mb-2 text-violet-800">
                  ✅ Secciones Entrenadas
                </h3>
                <ul className="list-disc list-inside text-sm text-gray-800">
                  {seccionesEntrenadas.map((sec) => (
                    <li key={sec}>
                      {sec} (<span className="font-bold">{countSeccionesByTitle(sec)}</span>)
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div
                onClick={() => navigate("/secciones-sin-entrenamiento")}
                whileHover={{ scale: 1.01 }}
                className="flex-1 bg-gradient-to-r from-violet-50 to-violet-100 p-4 rounded-md shadow-md cursor-pointer"
              >
                <h3 className="text-md font-semibold mb-2 text-violet-800">
                  🧪 Secciones Sin Entrenamiento
                </h3>
                <ul className="list-disc list-inside text-sm text-gray-800 max-h-[120px] overflow-y-auto">
                  {seccionesSinEntrenarItems.map((s) => (
                    <li key={s._id}>{s.title || "Sin título"}</li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </Card>

          {/* Reservas */}
          <Card title={`Reservas (${reservas.length})`} icon="🗓️" onClick={() => navigate("/reservas")}>
            <p className="text-gray-700 text-sm mb-2">
              Administrá las reservas con IA personalizada.
            </p>
            <div className="bg-gradient-to-r from-violet-50 to-violet-100 p-4 rounded-md shadow-md text-gray-800 text-sm">
              <h3 className="text-md font-semibold mb-2 text-violet-800">Reservas por estado</h3>
              <ul className="list-disc list-inside leading-relaxed">
                <li>🟡 Pendientes: <span className="font-bold">{reservas.filter((r) => r.estado === "pendiente").length}</span></li>
                <li>🟢 Atendidas: <span className="font-bold">{reservas.filter((r) => r.estado === "atendida").length}</span></li>
                <li>⚫ Cerradas: <span className="font-bold">{reservas.filter((r) => r.estado === "cerrada").length}</span></li>
              </ul>
            </div>
          </Card>

          {/* Chat y Estado Asistente */}
          <Card title="Asistente Virtual" icon="🤖">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Chat */}
              <div
                className="flex-1 bg-gradient-to-r from-violet-50 to-violet-100 p-4 rounded-md shadow-md text-sm text-gray-800 cursor-pointer"
                onClick={() => navigate("/chat")}>
                <h3 className="text-md font-semibold mb-2 text-violet-800">💬 Chat</h3>
                <ul className="list-disc list-inside leading-relaxed">
                  <li>🟢 Activas: <span className="font-bold">{conversaciones.length}</span></li>
                  <li>🟡 Pendientes: <span className="font-bold">{conversaciones.filter((c) => !c.respondido).length}</span></li>
                  <li>📨 Último mensaje: <span className="font-bold">{conversaciones[0]?.lastMessage?.slice(0, 50) || "Sin mensajes"}</span></li>
                </ul>
              </div>

              {/* Estado del asistente */}
              <div
                className="flex-1 bg-gradient-to-r from-violet-50 to-violet-100 p-4 rounded-md shadow-md text-sm text-gray-800 cursor-pointer"
                onClick={() => setShowModal(true)}
              >
                <h3 className="text-md font-semibold mb-2 text-violet-800">📡 Estado del Asistente</h3>
                <ul className="list-disc list-inside leading-relaxed">
                  <li>🔘 Estado: <span className="font-bold capitalize">{asistenteStatus}</span></li>
                  <li>📣 Mensaje offline: <span className="font-bold italic">"{mensajeOffline}"</span></li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      )}
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
