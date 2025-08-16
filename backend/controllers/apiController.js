// backend/controllers/apiController.js
const pool = require('../config/database');

exports.getEjemplo = async (req, res) => {
  console.log(`\n🔍 Nueva solicitud a ${req.originalUrl}`);
  console.log('📝 Parámetros:', req.params);
  console.log('🔗 Query params:', req.query);

  try {
    console.log('🔍 Ejecutando consulta a la base de datos...');
    const [rows] = await pool.query('SELECT * FROM main');

    console.log(`✅ Consulta exitosa. ${rows.length} registros encontrados`);
    res.json(rows);

  } catch (error) {
    //console.error(error);
    //res.status(500).json({ error: 'Error al obtener datos' });
      console.error('❌ Error en la consulta:', {
        mensaje: error.message,
        sql: error.sql,
        código: error.code
      });
      next(error); // Pasa el error al manejador de errores
  }
};