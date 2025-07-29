const express = require('express');
const cors = require('cors');

// Importar rutas
const productosRoutes = require('./routes/productosRoutes');
const seccionesRoutes = require('./routes/seccionesRoutes');
const menuRoutes = require('./routes/menuRoutes');
const authRoutes = require('./routes/authRoutes');
const reservasRoutes = require('./routes/reservaRoutes'); // 🆕 NUEVA RUTA

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/productos', productosRoutes);     
app.use('/api/secciones', seccionesRoutes);     
app.use('/api/menu', menuRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reservas', reservasRoutes); // 🆕 ACTIVAR RUTA DE RESERVAS

// Ruta básica de prueba
app.get('/', (req, res) => {
  res.send('🌟 API de Asistente Virtual corriendo...');
});

module.exports = app;
