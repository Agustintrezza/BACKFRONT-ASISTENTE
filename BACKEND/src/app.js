// src/app.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// 🧩 Middlewares de tenancy + config centralizada
const { tenantResolver } = require('./middlewares/tenantResolver');
const { attachConfig } = require('./middlewares/attachConfig');

// 🧭 Rutas de configuración (sirven config/branding/menu desde YAML+tenant)
const configRoutes = require('./routes/config.routes');

// ✅ Rutas existentes del proyecto (legacy + CRUD)
const productosRoutes = require('./routes/productosRoutes');
const seccionesRoutes = require('./routes/seccionesRoutes');
const menuRoutes = require('./routes/menuRoutes');
const authRoutes = require('./routes/authRoutes');
const reservasRoutes = require('./routes/reservaRoutes');

// ✅ Rutas unificadas de chat
const conversacionRoutes = require('./routes/conversacionRoutes'); // /api/chat/conversaciones
const chatRoutes = require('./routes/chatRoutes');                 // /api/chat/enviar
const enviarManualRoute = require('./routes/enviarManual');       // /api/chat/enviarManual
const enviarAdminRoute = require('./routes/enviarAdmin');         // /api/chat/enviarAdmin
const modoAdminRoutes = require('./routes/modoAdmin');            // /api/chat/modo-admin
const chatgpt = require("./routes/chatgpt.routes");


// 👤 Usuarios
const usuariosRoutes = require('./routes/userRoutes');

const app = express();

// ------------------------
// Middlewares base
// ------------------------
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.set('trust proxy', true);

// ------------------------
// Tenancy + Config
// ------------------------
// Detecta tenant por ?tenant=, header x-tenant o DEFAULT_TENANT (.env)
app.use(tenantResolver);

// Carga y adjunta la config del asistente en req.cfg (o lanza error)
app.use(attachConfig);

// ------------------------
// Endpoints de Configuración
// ------------------------
// Monta:
//   GET /config     -> config completa (branding, features, menu, etc.)
//   GET /branding   -> datos de marca (nombre, colores, logo)
//   GET /menu       -> menú desde config si features.useConfigForMenu = true, sino fallback legacy
//   GET /menu/source -> { source: 'config' | 'legacy', items: [...] }
app.use('/api/config', configRoutes);

// ------------------------
// Rutas legacy / API principal
// ------------------------
app.use('/api/productos', productosRoutes);
app.use('/api/secciones', seccionesRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reservas', reservasRoutes);

// ✅ Chat unificado
app.use('/api/chat', conversacionRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/chat', enviarManualRoute);
app.use('/api/chat', enviarAdminRoute);
app.use('/api/chat', modoAdminRoutes);
app.use("/api/chatgpt", chatgpt);

// 👤 Usuarios
app.use('/api/usuarios', usuariosRoutes);

// ------------------------
// Healthchecks / raíz
// ------------------------
app.get('/', (_req, res) => {
  res.send('🌟 API de Asistente Virtual corriendo...');
});

app.get('/health', (_req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

// ------------------------
// 404 para rutas no encontradas
// ------------------------
app.use((req, res, next) => {
  if (res.headersSent) return next();
  res.status(404).json({
    error: 'Not Found',
    path: req.originalUrl,
  });
});

// ------------------------
// Manejo básico de errores
// ------------------------
app.use((err, _req, res, _next) => {
  // Si algo falló cargando la config (schema, YAML, etc.), lo vas a ver acá
  console.error('❌ Error:', err && (err.stack || err.message || err));
  res.status(500).json({
    error: 'Internal Server Error',
    detail: err && (err.message || String(err)),
  });
});

module.exports = app;
