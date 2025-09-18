import { Link, useLocation } from "react-router-dom";

function SidebarMain() {
  const location = useLocation();

  const navItem = (to, label, icon) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        className={`rounded-md p-2 flex items-center gap-2 transition-colors ${
          active
            ? "bg-gradient-to-r from-violet-600 to-violet-800 text-white shadow-md"
            : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
        }`}
      >
        <span className="text-lg">{icon}</span> {label}
      </Link>
    );
  };

  return (
    <aside className="w-60 h-screen bg-white dark:bg-gray-900 border-r border-gray-300 dark:border-gray-800 p-4 flex flex-col gap-2 overflow-y-auto transition-colors">
      <h2 className="text-xs uppercase text-gray-500 dark:text-gray-400">
        Administración
      </h2>
      {navItem("/dashboard", "Admin", "🛠️")}

      <h2 className="text-xs uppercase text-gray-500 dark:text-gray-400 mt-4">
        Productos
      </h2>
      {navItem("/productos-entrenados", "Productos entrenados", "📦")}
      {navItem("/productos-sin-entrenamiento", "Sin entrenamiento", "⏳")}

      <h2 className="text-xs uppercase text-gray-500 dark:text-gray-400 mt-4">
        Secciones
      </h2>
      {navItem("/secciones-entrenadas", "Entrenadas", "📑")}
      {navItem("/secciones-sin-entrenamiento", "Sin entrenamiento", "📄")}

      <h2 className="text-xs uppercase text-gray-500 dark:text-gray-400 mt-4">
        Reservas
      </h2>
      {navItem("/reservas", "Reservas", "📅")}

      <h2 className="text-xs uppercase text-gray-500 dark:text-gray-400 mt-4">
        Asistente
      </h2>
      {navItem("/chat", "Chat", "💬")}
      {navItem("/asistente-estado", "Estado", "🤖")}
    </aside>
  );
}

export default SidebarMain;
