import { useState, useEffect } from "react";
import axios from "axios";
import { Label, Button, Checkbox } from "flowbite-react";
import { HiX } from "react-icons/hi";
import Swal from "sweetalert2";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

function CrearUsuarioModal({ onClose, onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [usuariosCount, setUsuariosCount] = useState(0);
  const [crearComoAdmin, setCrearComoAdmin] = useState(false);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/usuarios`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUsuariosCount(res.data.length || 0);
      } catch (err) {
        console.error("Error obteniendo usuarios:", err);
      }
    };
    fetchUsuarios();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Campos requeridos",
        text: "Debes completar el correo y la contraseña.",
        confirmButtonColor: "#facc15",
      });
    }

    if (usuariosCount >= 3) {
      return Swal.fire({
        icon: "error",
        title: "Límite alcanzado",
        text: "Solo se permiten hasta 3 usuarios en el sistema.",
        confirmButtonColor: "#ef4444",
      });
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/usuarios/crear`,
        {
          email,
          password,
          role: crearComoAdmin ? "admin" : "user",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "✅ Usuario creado",
        text: "El nuevo usuario fue creado correctamente.",
        confirmButtonColor: "#3b82f6",
      });

      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (error) {
      const msg =
        error.response?.data?.error || "Ocurrió un error al crear el usuario.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: msg,
        confirmButtonColor: "#ef4444",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -60 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 bg-gray-200 bg-opacity-90 flex justify-center items-center px-2"
    >
      <div className="relative w-full max-w-3xl rounded-3xl bg-gradient-to-br from-white via-violet-50 to-violet-100 shadow-xl p-10 overflow-y-auto max-h-[95vh]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-3xl text-red-500 hover:text-red-700 transition"
          title="Cerrar"
        >
          <HiX />
        </button>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-10 text-gray-900"
        >
          <h2 className="text-4xl font-extrabold flex justify-center items-center gap-3">
            <span className="text-5xl">👤</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-violet-700 to-violet-700">
              Crear nuevo usuario
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label
                value="Correo electrónico"
                className="text-violet-800 font-semibold mb-1"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="ejemplo@correo.com"
                className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm shadow-md focus:ring-2 focus:ring-violet-400 focus:outline-none bg-white"
              />
            </div>

            <div className="md:col-span-2">
              <Label
                value="Contraseña"
                className="text-violet-800 font-semibold mb-1"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm shadow-md focus:ring-2 focus:ring-violet-400 focus:outline-none bg-white pr-10"
                />
                <span
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl cursor-pointer select-none"
                  title={showPassword ? "Ocultar" : "Mostrar"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>
            </div>

            <div className="md:col-span-2 flex items-center gap-3 mt-2">
              <Checkbox
                id="crear-admin"
                checked={crearComoAdmin}
                onChange={() => setCrearComoAdmin((prev) => !prev)}
              />
              <Label htmlFor="crear-admin" className="text-violet-800 font-medium">
                Crear como administrador
              </Label>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <Button
              type="button"
              onClick={onClose}
              className="bg-gradient-to-r from-red-400 to-pink-500 text-white font-semibold px-6 py-2 rounded-full shadow-md hover:scale-105 transition"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold px-6 py-2 rounded-full shadow-md hover:scale-105 transition"
            >
              Crear usuario
            </Button>
          </div>
        </motion.form>
      </div>
    </motion.div>
  );
}

export default CrearUsuarioModal;
