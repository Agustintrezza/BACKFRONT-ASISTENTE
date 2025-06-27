const dotenv = require('dotenv');
const connectDB = require('./config/database');
const app = require('./app');

dotenv.config();

const PORT = process.env.PORT || 5000;

// Conectar DB
connectDB();

// Levantar server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
