import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button } from "flowbite-react";
import { HiUserCircle } from "react-icons/hi";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function ConversationView({ conversation }) {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [adminActivo, setAdminActivo] = useState(false);
  const messagesEndRef = useRef(null);
  const sender = conversation?.sender;

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const loadHistorial = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/chat/conversaciones/${sender}`
        );
        setMessages(data.mensajes);
        setAdminActivo(data.adminActivo || false);
      } catch (err) {
        console.error("Error cargando historial:", err);
      }
    };

    if (sender) loadHistorial();
  }, [sender]);

  useEffect(() => {
    const handler = (actualizada) => {
      if (actualizada.sender === sender) {
        setMessages(actualizada.mensajes);
        setAdminActivo(actualizada.adminActivo || false);
      }
    };

    socket.on("actualizar_conversacion", handler);
    return () => socket.off("actualizar_conversacion", handler);
  }, [sender]);

  useEffect(scrollToBottom, [messages]);

  const handleMessage = async (text) => {
    if (!text.trim()) return;

    const nuevoMensaje = { from: "user", text, timestamp: new Date() };
    setMessages((prev) => [...prev, nuevoMensaje]);
    setUserInput("");

    try {
      await axios.post("http://localhost:5000/api/chat/enviarManual", {
        sender,
        text,
      });
    } catch (err) {
      console.error("Error enviando mensaje:", err);
      const fallback = {
        from: "bot",
        text: "⚠️ Error al enviar mensaje.",
      };
      setMessages((prev) => [...prev, fallback]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleMessage(userInput);
    }
  };

  const toggleModoAdmin = async (estado) => {
    try {
      await axios.patch("http://localhost:5000/api/chat/modo-admin", {
        sender,
        adminActivo: estado,
      });
      setAdminActivo(estado);
    } catch (err) {
      console.error("Error al cambiar modo admin:", err);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-neutral-100">
      {/* Header */}
      <div className="p-4 border-b border-gray-300 flex items-center justify-between bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <HiUserCircle className="text-3xl text-violet-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{sender}</h2>
            <p className="text-sm text-gray-500">Conversación activa</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-xs mb-1 text-gray-700">
            Modo Admin:{" "}
            <span className={adminActivo ? "text-green-600" : "text-red-500"}>
              {adminActivo ? "Activo ✅" : "Inactivo ❌"}
            </span>
          </p>
          <div className="flex gap-2">
            <Button
              size="xs"
              color="success"
              onClick={() => toggleModoAdmin(true)}
            >
              Activar Modo Admin
            </Button>
            <Button
              size="xs"
              color="failure"
              onClick={() => toggleModoAdmin(false)}
            >
              Desactivar Modo Admin
            </Button>
          </div>
        </div>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-xl px-4 py-2 rounded-lg whitespace-pre-wrap text-sm ${
              msg.from === "user"
                ? "bg-yellow-400 text-black self-end ml-auto"
                : msg.from === "admin"
                ? "bg-violet-200 text-violet-800 self-end ml-auto"
                : "bg-white text-gray-800 self-start mr-auto shadow"
            }`}
          >
            {msg.text}
            {msg.buttons && msg.buttons.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {msg.buttons.map((btn, j) => (
                  <button
                    key={j}
                    onClick={() => handleMessage(btn.payload)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                  >
                    {btn.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-300 bg-white flex gap-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribí un mensaje..."
          className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <Button
          onClick={() => handleMessage(userInput)}
          className="!bg-violet-600 text-white hover:bg-violet-700"
        >
          Enviar
        </Button>
      </div>
    </div>
  );
}
