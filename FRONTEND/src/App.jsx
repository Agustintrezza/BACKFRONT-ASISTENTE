import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";

// 🧠 Contexto global
import { UserProvider } from "./context/UserContext";

// 🖥️ Páginas
import Dashboard from "./pages/dashboard/Dashboard";
import ProductosEntrenados from "./pages/productos/ProductosEntrenados";
import Productos from "./pages/productos/Productos";
import ProductosSinEntrenamiento from "./pages/productos/ProductosSinEntrenamiento";
import ProductoNuevo from "./pages/productos/ProductoNuevo";

import SeccionesPorCategoria from "./pages/secciones/Secciones";
import SeccionesSinEntrenamiento from "./pages/secciones/SeccionesSinEntrenamiento";
import SeccionesEntrenadas from "./pages/secciones/SeccionesEntrenadas";

import ChatPage from "./pages/chat/ChatPage";
import Reservas from "./pages/reservas/Reservas";
import Login from "./pages/Login";
import UsuariosDashboard from "./UsuariosDashboard";

// 🆕 Layouts
import SidebarButtons from "./components/layout/SidebarButtons";
import SidebarMain from "./components/layout/SidebarMain";

// 🧪 Estilos
import "./index.css";
import "flowbite/dist/flowbite.css";

// 🆕 Layout estilo Discord
function AppLayout() {
  const [isMainOpen, setIsMainOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      {/* Sidebar angosto */}
      <SidebarButtons
        isMainOpen={isMainOpen}
        onToggleMainSidebar={() => setIsMainOpen((prev) => !prev)}
      />

      {/* Sidebar principal con transición */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isMainOpen ? "max-w-[240px] opacity-100" : "max-w-0 opacity-0"
        }`}
      >
        <SidebarMain />
      </div>

      {/* Contenido principal */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("token"));
  }, [location]);

  if (isAuthenticated === null) {
    return <div className="text-center text-gray-500 p-6">Cargando...</div>;
  }

  return (
    <Routes>
      {/* Login fuera del layout */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        }
      />

      {/* Layout principal con sidebars */}
      <Route
        element={isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />}
      >
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Productos */}
        <Route path="/productos-entrenados" element={<ProductosEntrenados />} />
        <Route
          path="/productos-sin-entrenamiento"
          element={<ProductosSinEntrenamiento />}
        />
        <Route path="/producto/nuevo" element={<ProductoNuevo />} />
        <Route path="/producto/editar/:id" element={<ProductoNuevo />} />
        <Route path="/productos/:categoria/*" element={<Productos />} />

        {/* Secciones */}
        <Route path="/secciones-entrenadas" element={<SeccionesEntrenadas />} />
        <Route
          path="/secciones-sin-entrenamiento"
          element={<SeccionesSinEntrenamiento />}
        />
        <Route path="/secciones/:categoria/*" element={<SeccionesPorCategoria />} />

        {/* Reservas */}
        <Route path="/reservas" element={<Reservas />} />

        {/* Chat y estado asistente */}
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/asistente-estado" element={<UsuariosDashboard />} />

        {/* Fallback */}
        <Route
          path="*"
          element={
            <Navigate
              to={isAuthenticated ? "/dashboard" : "/login"}
              replace
            />
          }
        />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <UserProvider>
      <Router>
        <AppContent />
      </Router>
    </UserProvider>
  );
}

export default App;
