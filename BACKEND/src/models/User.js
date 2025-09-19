const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // --- Datos básicos de acceso ---
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },

    // --- Relación con dueño (para multi-tenant / agencias) ---
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // --- Plan y facturación ---
    plan: { type: String, enum: ["basic", "premium", "advanced"], default: "basic" },
    billingCycle: { type: String, enum: ["monthly", "yearly"], default: "monthly" },
    planStartDate: { type: Date, default: Date.now },
    planEndDate: { type: Date }, // se calcula según billingCycle

    // --- Roles y permisos ---
    role: { type: String, enum: ["user", "admin"], default: "user" },

    // --- Métricas de uso ---
    consultasUsadas: { type: Number, default: 0 }, // API calls / prompts
    usuariosCreados: { type: Number, default: 0 }, // sub-usuarios
    conversacionesActivas: { type: Number, default: 0 },
    reservasActivas: { type: Number, default: 0 },

    // --- Analítica básica ---
    lastLogin: { type: Date },
    lastActivity: { type: Date }, // cualquier acción relevante
    loginCount: { type: Number, default: 0 },
    totalSessions: { type: Number, default: 0 }, // sesiones abiertas
    totalConversaciones: { type: Number, default: 0 }, // histórico
    totalReservas: { type: Number, default: 0 }, // histórico

    // --- Flags de estado ---
    isSuspended: { type: Boolean, default: false }, // bloquear si se pasa de límites
    isVerified: { type: Boolean, default: false }, // verificación email
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
