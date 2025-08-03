import jwt_decode from "jwt-decode";

export function getUserFromToken() {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    const decoded = jwt_decode(token);

    return {
      _id: decoded._id || decoded.id, // 👈 clave: usar _id como referencia unificada
      email: decoded.email,
      role: decoded.role,
      plan: decoded.plan,
    };
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return null;
  }
}
