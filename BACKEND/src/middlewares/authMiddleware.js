const jwt = require("jsonwebtoken");

// ✅ Verifica que haya token y lo decodifica
exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token requerido" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
};

// ✅ Middleware para verificar roles permitidos (por ejemplo: solo admin)
exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const { role } = req.user;
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ error: "No autorizado" });
    }
    next();
  };
};

// ✅ Middleware opcional para asegurar que solo el dueño del perfil pueda modificar
exports.authorizeSelfOnly = () => {
  return (req, res, next) => {
    const userIdFromToken = req.user.id;
    const userIdFromParams = req.params.id;

    if (userIdFromToken !== userIdFromParams) {
      return res
        .status(403)
        .json({ error: "Solo podés editar tu propio perfil" });
    }

    next();
  };
};
