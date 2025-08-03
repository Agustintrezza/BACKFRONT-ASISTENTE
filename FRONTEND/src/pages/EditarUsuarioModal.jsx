import { useState } from "react";
import axios from "axios";
import { Modal, Label, TextInput, Button, Checkbox } from "flowbite-react";
import Swal from "sweetalert2";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { HiX } from "react-icons/hi";
import { useUser } from "../context/UserContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function EditarUsuarioModal({ usuario, usuarioLogueado, onClose, onSuccess }) {
  const esSuPropioPerfil = usuarioLogueado && usuario._id === usuarioLogueado._id;
  const esAdminLogueado = usuarioLogueado?.role === "admin";

  const [email, setEmail] = useState(usuario.email || "");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAdmin, setIsAdmin] = useState(usuario.role === "admin");

  const { setUser } = useUser();

  const handleGuardar = async (e) => {
    e.preventDefault();

    const payload = {};

    if (esSuPropioPerfil) {
      if (!email.trim()) {
        return Swal.fire({
          icon: "warning",
          title: "Email requerido",
          confirmButtonColor: "#facc15",
        });
      }

      if (password && password !== repeatPassword) {
        return Swal.fire({
          icon: "warning",
          title: "Las contraseñas no coinciden",
          confirmButtonColor: "#facc15",
        });
      }

      if (email !== usuario.email) payload.email = email;
      if (password) payload.password = password;
    }

    if (esAdminLogueado) {
      payload.role = isAdmin ? "admin" : "user";
    }

    try {
      const response = await axios.put(`${API_URL}/usuarios/${usuario._id}`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      Swal.fire({
        icon: "success",
        title: "Cambios guardados",
        confirmButtonColor: "#3b82f6",
      });

      // ✅ Si es su propio perfil, actualizamos el contexto
      if (esSuPropioPerfil && response.data?.user?.email) {
        setUser((prev) => ({
          ...prev,
          email: response.data.user.email,
        }));
      }

      onSuccess();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.error || "Error al actualizar el usuario.";
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
          onSubmit={handleGuardar}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-10 text-gray-900"
        >
          <h2 className="text-4xl font-extrabold flex justify-center items-center gap-3">
            <span className="text-5xl">✏️</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-violet-700 to-violet-700">
              Editar usuario
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label
                value="Correo electrónico"
                className="text-violet-800 font-semibold mb-1"
              />
              <TextInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!esSuPropioPerfil}
              />
            </div>

            <div className="md:col-span-2">
              <Label
                value="Nueva contraseña"
                className="text-violet-800 font-semibold mb-1"
              />
              <div className="relative">
                <TextInput
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={!esSuPropioPerfil}
                  placeholder="••••••••"
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

            <div className="md:col-span-2">
              <Label
                value="Repetir contraseña"
                className="text-violet-800 font-semibold mb-1"
              />
              <TextInput
                type={showPassword ? "text" : "password"}
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                disabled={!esSuPropioPerfil}
                placeholder="••••••••"
              />
            </div>

            {esAdminLogueado && (
              <div className="md:col-span-2 flex items-center gap-3 mt-2">
                <Checkbox
                  id="admin-check"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                />
                <Label htmlFor="admin-check" className="text-violet-800 font-medium">
                  ¿Es administrador?
                </Label>
              </div>
            )}
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
              Guardar cambios
            </Button>
          </div>
        </motion.form>
      </div>
    </motion.div>
  );
}

export default EditarUsuarioModal;
