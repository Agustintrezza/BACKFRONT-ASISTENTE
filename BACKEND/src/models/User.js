// models/User.js
const mongoose = require("mongoose");

// models/User.js
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    plan: { type: String, enum: ["free", "premium"], default: "free" },
    role: { type: String, enum: ["user", "admin"], default: "user" }, // ✅ nuevo campo
  },
  { timestamps: true }
);


module.exports = mongoose.model("User", userSchema);
