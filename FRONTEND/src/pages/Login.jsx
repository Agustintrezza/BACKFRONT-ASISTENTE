import { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Limpiar mensaje anterior
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
      setTimeout(() => setErrorMessage(""), 3500); // Ocultar en 3 segundos
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
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
  );
}

export default Login;
