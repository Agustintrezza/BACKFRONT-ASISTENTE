import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";

// 🧩 Componentes
import Navbar from "./components/Navbar";

// 🧠 Contexto global
import { UserProvider } from "./context/UserContext";

// 🖥️ Páginas
import Dashboard from "./pages/Dashboard";
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

// 🧪 Estilos
import "./index.css";
import "flowbite/dist/flowbite.css";

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("token"));
  }, [location]);

  const hideNavbarRoutes = ["/chat"];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-300">
      {isAuthenticated && !hideNavbar && <Navbar />}

      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
          }
        />

        <Route
          path="/dashboard"
          element={
            isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/productos-entrenados"
          element={
            isAuthenticated ? (
              <ProductosEntrenados />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/productos-sin-entrenamiento"
          element={
            isAuthenticated ? (
              <ProductosSinEntrenamiento />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/producto/nuevo"
          element={
            isAuthenticated ? <ProductoNuevo /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/producto/editar/:id"
          element={
            isAuthenticated ? <ProductoNuevo /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/productos/:categoria/*"
          element={
            isAuthenticated ? <Productos /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/secciones-entrenadas"
          element={
            isAuthenticated ? (
              <SeccionesEntrenadas />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/secciones-sin-entrenamiento"
          element={
            isAuthenticated ? (
              <SeccionesSinEntrenamiento />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/secciones/:categoria/*"
          element={
            isAuthenticated ? (
              <SeccionesPorCategoria />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/chat"
          element={
            isAuthenticated ? <ChatPage /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/reservas"
          element={
            isAuthenticated ? <Reservas /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/usuarios"
          element={
            isAuthenticated ? (
              <UsuariosDashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="*"
          element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
          }
        />
      </Routes>
    </div>
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
