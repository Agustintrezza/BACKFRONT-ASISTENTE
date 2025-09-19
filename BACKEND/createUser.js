// backend/createUser.js
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

async function createUser() {
  await mongoose.connect(process.env.MONGO_URI);
  const hashedPassword = await bcrypt.hash('123456', 10);

  const user = new User({
    email: 'admin@example.com',
    password: hashedPassword,
    role: 'admin',              // 👈 arranca como admin
    plan: 'premium',              // 👈 plan inicial
    billingCycle: 'monthly',    // 👈 ciclo de facturación
    isVerified: true            // 👈 marcado como verificado
  });

  await user.save();
  console.log('✅ Usuario admin creado:', user.email);
  mongoose.disconnect();
}

createUser();
