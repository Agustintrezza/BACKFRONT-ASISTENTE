import { useEffect, useState } from "react";
import axios from "axios";
import { Label, Button } from "flowbite-react";
import { HiX } from "react-icons/hi";
import Swal from "sweetalert2";
import TextareaWithEditor from "../components/inputs-emojis/TextAreaWithEditor";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function EstadoAsistenteModal({ open, onClose, onSave }) {
  const [modoOffline, setModoOffline] = useState(false);
  const [mensajeOffline, setMensajeOffline] = useState("");

  useEffect(() => {
    if (!open) return;

    const fetchEstado = async () => {
      try {
        const res = await axios.get(`${API_URL}/chat/status-global`);
        setModoOffline(res.data?.online === false);
        setMensajeOffline(res.data?.mensajeOffline || "");
      } catch (err) {
        console.error("❌ Error cargando estado:", err);
        Swal.fire({
          icon: "error",
          title: "Error al cargar",
          text: "No se pudo obtener el estado del asistente.",
          confirmButtonColor: "#ef4444",
        });
      }
    };

    fetchEstado();
  }, [open]);

  const handleGuardar = async () => {
    try {
      const payload = {
        online: !modoOffline,
        mensajeOffline: mensajeOffline.trim(),
      };

      await axios.patch(`${API_URL}/chat/status-global`, payload);

      Swal.fire({
        icon: "success",
        title: "Guardado",
        text: "El estado del asistente se actualizó correctamente.",
        confirmButtonColor: "#3b82f6",
      });

      onSave?.({
        modoOffline,
        mensajeOffline,
      });

      onClose();
    } catch (err) {
      console.error("❌ Error al guardar estado:", err);
      Swal.fire({
        icon: "error",
        title: "Error al guardar",
        text: "No se pudo actualizar el estado del asistente.",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -60 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 bg-gray-200 flex justify-center items-center px-2"
    >
      <div className="relative w-full max-w-3xl rounded-3xl bg-gradient-to-br from-white via-violet-50 to-violet-100 shadow-xl p-10 overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-3xl text-red-500 hover:text-red-700 transition"
          title="Cerrar"
        >
          <HiX />
        </button>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-10 text-gray-900"
        >
          <h2 className="text-4xl font-extrabold flex justify-center items-center gap-3">
            <span className="text-5xl">🧠</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-violet-700 to-violet-700">
              Estado del Asistente
            </span>
          </h2>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                id="modoOffline"
                checked={modoOffline}
                onChange={() => setModoOffline(!modoOffline)}
                className="w-5 h-5 text-violet-600 rounded focus:ring-violet-500"
              />
              <Label
                htmlFor="modoOffline"
                className="text-lg font-medium text-violet-800"
              >
                ¿El asistente está en modo offline?
              </Label>
            </div>

            {modoOffline && (
              <div>
                <Label
                  value="Mensaje automático cuando está offline"
                  className="text-violet-800 font-semibold mb-1"
                />
                <TextareaWithEditor
                  value={mensajeOffline}
                  onChange={setMensajeOffline}
                  rows={8}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4 mt-2">
            <Button
              type="button"
              onClick={onClose}
              className="bg-gradient-to-r from-red-400 to-pink-500 text-white font-semibold px-6 py-2 rounded-full shadow-md hover:scale-105 transition"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleGuardar}
              className="bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold px-6 py-2 rounded-full shadow-md hover:scale-105 transition"
            >
              Guardar
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default EstadoAsistenteModal;
