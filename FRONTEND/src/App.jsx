import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import ProductosEntrenados from "./pages/ProductosEntrenados";
import Productos from "./pages/Productos";
import ProductosSinEntrenamiento from "./pages/ProductosSinEntrenamiento";
import Login from "./pages/Login";
import SeccionesPorCategoria from "./pages/Secciones";
import SeccionesSinEntrenamiento from "./pages/SeccionesSinEntrenamiento";
import SeccionesEntrenadas from "./pages/SeccionesEntrenadas";
import ChatPage from "./pages/ChatPage";
import ProductoNuevo from "./pages/ProductoNuevo";

import "./index.css";
import "flowbite/dist/flowbite.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("token"));
  }, []);

  return (
    <Router>
      {isAuthenticated && <Navbar />}

      <Routes>
        {/* Login */}
        <Route
          path="/login"
          element={
            isAuthenticated
              ? <Navigate to="/dashboard" replace />
              : <Login />
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated
              ? <Dashboard />
              : <Navigate to="/login" replace />
          }
        />

        {/* Productos */}
        <Route
          path="/productos-entrenados"
          element={
            isAuthenticated
              ? <ProductosEntrenados />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/productos-sin-entrenamiento"
          element={
            isAuthenticated
              ? <ProductosSinEntrenamiento />
              : <Navigate to="/login" replace />
          }
        />
        <Route
  path="/producto/nuevo"
  element={
    isAuthenticated
      ? <ProductoNuevo />
      : <Navigate to="/login" replace />
  }
/>
<Route
  path="/producto/editar/:id"
  element={
    isAuthenticated
      ? <ProductoNuevo />
      : <Navigate to="/login" replace />
  }
/>
        <Route
          path="/productos/:categoria/*"
          element={
            isAuthenticated
              ? <Productos />
              : <Navigate to="/login" replace />
          }
        />

        {/* Secciones */}
        <Route
          path="/secciones-entrenadas"
          element={
            isAuthenticated
              ? <SeccionesEntrenadas />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/secciones-sin-entrenamiento"
          element={
            isAuthenticated
              ? <SeccionesSinEntrenamiento />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/secciones/:categoria/*"
          element={
            isAuthenticated
              ? <SeccionesPorCategoria />
              : <Navigate to="/login" replace />
          }
        />

        {/* ✅ Chat con el asistente */}
        <Route
          path="/chat"
          element={
            isAuthenticated
              ? <ChatPage />
              : <Navigate to="/login" replace />
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
    </Router>
  );
}

export default App;
