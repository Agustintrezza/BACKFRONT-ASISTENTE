import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Spinner } from "flowbite-react";
import axios from "axios";
import EstadoAsistenteModal from "../EstadoAsistenteModal";
import DashboardContent from "./DashboardContent";
import { useUserPlan } from "../../hooks/useUserPlan";

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

  // 🔹 Hook que trae datos del usuario + plan
  const planData = useUserPlan();

  // Conversaciones (estado asistente incluido)
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

  // Productos, Secciones y Reservas
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-violet-100 dark:from-gray-950 dark:to-gray-900 text-gray-900 dark:text-gray-100 p-4">
      {loading || planData.loading ? (
        <div className="min-h-[300px] flex justify-center items-center">
          <Spinner size="xl" className="w-16 h-16 text-purple-600" />
        </div>
      ) : (
        <DashboardContent
          navigate={navigate}
          allProducts={allProducts}
          allSections={allSections}
          reservas={reservas}
          conversaciones={conversaciones}
          asistenteStatus={asistenteStatus}
          mensajeOffline={mensajeOffline}
          setShowModal={setShowModal}
          planData={planData}
        />
      )}

      {/* Modal de estado asistente */}
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
