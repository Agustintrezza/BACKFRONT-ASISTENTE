const express = require("express");
const {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const {
  verifyToken,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

const router = express.Router();

// ✅ Obtener todos los usuarios (solo usuarios logueados)
router.get("/", verifyToken, getAllUsers);

// ✅ Crear usuario (solo usuarios logueados)
router.post("/crear", verifyToken, createUser);

// ✅ Editar usuario (usuarios pueden editar su propio perfil, y admin puede editar roles)
router.put("/:id", verifyToken, updateUser);

// ✅ Eliminar usuario (solo admin puede eliminar usuarios)
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteUser);

module.exports = router;
