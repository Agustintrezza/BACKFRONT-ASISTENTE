import { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { HiChatAlt2 } from "react-icons/hi";
import { BsCheck2All } from "react-icons/bs";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const estados = {
  none: { emoji: "➖", bg: "" },
  pendiente: { emoji: "🟡", bg: "bg-yellow-100" },
  urgente: { emoji: "🔴", bg: "bg-red-100" },
  resuelto: { emoji: "✅", bg: "bg-green-100" },
};

export default function Sidebar({ selected, onSelect }) {
  const [conversations, setConversations] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [responsableOpenId, setResponsableOpenId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/chat/conversaciones`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setConversations(data);

        const savedSender = sessionStorage.getItem("selectedSender");
        if (savedSender && !selected) {
          const conv = data.find((c) => c.sender === savedSender);
          if (conv) onSelect(conv);
        }
      } catch (err) {
        console.error("Error cargando conversaciones:", err);
      }
    };

    const fetchUsuarios = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/usuarios`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUsuarios(res.data);
      } catch (err) {
        console.error("Error al obtener usuarios:", err);
      }
    };

    fetchConversations();
    fetchUsuarios();
    const interval = setInterval(fetchConversations, 3000);
    return () => clearInterval(interval);
  }, [selected, onSelect]);

  useEffect(() => {
    if (selected?.sender) {
      sessionStorage.setItem("selectedSender", selected.sender);
    }
  }, [selected]);

  const handleDeleteConversation = async (sender) => {
    const confirmed = window.confirm(`¿Eliminar la conversación con ${sender}?`);
    if (!confirmed) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/chat/conversaciones/${sender}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setConversations((prev) => prev.filter((c) => c.sender !== sender));
      if (selected?.sender === sender) {
        onSelect(null);
        sessionStorage.removeItem("selectedSender");
      }
    } catch (err) {
      console.error("Error eliminando conversación:", err);
      alert("Hubo un error al eliminar.");
    }
  };

  const handleStatusChange = async (sender, currentStatus) => {
    const keys = Object.keys(estados);
    const next = keys[(keys.indexOf(currentStatus) + 1) % keys.length];

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/chat/conversaciones/${sender}/status`,
        { status: next },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setConversations((prev) =>
        prev.map((c) => (c.sender === sender ? { ...c, status: next } : c))
      );
    } catch (err) {
      console.error("Error actualizando estado:", err);
    }
  };

  const handleResponsableChange = async (sender, responsable) => {
    try {
      const value = responsable === "" ? null : responsable;
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/chat/conversaciones/${sender}/responsable`,
        { responsable: value },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setConversations((prev) =>
        prev.map((c) => (c.sender === sender ? { ...c, responsable: value } : c))
      );
    } catch (err) {
      console.error("Error asignando responsable:", err);
    }
  };

  return (
    <div className="h-screen flex flex-col relative z-10">
      <div className="px-4 py-4 border-b border-gray-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HiChatAlt2 className="text-2xl text-violet-600" />
          <h2 className="text-xl font-semibold text-gray-800">Conversaciones</h2>
        </div>
        <motion.button
          onClick={() => navigate("/dashboard")}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="px-2.5 py-2 text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-md font-medium shadow-md hover:shadow-lg flex items-center gap-2"
        >
          ⬅️
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="text-center py-10 text-gray-400">No hay conversaciones activas.</div>
        ) : (
          conversations.map((conv, idx) => {
            const isSelected = selected?.sender === conv.sender;
            const status = conv.status || "none";
            const lastMsg = conv.lastMessage || "Sin mensajes";
            const time = conv.timestamp
              ? format(new Date(conv.timestamp), "HH:mm", { locale: es })
              : "--:--";

            return (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.01 }}
                onClick={() => onSelect(conv)}
                className={`px-4 py-3 cursor-pointer border-b border-gray-100 transition-all relative z-0 ${
                  isSelected
                    ? "bg-violet-100 border-l-4 border-violet-500"
                    : estados[status].bg
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-sm font-semibold text-gray-800 truncate flex items-center gap-2">
                    👤 {conv.sender}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteConversation(conv.sender);
                      }}
                      title="Eliminar"
                      className="hover:scale-110 transition-transform"
                    >
                      🗑️
                    </button>
                  </h3>
                  <span className="text-xs text-gray-400">{time}</span>
                </div>

                <div className="flex justify-between items-center text-xs text-gray-600 relative">
                  <div className="flex flex-col w-3/4">
                    <p className="truncate">{lastMsg.slice(0, 70)}...</p>
                    {conv.responsable && (
                      <span className="text-[10px] text-blue-500 mt-0.5 italic">
                        {conv.responsable}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-auto relative z-30">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(conv.sender, status);
                      }}
                      title="Cambiar estado"
                      className="hover:scale-125 transition-transform text-lg"
                    >
                      {estados[status].emoji}
                    </button>

                    <div className="relative">
                      <span
                        className="cursor-pointer text-xl"
                        title="Asignar responsable"
                        onClick={(e) => {
                          e.stopPropagation();
                          setResponsableOpenId((prev) =>
                            prev === conv.sender ? null : conv.sender
                          );
                        }}
                      >
                        👤
                      </span>

                      {responsableOpenId === conv.sender && (
                        <select
                          autoFocus
                          onBlur={() => setResponsableOpenId(null)}
                          onChange={(e) => {
                            handleResponsableChange(conv.sender, e.target.value);
                            setResponsableOpenId(null);
                          }}
                          value={conv.responsable || ""}
                          className="absolute top-6 right-0 bg-white border text-xs border-gray-300 rounded shadow z-50"
                        >
                          <option value="">Sin responsable</option>
                          {usuarios.map((u) => (
                            <option key={u._id} value={u.email}>
                              {u.email}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    {conv.respondido && (
                      <BsCheck2All className="text-green-500 ml-1 text-base" />
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
