import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import ProductosEntrenados from "./pages/productos/ProductosEntrenados";
import Productos from "./pages/productos/Productos";
import ProductosSinEntrenamiento from "./pages/productos/ProductosSinEntrenamiento";
import Login from "./pages/Login";
import SeccionesPorCategoria from "./pages/secciones/Secciones";
import SeccionesSinEntrenamiento from "./pages/secciones/SeccionesSinEntrenamiento";
import SeccionesEntrenadas from "./pages/secciones/SeccionesEntrenadas";
import ChatPage from "./pages/chat/ChatPage";
import ProductoNuevo from "./pages/productos/ProductoNuevo";
import Reservas from "./pages/reservas/Reservas";

import "./index.css";
import "flowbite/dist/flowbite.css";

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("token"));
  }, []);

  // 👇 Condición: no mostrar navbar en /chat
  const hideNavbarRoutes = ["/chat"];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {isAuthenticated && !hideNavbar && <Navbar />}

      <Routes>
        {/* Login */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
          }
        />

        {/* Productos */}
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
            isAuthenticated ? (
              <ProductoNuevo />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/producto/editar/:id"
          element={
            isAuthenticated ? (
              <ProductoNuevo />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/productos/:categoria/*"
          element={
            isAuthenticated ? <Productos /> : <Navigate to="/login" replace />
          }
        />

        {/* Secciones */}
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

        {/* ✅ Chat */}
        <Route
          path="/chat"
          element={
            isAuthenticated ? <ChatPage /> : <Navigate to="/login" replace />
          }
        />

        {/* ✅ Reservas */}
        <Route
          path="/reservas"
          element={
            isAuthenticated ? <Reservas /> : <Navigate to="/login" replace />
          }
        />

        {/* Fallback */}
        <Route
          path="*"
          element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
