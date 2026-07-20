require('dotenv').config();
const express = require('express');
const cors = require('cors');
const conectarDB = require('./config/db');
const trabajadoresRoutes = require('./routes/trabajadores.routes');

const app = express();
const PUERTO = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/trabajadores', trabajadoresRoutes);

// Ruta de estado, útil para verificar que el servidor esté vivo
app.get('/api/salud', (req, res) => {
  res.json({ estado: 'ok', servicio: 'API Prevención de Riesgos' });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

// Iniciar servidor solo después de conectar a la base de datos
conectarDB().then(() => {
  app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en http://localhost:${PUERTO}`);
  });
});
