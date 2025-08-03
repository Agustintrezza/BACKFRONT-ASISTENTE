import { useState, useEffect } from "react";
import axios from "axios";
import { HiPencil } from "react-icons/hi";

// URL base
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function NotaInternaEditor({ sender, onClose }) {
  const [editando, setEditando] = useState(false);
  const [nuevaNota, setNuevaNota] = useState("");
  const [notas, setNotas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [cargandoInicial, setCargandoInicial] = useState(true);

  useEffect(() => {
    const fetchNotas = async () => {
      try {
        const url = `${API_URL}/chat/conversaciones/${sender}`;
        const res = await axios.get(url);
        setNotas(res.data?.notasInternas || []);
      } catch (err) {
        console.error("❌ Error cargando notas internas:", err);
      } finally {
        setCargandoInicial(false);
      }
    };

    fetchNotas();
  }, [sender]);

  const guardarNota = async () => {
    if (!nuevaNota.trim()) return;
    try {
      setCargando(true);
      const endpoint = `${API_URL}/chat/conversaciones/${sender}/notaInterna`;

      const token = localStorage.getItem("token");
      const res = await axios.patch(
        endpoint,
        { notaInterna: nuevaNota },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotas(res.data.conversacion.notasInternas || []);
      setNuevaNota("");
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
      setNuevaNota(valor);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString("es-AR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  if (cargandoInicial) {
    return (
      <div className="p-4 bg-gray-100 rounded shadow text-sm text-gray-500">
        Cargando notas internas...
      </div>
    );
  }

  return (
    <div className="p-4 bg-white border border-gray-200 shadow rounded space-y-4 max-h-[60vh] overflow-y-auto">
      <h3 className="text-sm font-semibold text-gray-700">Historial de notas</h3>

      {notas.length === 0 && (
        <p className="text-sm text-gray-500">Sin notas internas aún.</p>
      )}

      <ul className="space-y-3">
        {notas.map((nota, i) => (
          <li key={i} className="border p-2 rounded text-sm bg-gray-50">
            <p className="whitespace-pre-wrap text-gray-800">{nota.texto}</p>
            <div className="text-xs text-gray-500 mt-1 flex justify-between">
              <span>{nota.autor}</span>
              <span>{formatearFecha(nota.fecha)}</span>
            </div>
          </li>
        ))}
      </ul>

      {editando ? (
        <div className="space-y-2">
          <textarea
            className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            rows={3}
            value={nuevaNota}
            onChange={handleChange}
            disabled={cargando}
            placeholder="Máximo 350 caracteres"
          />
          <div className="text-right text-xs text-gray-500">
            {nuevaNota.length}/350 caracteres
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={guardarNota}
              disabled={cargando}
              className="px-3 py-1 bg-green-100 text-green-800 border border-green-300 rounded hover:bg-green-200 text-sm"
            >
              Guardar
            </button>
            <button
              onClick={() => {
                setEditando(false);
                setNuevaNota("");
              }}
              className="px-3 py-1 bg-gray-100 text-gray-700 border border-gray-300 rounded hover:bg-gray-200 text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button
  onClick={() => setEditando(true)}
  className="flex items-center gap-1 px-3 py-1 text-black border border-yellow-300 rounded-2xl  text-sm 
             bg-yellow-200 hover:to-yellow-400"
>
  <HiPencil /> Agregar nota
</button>
      )}

      <div className="text-right">
      <button
  onClick={onClose}
  className="mt-4 px-3 py-1 text-white border border-red-300 rounded-2xl text-sm 
             bg-red-500 hover:from-red-200 hover:to-red-400"
>
  Cerrar
</button>
      </div>
    </div>
  );
}
