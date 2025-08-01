import { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { HiChatAlt2 } from "react-icons/hi";
import { BsCheck2All } from "react-icons/bs";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ selected, onSelect }) {
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();

  // 🔄 Cargar conversaciones cada 3 segundos
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/chat/conversaciones");
        setConversations(data);

        // Restaurar selección si hay guardado
        const savedSender = sessionStorage.getItem("selectedSender");
        if (savedSender && !selected) {
          const conv = data.find((c) => c.sender === savedSender);
          if (conv) onSelect(conv);
        }
      } catch (err) {
        console.error("Error cargando conversaciones:", err);
      }
    };

    fetchConversations();
    const interval = setInterval(fetchConversations, 3000);
    return () => clearInterval(interval);
  }, [selected, onSelect]);

  // 💾 Guardar en sessionStorage
  useEffect(() => {
    if (selected?.sender) {
      sessionStorage.setItem("selectedSender", selected.sender);
    }
  }, [selected]);

  return (
    <div className="h-screen flex flex-col">
      {/* Header con botón de volver */}
      <div className="px-4 py-4 border-b border-gray-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HiChatAlt2 className="text-2xl text-violet-600" />
          <h2 className="text-xl font-semibold text-gray-800">Conversaciones</h2>
        </div>
        <motion.button
          onClick={() => navigate("/dashboard")}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="px-4 py-2 text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-md font-medium shadow-md hover:shadow-lg transition-all duration-500 ease-in-out flex items-center gap-2"
        >
          <span className="text-lg">⬅️</span>
          <span>Volver</span>
        </motion.button>
      </div>

      {/* Lista de conversaciones */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            No hay conversaciones activas.
          </div>
        ) : (
          conversations.map((conv, idx) => {
            const isSelected = selected?.sender === conv.sender;
            const lastMsg = conv.lastMessage || "Sin mensajes";
            const time = conv.timestamp
              ? format(new Date(conv.timestamp), "HH:mm", { locale: es })
              : "--:--";

            return (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.01 }}
                onClick={() => onSelect(conv)}
                className={`px-4 py-3 cursor-pointer border-b border-gray-100 transition-all ${
                  isSelected
                    ? "bg-violet-100 border-l-4 border-violet-500"
                    : "hover:bg-violet-50"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-sm font-semibold text-gray-800 truncate">
                    🧍 {conv.sender}
                  </h3>
                  <span className="text-xs text-gray-400">{time}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-600">
                  <p className="truncate">{lastMsg}</p>
                  {conv.respondido && (
                    <BsCheck2All className="text-green-500 ml-2 text-base" />
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
