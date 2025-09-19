// backend/routes/userRoutes.js
const express = require("express");
const {
  createUser,
  getAllUsers,
  getProfile,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const {
  verifyToken,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

const router = express.Router();

// ✅ Perfil del usuario autenticado
router.get("/me", verifyToken, getProfile);

// ✅ Obtener todos los usuarios (solo admin)
router.get("/", verifyToken, authorizeRoles("admin"), getAllUsers);

// ✅ Obtener usuario por ID (admin o el mismo usuario)
router.get("/:id", verifyToken, getUserById);

// ✅ Crear usuario (solo admin)
router.post("/crear", verifyToken, authorizeRoles("admin"), createUser);

// ✅ Editar usuario (usuario puede editar su perfil, admin cualquier usuario)
router.put("/:id", verifyToken, updateUser);

// ✅ Eliminar usuario (solo admin)
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteUser);

module.exports = router;
