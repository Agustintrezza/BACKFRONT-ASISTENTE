import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { HiUserCircle } from "react-icons/hi";
import io from "socket.io-client";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

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
    if (e.key === "Enter" && adminActivo) {
      handleMessage(userInput);
    }
  };

  const toggleModoAdmin = async (estado) => {
    const confirmMsg = estado
      ? "¿Estás seguro que querés activar el modo Admin?"
      : "¿Querés desactivar el modo Admin?";
    const confirmed = window.confirm(confirmMsg);
    if (!confirmed) return;

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
      <div className="p-4 border-b flex items-center justify-between bg-violet-100 shadow-sm">
  <div className="flex items-center gap-3">
    <HiUserCircle className="text-3xl text-violet-700" />
    <div>
      <h2 className="text-lg font-bold text-violet-900">{sender}</h2>
      <p className="text-sm text-violet-700">Conversación activa</p>
    </div>
  </div>

  <div className="flex flex-col items-end">
    <p
      className={`text-sm font-semibold mb-2 ${
        adminActivo ? "text-green-600" : "text-red-500"
      }`}
    >
      Modo Manual:{" "}
      <span className="font-bold">
        {adminActivo ? "Activo ✅" : "Inactivo ❌"}
      </span>
    </p>

    <div className="flex gap-2">
      <motion.button
        onClick={() => toggleModoAdmin(true)}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="px-4 py-2 text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-md font-semibold shadow-md hover:shadow-lg transition-all duration-500 ease-in-out"
      >
        Activar Modo Admin
      </motion.button>

      <motion.button
        onClick={() => toggleModoAdmin(false)}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="px-4 py-2 text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-md font-semibold shadow-md hover:shadow-lg transition-all duration-500 ease-in-out"
      >
        Desactivar Modo Admin
      </motion.button>
    </div>
  </div>
</div>


      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto border-violet-800 px-4 py-6 space-y-4 bg-gradient-to-b from-neutral-100 to-white">
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
      <div className="p-4 border-t border-gray-300 bg-violet-100 flex gap-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            adminActivo
              ? "Escribí un mensaje..."
              : "Activá el modo manual para enviar mensajes"
          }
          className="flex-1 px-4 py-2 rounded-md border border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
          disabled={!adminActivo}
        />
        <button
          onClick={() => handleMessage(userInput)}
          disabled={!adminActivo}
          className={`px-4 py-2 rounded-md text-white font-medium ${
            adminActivo
              ? "bg-violet-600 hover:bg-violet-700"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
