import { useEffect, useState } from "react";
import { HiArrowLeft } from "react-icons/hi";
import { Card } from "flowbite-react";
// import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";

// Componentes propios
import Sidebar from "../../pages/chat/Sidebar";
import ConversationView from "../../pages/chat/ConversationView";

// ⚡ Conexión global del socket
const socket = io("http://localhost:5000");

export default function ChatPage() {
  // const navigate = useNavigate();
  const [conversaciones, setConversaciones] = useState([]);
  const [conversationSelected, setConversationSelected] = useState(null);

  // 🔄 Cargar conversaciones
  const fetchConversaciones = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/chat/conversaciones");
      setConversaciones(data);

      if (!conversationSelected && data.length > 0) {
        setConversationSelected(data[0]);
      }
    } catch (err) {
      console.error("Error al cargar conversaciones:", err);
    }
  };

  // 📡 Cargar al montar
  useEffect(() => {
    fetchConversaciones();
  }, []);

  // 🔄 Escuchar actualizaciones generales
  useEffect(() => {
    socket.on("nueva_conversacion", (nueva) => {
      setConversaciones((prev) => {
        const index = prev.findIndex((c) => c.sender === nueva.sender);
        if (index !== -1) {
          const nuevas = [...prev];
          nuevas[index] = nueva;
          return nuevas;
        } else {
          return [nueva, ...prev];
        }
      });
    });

    socket.on("actualizar_conversacion", (actualizada) => {
      setConversaciones((prev) =>
        prev.map((conv) =>
          conv.sender === actualizada.sender ? actualizada : conv
        )
      );

      if (
        conversationSelected &&
        conversationSelected.sender === actualizada.sender
      ) {
        setConversationSelected(actualizada);
      }
    });

    return () => {
      socket.off("nueva_conversacion");
      socket.off("actualizar_conversacion");
    };
  }, [conversationSelected]);

  // 🧠 Unirse a la sala cuando cambia la conversación seleccionada
  useEffect(() => {
    if (conversationSelected?.sender) {
      socket.emit("join", conversationSelected.sender);
    }
  }, [conversationSelected]);

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100">
      {/* Header */}
      {/* <div className="flex items-center p-4 bg-white shadow">
        <button
          onClick={() => navigate("/admin")}
          className="flex items-center gap-2 text-sm text-gray-700 hover:text-violet-600"
        >
          <HiArrowLeft className="text-xl" />
          Volver
        </button>
      </div> */}

      {/* Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-300 bg-white overflow-y-auto">
          <Sidebar
            conversaciones={conversaciones}
            selected={conversationSelected}
            onSelect={setConversationSelected}
          />
        </div>

        {/* Vista de conversación */}
        <div className="flex-1 overflow-hidden">
          {conversationSelected ? (
            <ConversationView
              conversation={conversationSelected}
              socket={socket}
            />
          ) : (
            <Card className="m-4">
              <p className="text-gray-600">
                Seleccioná una conversación para comenzar.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
