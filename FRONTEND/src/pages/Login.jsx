import { useState } from "react";
import axios from "axios";
import { FaWhatsapp, FaInstagram, FaGlobe } from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        email,
        password,
      });
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
    <div className="flex flex-col lg:flex-row min-h-screen text-white">
      {/* Columna izquierda: Marketing (70%) */}
      <div className="w-full lg:basis-[55%] bg-gradient-to-br from-yellow-400 via-yellow-500 to-black flex flex-col justify-center items-start">
        <div className="max-w-xl mx-auto">
          <div className="text-7xl mb-6">🤖 💯 🙌 📱 💻</div>
          <h1 className="text-5xl font-extrabold leading-snug mb-4 text-black">
            Solicitá tu Asistente Virtual IA!
          </h1>
          <p className="text-lg font-bold mb-4 text-black/80">
            Transformá la atención al cliente de tu empresa con un asistente entrenado con
            la información de tu negocio. Disponible 24/7, en todos tus canales digitales.
          </p>

          {/* Integraciones */}
          <div className="bg-black/20 rounded-xl border border-black/30 p-4 pb-1 mb-4 text-start">
            <p className="text-black flex items-center gap-5 text-lg font-semibold mb-4">
              🔌 Integrado con tus canales favoritos: 
              <FaWhatsapp
                title="WhatsApp"
                className="transition hover:scale-110 text-4xl"
                style={{ color: "#25D366" }}
              />
               <FaInstagram
                title="Instagram"
                className="transition hover:scale-110 text-4xl"
                style={{ color: "#ff0096" }}
              />
              <FaGlobe
                title="Sitio Web"
                className="transition hover:scale-110 text-4xl"
                style={{ color: "#1E90FF" }}
              />
            </p>
          </div>

          {/* Contacto */}
          <ul className="text-md text-black/80 mb-6 space-y-1">
            <li>📞 +54 11 4444 5555</li>
            <li>📧 contacto@tuempresa.com</li>
          </ul>

          {/* Botones CTA */}
          <div className="flex gap-4">
            <button
              className="px-6 py-3 border-2 border-black text-black font-semibold rounded-full bg-yellow-300 hover:bg-yellow-400 transition"
              onClick={() => alert("🚀 Próximamente demo disponible")}
            >
              🚀 Solicitá una demo
            </button>
            <button
              className="px-6 py-3 border-2 border-black text-black font-semibold rounded-full bg-yellow-300 hover:bg-yellow-400 transition"
              onClick={() => alert("📚 Pronto disponible")}
            >
              ❓ Preguntas Frecuentes
            </button>
          </div>
        </div>
      </div>

      {/* Columna derecha: Login (30%) */}
      <div className="w-full lg:basis-[45%] bg-black flex items-center justify-center p-6">
        <form
          onSubmit={handleSubmit}
          className="bg-neutral-900 border border-yellow-400 text-white p-8 rounded-lg w-full max-w-sm shadow-xl"
        >
          <h2 className="text-3xl font-bold mb-6 text-center tracking-wide">
            🔐 Bienvenido al Panel Admin ✨
          </h2>

          <label className="block text-sm font-medium text-yellow-300 mb-1 ml-1">
            📧 Correo electrónico
          </label>
          <input
            type="email"
            placeholder="ejemplo@correo.com"
            className="bg-neutral-800 border input-bg border-neutral-600 placeholder-gray-400 text-white text-sm rounded w-full p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="block text-sm font-medium text-yellow-300 mb-1 ml-1">
            🔑 Contraseña
          </label>
          <div className="relative mb-6">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="bg-neutral-800 border input-bg border-neutral-600 placeholder-gray-400 text-white text-sm rounded w-full p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded transition duration-200 shadow-md"
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
        </form>
      </div>
    </div>
  );
}

export default Login;
