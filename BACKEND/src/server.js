const dotenv = require('dotenv');
const connectDB = require('./config/database');
const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const PORT = process.env.PORT || 5000;

// 1. Conectar a la base de datos
connectDB();

// 2. Crear servidor HTTP
const server = http.createServer(app);

// 3. Inicializar Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*', // Reemplazá '*' por tu frontend si querés restringir
    methods: ['GET', 'POST'],
  },
});

// 4. Hacer accesible 'io' en toda la app
app.set('io', io);

// 5. Manejo de conexión con salas por 'sender'
io.on('connection', (socket) => {
  console.log('🟢 Cliente conectado vía WebSocket:', socket.id);

  // 👉 El frontend debe emitir este evento con su "sender"
  socket.on('join', (sender) => {
    if (sender) {
      socket.join(sender);
      console.log(`👤 Socket ${socket.id} se unió a sala: ${sender}`);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔴 Cliente desconectado:', socket.id);
  });
});

// 6. Iniciar servidor
server.listen(PORT, () => {
  console.log(`🚀 Servidor con Socket.IO corriendo en puerto ${PORT}`);
});
