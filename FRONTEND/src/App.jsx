// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import ProductosEntrenados from "./pages/ProductosEntrenados";
import Productos from "./pages/Productos";
import ProductosSinEntrenamiento from "./pages/ProductosSinEntrenamiento";
import Login from "./pages/Login";
import SeccionesPorCategoria from "./pages/Secciones"; // Listado por categoría
import SeccionesSinEntrenamiento from './pages/SeccionesSinEntrenamiento';
import SeccionesEntrenadas from "./pages/SeccionesEntrenadas";

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

        {/* Dashboard principal */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated
              ? <Dashboard />
              : <Navigate to="/login" replace />
          }
        />

        {/* Gestión Productos */}
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
          path="/productos/:categoria/*"
          element={
            isAuthenticated
              ? <Productos />
              : <Navigate to="/login" replace />
          }
        />

        {/* Gestión Secciones */}
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
