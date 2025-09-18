import { Link } from "react-router-dom";
import DarkModeToggle from "../ui/DarkModeToggle";

function SidebarButtons({ isMainOpen, onToggleMainSidebar }) {
  return (
    <aside className="w-16 flex flex-col items-center justify-between bg-gray-200 dark:bg-gray-900 py-4">
      <div className="flex flex-col gap-4 items-center">
        {/* Avatar usuario -> Dashboard */}
        <Link
          to="/dashboard"
          className="w-12 h-12 rounded-lg bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-2xl hover:bg-gray-400 dark:hover:bg-gray-600"
          title="Dashboard"
        >
          🤖
        </Link>

        {/* Botón administrar clientes */}
        <button
          title="Administrar clientes"
          className="w-12 h-12 rounded-lg bg-gray-300 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-400 dark:hover:bg-gray-600 text-2xl"
        >
          👥
        </button>

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
        title="Cerrar sesión"
        className="w-12 h-12 rounded-lg bg-red-500 hover:bg-red-600 flex items-center justify-center text-2xl"
      >
        ⏻
      </button>
    </aside>
  );
}

export default SidebarButtons;
