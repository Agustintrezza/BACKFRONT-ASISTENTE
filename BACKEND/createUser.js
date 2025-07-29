const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

async function createUser() {
  await mongoose.connect(process.env.MONGO_URI);
  const hashedPassword = await bcrypt.hash('123456', 10);

  const user = new User({
    email: 'admin@example.com',
    password: hashedPassword
  });

  await user.save();
  // console.log('Usuario creado');
  mongoose.disconnect();
}

createUser();
