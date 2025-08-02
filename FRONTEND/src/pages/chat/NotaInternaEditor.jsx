// components/NotaInternaEditor.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { HiPencil, HiCheck, HiX } from "react-icons/hi";

// URL base
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function NotaInternaEditor({ sender, onClose }) {
  const [editando, setEditando] = useState(false);
  const [nota, setNota] = useState("");
  const [cargando, setCargando] = useState(false);
  const [cargandoInicial, setCargandoInicial] = useState(true);

  useEffect(() => {
    const fetchNota = async () => {
      try {
        const url = `${API_URL}/chat/conversaciones/${sender}`;
        console.log("🔍 GET:", url);
        const res = await axios.get(url);
        setNota(res.data?.notaInterna || "");
      } catch (err) {
        console.error("❌ Error cargando nota interna:", err);
      } finally {
        setCargandoInicial(false);
      }
    };

    fetchNota();
  }, [sender]);

  const guardarNota = async () => {
    try {
      console.log("📝 Guardando nota...");
      setCargando(true);
      const endpoint = `${API_URL}/chat/conversaciones/${sender}/notaInterna`;
      const res = await axios.patch(endpoint, { notaInterna: nota });
      console.log("✅ Nota guardada:", res.data);
      setEditando(false);
    } catch (err) {
      console.error("❌ Error guardando nota interna:", err);
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    const valor = e.target.value;
    if (valor.length <= 350) {
      setNota(valor);
    }
  };

  if (cargandoInicial) {
    return (
      <div className="p-4 bg-gray-100 rounded shadow text-sm text-gray-500">
        Cargando nota interna...
      </div>
    );
  }

  return (
    <div className="p-4 bg-white border border-gray-200 shadow rounded space-y-3">
      <div>
        {editando ? (
          <>
            <textarea
              className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              rows={4}
              value={nota}
              onChange={handleChange}
              disabled={cargando}
              placeholder="Máximo 350 caracteres"
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {nota.length}/350 caracteres
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {nota ? nota : "Sin nota interna"}
          </p>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {editando ? (
            <>
              <button
                onClick={guardarNota}
                disabled={cargando}
                className="px-3 py-1 bg-green-100 text-green-800 border border-green-300 rounded hover:bg-green-200 text-sm"
              >
                Guardar
              </button>
              <button
                onClick={() => setEditando(false)}
                className="px-3 py-1 bg-gray-100 text-gray-700 border border-gray-300 rounded hover:bg-gray-200 text-sm"
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditando(true)}
              className="px-3 py-1 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded hover:bg-yellow-200 text-sm"
            >
              Editar nota
            </button>
          )}
        </div>

        <button
          onClick={onClose}
          className="px-3 py-1 bg-red-100 text-red-800 border border-red-300 rounded hover:bg-red-200 text-sm"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
