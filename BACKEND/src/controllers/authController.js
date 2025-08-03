const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar el usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    // Comparar passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    // Crear token incluyendo role y plan
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        plan: user.plan,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        plan: user.plan,
      },
    });

  } catch (error) {
    console.error("❌ Error en login:", error.message);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
