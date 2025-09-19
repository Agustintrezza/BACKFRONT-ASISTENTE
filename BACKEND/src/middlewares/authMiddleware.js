// backend/middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");

// ✅ Verifica que haya token y lo decodifica
exports.verifyToken = (req, res, next) => {
  // El token debería venir como: "Authorization: Bearer <token>"
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token requerido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Guardamos info del token en req.user -> { id, email, role }
    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ Error verificando token:", err.message);
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};

// ✅ Middleware para verificar roles permitidos (ej: solo admin)
exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const { role } = req.user;

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ error: "No autorizado" });
    }

    next();
  };
};

// ✅ Middleware opcional: asegurar que solo el dueño del perfil pueda modificar
exports.authorizeSelfOnly = () => {
  return (req, res, next) => {
    const userIdFromToken = req.user.id;
    const userIdFromParams = req.params.id;

    if (userIdFromToken !== userIdFromParams) {
      return res
        .status(403)
        .json({ error: "Solo podés acceder o editar tu propio perfil" });
    }

    next();
  };
};
