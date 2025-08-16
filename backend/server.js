// backend/server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, '../public')));

// Rutas API
app.use('/api', apiRoutes);

// Servir la aplicación React/Angular/Vue (si la tienes)
// Ruta para manejar SPA (debe ir después de las rutas de API)
app.get('/{*any}', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Al inicio del archivo
console.log('Iniciando servidor...');
console.log('Entorno:', process.env.NODE_ENV || 'development');
console.log('Directorio raíz:', __dirname);

// Después de configurar la base de datos
console.log('Configuración de base de datos cargada');
console.log('Conectando a la base de datos en:', process.env.MYSQLHOST);



// Manejador de errores global (debe ir después de las rutas)
/*
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('¡Algo salió mal!');
});
*/
app.use((err, req, res, next) => {
  console.error('❌ Error en la aplicación:', {
    fecha: new Date().toISOString(),
    ruta: req.originalUrl,
    mensaje: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  res.status(500).json({
    error: 'Error interno del servidor',
    mensaje: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  //console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`\n✅ Servidor iniciado correctamente`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log(`🕒 ${new Date().toLocaleString()}`);
});