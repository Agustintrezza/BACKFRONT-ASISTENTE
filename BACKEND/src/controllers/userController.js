// backend/controllers/userController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// 🔹 Crear usuario (solo admin)
exports.createUser = async (req, res) => {
  try {
    const { email, password, role, plan, billingCycle } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      role,
      plan,
      billingCycle,
    });

    await user.save();
    res.status(201).json({
      message: "Usuario creado exitosamente",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    console.error("Error creando usuario:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// 🔹 Obtener todos los usuarios (admin)
exports.getAllUsers = async (_req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("Error listando usuarios:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// 🔹 Obtener perfil del usuario autenticado
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error obteniendo perfil:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// 🔹 Obtener usuario por ID
exports.getUserById = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.id !== req.params.id) {
      return res.status(403).json({ message: "No autorizado" });
    }

    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error obteniendo usuario:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// 🔹 Actualizar usuario
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin" && req.user.id !== id) {
      return res.status(403).json({ message: "No autorizado" });
    }

    const updates = { ...req.body };
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario actualizado", user });
  } catch (error) {
    console.error("Error actualizando usuario:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// 🔹 Eliminar usuario
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userDeleted = await User.findByIdAndDelete(id);

    if (!userDeleted) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error eliminando usuario:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};
