import { Link, useLocation } from "react-router-dom";

function SidebarMain() {
  const location = useLocation();

  const navItem = (to, label, icon) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center gap-1 rounded-md p-2 transition-all ${
          active
            ? "bg-gradient-to-r from-violet-600 to-violet-800 text-white shadow-md"
            : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
        }`}
      >
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full text-lg font-semibold transition-all
            ${
              active
                ? "bg-violet-500 text-white"
                : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 group-hover:bg-violet-400"
            }`}
        >
          {icon}
        </div>
        <span className="text-sm font-medium">{label}</span>
      </Link>
    );
  };

  return (
    <aside className="w-60 h-screen bg-white dark:bg-gray-900 border-r border-gray-300 dark:border-gray-800 p-3 flex flex-col overflow-y-auto">
      <nav className="flex flex-col gap-1.5">
        <h2 className="text-xs uppercase text-gray-500 dark:text-gray-400 mt-1 mb-1">
          Administración
        </h2>
        {navItem("/dashboard", "Admin", "🛠️")}

        <h2 className="text-xs uppercase text-gray-500 dark:text-gray-400 mt-2 mb-1">
          Productos
        </h2>
        {navItem("/productos-entrenados", "Productos entrenados", "📦")}
        {navItem("/productos-sin-entrenamiento", "Sin entrenamiento", "⏳")}

        <h2 className="text-xs uppercase text-gray-500 dark:text-gray-400 mt-2 mb-1">
          Secciones
        </h2>
        {navItem("/secciones-entrenadas", "Entrenadas", "📑")}
        {navItem("/secciones-sin-entrenamiento", "Sin entrenamiento", "📄")}

        <h2 className="text-xs uppercase text-gray-500 dark:text-gray-400 mt-2 mb-1">
          Reservas
        </h2>
        {navItem("/reservas", "Reservas", "📅")}

        <h2 className="text-xs uppercase text-gray-500 dark:text-gray-400 mt-2 mb-1">
          Asistente
        </h2>
        {navItem("/chat", "Chat", "💬")}
        {navItem("/asistente-estado", "Estado", "🤖")}
      </nav>
    </aside>
  );
}

export default SidebarMain;
