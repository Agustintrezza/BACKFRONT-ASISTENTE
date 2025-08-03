import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { HiUserCircle } from "react-icons/hi";
import io from "socket.io-client";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import NotaInterna from "./NotaInternaEditor";
import { Spinner } from "flowbite-react";

const socket = io("http://localhost:5000");

function formatearHora(fecha) {
  return new Date(fecha).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ConversationView({ conversation }) {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [adminActivo, setAdminActivo] = useState(false);
  const [showNota, setShowNota] = useState(false);
  const [notaInterna, setNotaInterna] = useState("");
  const [loading, setLoading] = useState(true);
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
        setMessages(data.mensajes || []);
        setAdminActivo(data.adminActivo || false);
        setNotaInterna(data.notaInterna || "");
      } catch (err) {
        console.error("Error cargando historial:", err);
      } finally {
        setLoading(false);
      }
    };

    if (sender) loadHistorial();
  }, [sender]);

  useEffect(() => {
    const handler = (actualizada) => {
      if (actualizada.sender === sender) {
        setMessages(actualizada.mensajes);
        setAdminActivo(actualizada.adminActivo || false);
        setNotaInterna(actualizada.notaInterna || "");
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

  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center bg-white">
        <Spinner size="xl" color="purple" />
      </div>
    );
  }

  let ultimaFechaMostrada = null;

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

        <div className="flex flex-col items-end gap-2">
          <p
            className={`text-sm font-semibold ${
              adminActivo ? "text-green-600" : "text-red-500"
            }`}
          >
            Modo Manual:{" "}
            <span className="font-bold">
              {adminActivo ? "Activo ✅" : "Inactivo ❌"}
            </span>
          </p>

          <div className="relative flex gap-2">
            <motion.button
              onClick={() => toggleModoAdmin(true)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="px-4 py-2 text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-md font-semibold shadow-md hover:shadow-lg"
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
              className="px-4 py-2 text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-md font-semibold shadow-md hover:shadow-lg"
            >
              Desactivar Modo Admin
            </motion.button>

            <motion.button
              onClick={() => setShowNota((prev) => !prev)}
              whileHover={{ scale: 1.05 }}
              className="relative px-3 py-1 text-xs bg-yellow-200 hover:bg-yellow-300 text-yellow-900 rounded-md font-semibold shadow-sm"
            >
              📝 Nota Interna
              {notaInterna && (
                <span className="absolute -top-1.5 -right-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  1
                </span>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-gradient-to-b from-neutral-100 to-white">
        {messages.map((msg, i) => {
          const fechaMsg = new Date(msg.timestamp);
          const fechaActual = fechaMsg.toDateString();
          const mostrarFecha =
            !ultimaFechaMostrada || ultimaFechaMostrada !== fechaActual;

          if (mostrarFecha) {
            ultimaFechaMostrada = fechaActual;
          }

          const isRight = msg.from === "user" || msg.from === "admin";

          return (
            <div key={i} className="flex flex-col items-center gap-1 w-full">
              {mostrarFecha && (
                <div className="text-xs text-violet-900 font-semibold my-1 px-4 py-1 bg-violet-100 border border-violet-300 rounded-full shadow-sm">
                  {formatearFecha(fechaMsg)}
                </div>
              )}

              <div
                className={`flex ${isRight ? "justify-end" : "justify-start"} items-end w-full gap-1`}
              >
                <div
                  className={`max-w-xl px-4 py-2 rounded-lg whitespace-pre-wrap text-sm ${
                    msg.from === "user"
                      ? "bg-yellow-300 text-black"
                      : msg.from === "admin"
                      ? "bg-violet-200 text-violet-800"
                      : "bg-white text-gray-800 shadow"
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

                <span className="text-[11px] text-violet-500 mb-0.5 min-w-[35px] text-right">
                  {formatearHora(msg.timestamp)}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-300 bg-violet-100 flex gap-2 relative">
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

        {notaInterna && (
          <button
            onClick={() => setShowNota((prev) => !prev)}
            className="absolute top-1 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full hover:bg-red-600 transition"
          >
            Esta conversación tiene una nota interna
          </button>
        )}
      </div>

      {/* Modal Nota Interna */}
      {showNota && (
        <NotaInterna
          sender={sender}
          notaActual={notaInterna}
          onClose={() => setShowNota(false)}
          onActualizado={(nuevaData) => {
            setNotaInterna(nuevaData.notaInterna || "");
          }}
        />
      )}
    </div>
  );
}
