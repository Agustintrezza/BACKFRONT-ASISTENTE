const express = require('express');
const cors = require('cors');

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Importar rutas
const productosRoutes = require('./routes/productosRoutes');
const seccionesRoutes = require('./routes/seccionesRoutes');
const menuRoutes = require('./routes/menuRoutes');
const authRoutes = require('./routes/authRoutes');
const reservasRoutes = require('./routes/reservaRoutes');
const conversacionRoutes = require('./routes/conversacionRoutes');
const chatRoutes = require('./routes/chatRoutes');
const enviarManualRoute = require('./routes/enviarManual');     // Para simular respuestas programadas
const enviarAdminRoute = require('./routes/enviarAdmin');       // ✅ Para mensajes escritos por un operador humano
const modoAdminRoutes = require('./routes/modoAdmin');

// ✅ Definir prefijos de rutas
app.use('/api/productos', productosRoutes);
app.use('/api/secciones', seccionesRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reservas', reservasRoutes);

// ✅ Rutas unificadas de chat
app.use('/api/chat', conversacionRoutes); // /api/chat/conversaciones
app.use('/api/chat', chatRoutes);         // /api/chat/enviar
app.use('/api/chat', enviarManualRoute);  // /api/chat/manual
app.use('/api/chat', enviarAdminRoute);   // /api/chat/admin
app.use('/api/chat', modoAdminRoutes);

// ✅ Ruta raíz de prueba
app.get('/', (req, res) => {
  res.send('🌟 API de Asistente Virtual corriendo...');
});

module.exports = app;
