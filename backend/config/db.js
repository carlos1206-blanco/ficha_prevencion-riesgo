const mongoose = require('mongoose');

async function conectarDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('Error: falta la variable de entorno MONGODB_URI (revisa tu archivo .env)');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('Conectado a MongoDB Atlas correctamente.');
  } catch (error) {
    console.error('Error al conectar a MongoDB Atlas:', error.message);
    process.exit(1);
  }
}

module.exports = conectarDB;
