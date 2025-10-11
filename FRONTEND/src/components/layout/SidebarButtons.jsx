import { Link } from "react-router-dom";
import DarkModeToggle from "../ui/DarkModeToggle";
import { useUser } from "../../context/UserContext";
import Swal from "sweetalert2";

function SidebarButtons({ isMainOpen, onToggleMainSidebar }) {
  const { user, logout } = useUser();

  const handleLogout = async () => {
    const confirm = await Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Vas a salir del panel y cerrar tu sesión actual.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
    });

    if (confirm.isConfirmed) {
      logout();
    }
  };

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : "U";
  const userEmail = user?.email || "usuario@ejemplo.com";

  return (
    <aside className="w-16 flex flex-col items-center justify-between bg-gray-200 dark:bg-gray-900 py-4">
      <div className="flex flex-col gap-4 items-center">
        {/* 👤 Avatar Usuario con Tooltip */}
        <div
          className="relative group cursor-pointer"
          title={userEmail}
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center text-white font-bold text-xl shadow-md">
            {userInitial}
          </div>
          <div className="absolute flex items-center left-14 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs h-10 px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-300">
            {userEmail}
          </div>
        </div>

        {/* Dashboard */}
        <Link
          to="/dashboard"
          className="w-12 h-12 rounded-lg bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-2xl hover:bg-gray-400 dark:hover:bg-gray-600"
          title="Dashboard"
        >
          🤖
        </Link>

        {/* Toggle Dark Mode */}
        <DarkModeToggle />

        {/* Botón abrir/cerrar SidebarMain */}
        <button
          onClick={onToggleMainSidebar}
          className="w-12 h-12 rounded-lg bg-gray-300 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-400 dark:hover:bg-gray-600 text-2xl transition-all"
          title={isMainOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {isMainOpen ? "⬅️" : "➡️"}
        </button>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        title="Cerrar sesión"
        className="w-12 h-12 rounded-lg bg-red-500 hover:bg-red-600 flex items-center justify-center text-2xl transition-all"
      >
        ⏻
      </button>
    </aside>
  );
}

export default SidebarButtons;
