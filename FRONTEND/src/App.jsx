// ==============================
// src/App.jsx
// ==============================

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

// 🧠 Contexto global
import { UserProvider } from "./context/UserContext";
import { useUserPlan } from "./hooks/useUserPlan";

// 🖥️ Páginas principales
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./pages/Login";
import UsuariosDashboard from "./UsuariosDashboard";

// ==== PRODUCTOS ====
import ProductosEntrenados from "./pages/productos/productos-entrenados/ProductosEntrenados";
import ProductosEntrenadosDetalle from "./pages/productos/productos-entrenados-detalle/ProductosEntrenadosDetalle";
import ProductosSinEntrenamiento from "./pages/productos/productos-sin-entrenamiento/ProductosSinEntrenamiento";
import ProductosSinEntrenamientoDetalle from "./pages/productos/productos-sin-entrenamiento/ProductoSinEntrenamientoDetalle";
import ProductoModal from "./components/productos/ProductoModal";

// ==== SECCIONES ====
import SeccionesEntrenadas from "./pages/secciones/secciones-entrenadas/SeccionesEntrenadas";
import SeccionesEntrenadasDetalle from "./pages/secciones/secciones-entrenadas-detalle/SeccionEntrenadasDetalle.jsx";
import SeccionesSinEntrenamiento from "./pages/secciones/secciones-sin-entrenamiento/SeccionesSinEntrenamiento";
import SeccionesSinEntrenamientoDetalle from "./pages/secciones/secciones-sin-entrenamiento/SeccionesSinEntrenamientoDetalle";
import SeccionSinEntrenamientoItem from "./pages/secciones/secciones-sin-entrenamiento/SeccionSinEntrenamientoItem";
import SeccionesPorCategoria from "./pages/secciones/Secciones";

// ==== RESERVAS (nueva versión con cards) ====
import Reservas from "./pages/reservas/Reservas";
import ReservaCard from "./pages/reservas/ReservasCard.jsx";

// ==== CHAT ====
import ChatPage from "./pages/chat/ChatPage";

// 🧱 Layouts
import SidebarButtons from "./components/layout/SidebarButtons";
import SidebarMain from "./components/layout/SidebarMain";

// 🎨 Estilos
import "./index.css";
import "flowbite/dist/flowbite.css";

// ==============================
// Layout principal (estilo Discord)
// ==============================
function AppLayout() {
  const [isMainOpen, setIsMainOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Sidebar angosto */}
      <SidebarButtons
        isMainOpen={isMainOpen}
        onToggleMainSidebar={() => setIsMainOpen((prev) => !prev)}
      />

      {/* Sidebar principal */}
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

// ==============================
// AppContent (manejo de rutas)
// ==============================
function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();
  const planData = useUserPlan();

  const [allProducts, setAllProducts] = useState([]);
  const [allSections, setAllSections] = useState([]);

  // === Cargar productos ===
  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data } = await axios.get("http://localhost:5000/api/productos");
        setAllProducts(data);
      } catch (err) {
        console.error("❌ Error al cargar productos:", err);
      }
    }
    fetchProducts();
  }, []);

  // === Cargar secciones ===
  useEffect(() => {
    async function fetchSections() {
      try {
        const { data } = await axios.get("http://localhost:5000/api/secciones");
        setAllSections(data);
      } catch (err) {
        console.error("❌ Error al cargar secciones:", err);
      }
    }
    fetchSections();
  }, []);

  // === Autenticación ===
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

      {/* Layout principal */}
      <Route
        element={
          isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />
        }
      >
        {/* DASHBOARD */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* ==== PRODUCTOS ==== */}
        <Route
          path="/productos-entrenados"
          element={
            <ProductosEntrenados
              allProducts={allProducts}
              planData={planData}
            />
          }
        />
        <Route
          path="/productos-sin-entrenamiento"
          element={
            <ProductosSinEntrenamiento
              allProducts={allProducts}
              planData={planData}
            />
          }
        />
        <Route
          path="/productos-sin-entrenamiento/:categoriaKey"
          element={
            <ProductosSinEntrenamientoDetalle
              allProducts={allProducts}
              planData={planData}
            />
          }
        />
        <Route
          path="/producto/editar/:id"
          element={<ProductoModal mode="producto" isEditing={true} />}
        />
        <Route
          path="/productos/:categoria/*"
          element={
            <ProductosEntrenadosDetalle
              allProducts={allProducts}
              planData={planData}
            />
          }
        />

        {/* ==== SECCIONES ==== */}
        <Route path="/secciones-entrenadas" element={<SeccionesEntrenadas />} />
        <Route
          path="/secciones-sin-entrenamiento"
          element={
            <SeccionesSinEntrenamiento
              allSections={allSections}
              planData={planData}
            />
          }
        />
        <Route
          path="/secciones-sin-entrenamiento/:categoriaKey"
          element={
            <SeccionesSinEntrenamientoDetalle
              allSections={allSections}
              planData={planData}
            />
          }
        />
        <Route
          path="/secciones/:categoria/*"
          element={
            <SeccionesEntrenadasDetalle
              allSections={allSections}
              planData={planData}
            />
          }
        />

        {/* ==== RESERVAS ==== */}
        <Route path="/reservas" element={<Reservas />} />

        {/* ==== CHAT ==== */}
        <Route path="/chat" element={<ChatPage />} />

        {/* ==== ESTADO DEL ASISTENTE ==== */}
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

// ==============================
// App principal
// ==============================
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
