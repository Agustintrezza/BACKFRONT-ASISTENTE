import { useState, useEffect } from "react";
import { Navbar as FlowbiteNavbar, Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FiPower, FiMoon, FiSun } from "react-icons/fi";
import { useUser } from "../context/UserContext"; // 👈 Importar el hook
import clientConfig from "../../client-config.json";

function Navbar() {
  const navigate = useNavigate();
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const { user, setUser } = useUser(); // 👈 Usar user desde contexto

  // 🌙 Dark Mode
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "⚠️ ¿Cerrar sesión?",
      text: "👋 Vas a salir del panel de administración del chatbot.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "✅ Sí, cerrar sesión",
      cancelButtonText: "❌ Cancelar",
      background: darkMode ? "#1f2937" : "#f9fafb",
      color: darkMode ? "#f3f4f6" : "#111827",
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
      setUser(null); // 🔒 Limpiar el contexto también
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
        className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow"
      >
        <FlowbiteNavbar.Brand href="/">
          <img
            src={clientConfig.brand.logoUrl}
            className="mr-2 h-7"
            alt={clientConfig.brand.name}
          />
          <span className="text-xl font-semibold text-violet-600 dark:text-violet-400 whitespace-nowrap">
            {clientConfig.brand.name}
          </span>
        </FlowbiteNavbar.Brand>

        <FlowbiteNavbar.Toggle />

        <FlowbiteNavbar.Collapse>
          <li className="mt-2 lg:mt-0 text-sm flex items-center gap-3 relative">
            {/* 👤 Email del usuario */}
            <span className="text-sm text-gray-600 dark:text-gray-300 font-semibold">
              👤 {user?.email || "Usuario"}
            </span>

            {/* Menú desplegable */}
            <div className="relative">
              <button
                onClick={() => setShowAdminMenu((prev) => !prev)}
                className="text-sm text-violet-600 dark:text-violet-400 font-semibold hover:underline"
              >
                Administrar
              </button>

              {showAdminMenu && (
                <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded shadow-lg p-2 z-50 w-52">
                  <button
                    onClick={() => {
                      setShowAdminMenu(false);
                      navigate("/usuarios");
                    }}
                    className="block w-full text-sm py-2 px-3 text-left hover:bg-violet-100 dark:hover:bg-violet-700 dark:text-gray-200"
                  >
                    📋 Usuarios
                  </button>
                </div>
              )}
            </div>

            {/* 🌙 Botón Dark Mode */}
            <Button
              color="gray"
              size="sm"
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center justify-center"
            >
              {darkMode ? (
                <FiSun className="text-yellow-400 text-lg" />
              ) : (
                <FiMoon className="text-gray-800 text-lg" />
              )}
            </Button>

            {/* 🔴 Botón logout */}
            <Button
              onClick={handleLogout}
              color="failure"
              size="sm"
              className="ml-2 bg-red-500 logout-button flex items-center justify-center"
            >
              <FiPower className="text-white text-lg" />
            </Button>
          </li>
        </FlowbiteNavbar.Collapse>
      </FlowbiteNavbar>
    </motion.div>
  );
}

export default Navbar;
