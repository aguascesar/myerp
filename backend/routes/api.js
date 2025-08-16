// backend/routes/api.js
const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

// Middleware de registro para todas las rutas
router.use((req, res, next) => {
  console.log(`\n🌐 ${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  console.log('📦 Cuerpo de la petición:', req.body);
  next();
});

router.get('/ejemplo', apiController.getEjemplo);

// Manejo de rutas no encontradas
router.use((req, res, next) => {
  console.warn(`⚠️ Ruta no encontrada: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Ruta no encontrada',
    ruta: req.originalUrl
  });
});


module.exports = router;