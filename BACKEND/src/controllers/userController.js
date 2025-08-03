const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ✅ Obtener todos los usuarios (solo admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error.message);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

// ✅ Crear nuevo usuario (solo admin puede crear admin)
exports.createUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "El email ya está en uso" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userRole = role === "admin" && req.user.role === "admin" ? "admin" : "user";

    const newUser = new User({
      email,
      password: hashedPassword,
      role: userRole,
      ownerId: req.user.id,
    });

    await newUser.save();
    res.status(201).json({ message: "Usuario creado exitosamente" });
  } catch (error) {
    console.error("❌ Error al crear usuario:", error.message);
    res.status(500).json({ error: "Error al crear usuario" });
  }
};

// ✅ Editar usuario (según permisos)
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, password, role } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const esAdmin = req.user.role === "admin";
    const esMismoUsuario = req.user.id === id;

    // 🔒 Solo el usuario puede cambiar su email o password
    if (email && !esMismoUsuario) {
      return res.status(403).json({ error: "No podés cambiar el email de otro usuario" });
    }

    if (password && !esMismoUsuario) {
      return res.status(403).json({ error: "No podés cambiar la contraseña de otro usuario" });
    }

    // ✏️ Si edita su propio email
    if (email && esMismoUsuario) {
      if (email !== user.email) {
        const emailInUse = await User.findOne({ email });
        if (emailInUse) {
          return res.status(400).json({ error: "El email ya está en uso" });
        }
        user.email = email;
      }
    }

    // 🔑 Si edita su propia password
    if (password && esMismoUsuario) {
      user.password = await bcrypt.hash(password, 10);
    }

    // ✅ Admin puede cambiar el rol de cualquier usuario
    if (esAdmin && role && user.role !== role) {
      user.role = role;
    }

    await user.save();

    const userResponse = {
      _id: user._id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    res.json({ message: "Perfil actualizado", user: userResponse });
  } catch (error) {
    console.error("❌ Error al actualizar perfil:", error.message);
    res.status(500).json({ error: "Error al actualizar perfil" });
  }
};

// ✅ Eliminar usuario (solo admin)
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "No autorizado para eliminar usuarios" });
    }

    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar usuario:", error.message);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};
