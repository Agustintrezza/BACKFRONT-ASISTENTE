import { useState, useEffect } from "react";
import { Card } from "flowbite-react";
import io from "socket.io-client";
import axios from "axios";

// Componentes
import Sidebar from "../../pages/chat/Sidebar";
import ConversationView from "../../pages/chat/ConversationView";

// ⚡ Conexión global del socket
const socket = io("http://localhost:5000");

export default function ChatPage() {
  const [conversaciones, setConversaciones] = useState([]);
  const [conversationSelected, setConversationSelected] = useState(null);

  // 🔄 Cargar conversaciones
  const fetchConversaciones = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/chat/conversaciones"
      );
      setConversaciones(data);

      if (!conversationSelected && data.length > 0) {
        setConversationSelected(data[0]);
      }
    } catch (err) {
      console.error("Error al cargar conversaciones:", err);
    }
  };

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

  useEffect(() => {
    if (conversationSelected?.sender) {
      socket.emit("join", conversationSelected.sender);
    }
  }, [conversationSelected]);

  return (
    <div className="h-screen w-full flex bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-hidden">
      {/* Sidebar de Conversaciones */}
      <div className="w-96 border-r border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-y-auto">
        <Sidebar
          conversaciones={conversaciones}
          selected={conversationSelected}
          onSelect={setConversationSelected}
        />
      </div>

      {/* Contenedor de conversación */}
      <div className="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-950">
        {conversationSelected ? (
          <ConversationView
            conversation={conversationSelected}
            socket={socket}
          />
        ) : (
          <Card className="m-4 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <p className="text-gray-600 dark:text-gray-400">
              Seleccioná una conversación para comenzar.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
