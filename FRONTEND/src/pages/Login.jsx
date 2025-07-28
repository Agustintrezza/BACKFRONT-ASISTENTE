import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaWhatsapp,
  FaInstagram,
  FaGlobe,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const slides = [
    {
      emojis: "🤖 💯 🙌 📱 💻",
      title: "Solicitá tu Asistente Virtual IA!",
      description:
        "Transformá la atención al cliente de tu empresa con un asistente entrenado con la información de tu negocio. Disponible 24/7, en todos tus canales digitales.",
      contact: ["📞 +54 11 4444 5555", "📧 contacto@tuempresa.com"],
      buttons: [
        {
          text: "🚀 Solicitá una demo",
          onClick: () => alert("🚀 Próximamente demo disponible"),
        },
        {
          text: "❓ Preguntas Frecuentes",
          onClick: () => alert("📚 Pronto disponible"),
        },
      ],
    },
    {
      emojis: "🛠️ 🔐 💼 📊",
      title: "Gestioná tu asistente",
      description:
        "Usá tu panel para tener el control total sobre la información, respuestas y rendimiento de tu asistente virtual IA.",
      contact: ["👤 Acceso exclusivo para administradores."],
      buttons: [
        {
          text: "🔧 Ver funcionalidades",
          onClick: () => alert("🔧 Módulo en construcción"),
        },
        {
          text: "📈 Estadísticas del bot",
          onClick: () => alert("📈 Muy pronto"),
        },
      ],
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          email,
          password,
        }
      );
      const token = response.data.token;
      localStorage.setItem("token", token);
      window.location.href = "/dashboard";
    } catch (error) {
      console.error(error);
      setErrorMessage("❌ No se pudo iniciar sesión. Verificá tus datos.");
      setTimeout(() => setErrorMessage(""), 3500);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen text-white transition-all duration-700 ease-in-out">
      {/* Columna izquierda: Marketing */}
      <div
        className={`relative ${
          isCollapsed
            ? "w-0 opacity-0 overflow-hidden"
            : "w-full lg:basis-[55%] bg-gradient-to-t from-violet-50 to-white flex flex-col justify-center items-start px-6 py-12 text-gray-800 transition-all duration-700 ease-in-out"
        }`}
      >
        {/* Botón colapsar */}
        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(true)}
            className="absolute top-4 left-4 z-50 p-2 bg-violet-600 rounded-full shadow-md hover:scale-105 transition duration-300"
            title="Cerrar panel"
          >
            <FaChevronLeft className="text-white text-xl" />
          </button>
        )}

        {!isCollapsed && (
          <div className="max-w-xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.7 }}
                className="space-y-6"
              >
                <div className="text-6xl md:text-8xl mb-2 text-start">
                  {slides[activeSlide].emojis}
                </div>
                <h1 className="text-6xl md:text-6xl font-extrabold leading-snug bg-gradient-to-r from-blue-600 to-violet-600 text-transparent bg-clip-text">
                  {slides[activeSlide].title}
                </h1>
                <p className="text-lg font-semibold text-gray-700">
                  {slides[activeSlide].description}
                </p>
                <ul className="text-md text-gray-600 space-y-1">
                  {slides[activeSlide].contact.map((line, idx) => (
                    <li key={idx}>{line}</li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-4">
                  {slides[activeSlide].buttons.map((btn, idx) => (
                    <button
                      key={idx}
                      className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition"
                      onClick={btn.onClick}
                    >
                      {btn.text}
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Columna derecha: Login */}
      <div
        className={`relative flex flex-col items-center justify-center transition-all duration-700 ease-in-out bg-[#0f172a] text-white ${
          isCollapsed ? "w-full h-screen px-6 py-8" : "w-full lg:basis-[45%] px-6 py-12"
        }`}
      >
        {/* Botón abrir */}
        {isCollapsed && (
          <button
            onClick={() => setIsCollapsed(false)}
            className="absolute top-4 left-4 z-50 p-2 bg-violet-600 rounded-full shadow-md hover:scale-105 transition duration-500"
            title="Abrir panel"
          >
            <FaChevronRight className="text-white text-xl" />
          </button>
        )}

        {/* Título cuando está colapsado */}
        {/* {isCollapsed && (
          <h1 className="text-2xl md:text-3xl font-bold mb-8 text-white text-center">
            ✨ Gestioná tu asistente
            <div className="text-sm font-medium text-violet-300">
              Usá tu panel para gestionar tu asistente
            </div>
          </h1>
        )} */}

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-[#1e293b] border border-violet-600 text-white p-8 rounded-2xl w-full max-w-sm shadow-xl"
        >
          <h2 className="text-3xl font-bold mb-6 text-center tracking-wide">
            🔐 Bienvenido al Panel Admin ✨
          </h2>

          <label className="block text-sm font-medium text-violet-300 mb-1 ml-1">
            📧 Correo electrónico
          </label>
          <input
            type="email"
            placeholder="ejemplo@correo.com"
            className="bg-[#334155] border border-gray-600 placeholder-gray-400 text-gray-700 text-sm rounded-full w-full p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-violet-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="block text-sm font-medium text-violet-300 mb-1 ml-1">
            🔑 Contraseña
          </label>
          <div className="relative mb-6">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="bg-[#334155] border border-gray-600 placeholder-gray-400 text-gray-700 text-sm rounded-full w-full p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-violet-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-lg"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? "Ocultar" : "Mostrar"}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90 text-white font-bold py-3 rounded-full shadow-md transition"
          >
            🚀 Iniciar sesión
          </button>

          {errorMessage && (
            <div className="bg-red-500/10 text-red-400 border border-red-500 mt-4 p-3 rounded text-sm text-center transition-opacity duration-300">
              {errorMessage}
            </div>
          )}

          <p className="text-center text-sm text-gray-400 mt-4">
            ⚠️ Acceso solo para administradores del chatbot.
          </p>
        </motion.form>
      </div>
    </div>
  );
}

export default Login;
