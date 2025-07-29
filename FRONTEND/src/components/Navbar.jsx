import { Navbar as FlowbiteNavbar, Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FiPower } from "react-icons/fi";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "⚠️ ¿Cerrar sesión?",
      text: "👋 Vas a salir del panel de administración del chatbot.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "✅ Sí, cerrar sesión",
      cancelButtonText: "❌ Cancelar",
      background: "#171717",
      color: "#f3f4f6",
      iconColor: "#facc15",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      customClass: {
        popup: "rounded-lg border-2 border-red-500 shadow-lg",
        title: "text-lg font-semibold",
        confirmButton:
          "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700",
        cancelButton:
          "bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-800",
      },
    });

    if (result.isConfirmed) {
      localStorage.removeItem("token");
      navigate("/login");
      window.location.reload();
    }
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <FlowbiteNavbar
        fluid
        className="bg-white border-gray-200 sticky top-0 z-50 shadow"
      >
        <FlowbiteNavbar.Brand href="/">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            className="mr-2 h-7"
            alt="Chatbot Logo"
          />
          <span className="text-xl font-semibold text-violet-600 whitespace-nowrap">
            Asistente IA
          </span>
        </FlowbiteNavbar.Brand>

        <FlowbiteNavbar.Toggle />

        <FlowbiteNavbar.Collapse>
          <ul className="flex flex-col lg:flex-row items-center lg:space-x-6 mt-3 lg:mt-0 text-sm font-medium text-gray-800">
            <motion.li
              whileHover={{ scale: 1.05 }}
              className="transition-shadow shadow-sm hover:shadow-md rounded-md"
            >
              <button
                onClick={() => navigate("/productos")}
                className="block py-1 px-2 hover:text-violet-700 whitespace-nowrap"
              >
                📦 Productos
              </button>
            </motion.li>
            <motion.li
              whileHover={{ scale: 1.05 }}
              className="transition-shadow shadow-sm hover:shadow-md rounded-md"
            >
              <button
                onClick={() => navigate("/categorias-secciones")}
                className="block py-1 px-2 hover:text-violet-700 whitespace-nowrap"
              >
                🧩 Secciones
              </button>
            </motion.li>
            <motion.li
              whileHover={{ scale: 1.05 }}
              className="transition-shadow shadow-sm hover:shadow-md rounded-md"
            >
              <button
                onClick={() => navigate("/reservas")}
                className="block py-1 px-2 hover:text-violet-700 whitespace-nowrap"
              >
                📅 Reservas
              </button>
            </motion.li>
            <motion.li
              whileHover={{ scale: 1.05 }}
              className="transition-shadow shadow-sm hover:shadow-md rounded-md"
            >
              <button
                onClick={() => navigate("/chat")}
                className="block py-1 px-2 hover:text-violet-700 whitespace-nowrap"
              >
                💬 Chat
              </button>
            </motion.li>
            <motion.li className="mt-2 lg:mt-0">
              <Button
                onClick={handleLogout}
                color="failure"
                size="sm"
                className="ml-4 bg-red-500 logout-button flex items-center justify-center"
              >
                <FiPower className="text-white text-lg" />
              </Button>
            </motion.li>
          </ul>
        </FlowbiteNavbar.Collapse>
      </FlowbiteNavbar>
    </motion.div>
  );
}

export default Navbar;
