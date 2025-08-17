// backend/config/database.js
const mysql = require('mysql2/promise');
require('dotenv').config();



console.log('🔍 Iniciando configuración de la base de datos...');
console.log('🏢 Host:', process.env.MYSQLHOST);
console.log('👤 Usuario:', process.env.MYSQLUSER);
console.log('🔑 Base de datos:', process.env.MYSQLDATABASE);
console.log('🚪 Puerto:', process.env.MYSQLPORT || 3306);
console.log('🔌 Configurando conexión a la base de datos...');
console.log('📊 Base de datos:', process.env.MYSQLDATABASE);
console.log('🏠 Host:', process.env.MYSQLHOST);

// Validación de variables de entorno
const requiredEnvVars = ['MYSQLHOST', 'MYSQLUSER', 'MYSQLPASSWORD', 'MYSQLDATABASE'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(`Error de configuración: Faltan variables de entorno: ${missingVars.join(', ')}`);
  process.exit(1);
}



const pool = mysql.createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    timezone: 'Z'
});

/*

pool.getConnection()
  .then(connection => {
    console.log('✅ Conexión a la base de datos exitosa');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Error al conectar a la base de datos:', {
      code: err.code,
      errno: err.errno,
      message: err.message
    });
    process.exit(1);
  });

*/
// Probar la conexión
async function testConnection() {
  let connection;
  try {
    console.log('🔄 Probando conexión a la base de datos...');
    connection = await pool.getConnection();
    console.log('✅ Conexión exitosa a la base de datos');

    // Obtener información de la versión de MySQL
    const [rows] = await connection.query('SELECT VERSION() as version');
    console.log(`📊 Versión de MySQL: ${rows[0].version}`);

  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', {
      code: error.code,
      errno: error.errno,
      message: error.message,
      sqlState: error.sqlState
    });

    // Detalles adicionales para depuración
    console.log('🔍 Información de conexión usada:', {
      host: process.env.MYSQLHOST,
      user: process.env.MYSQLUSER,
      database: process.env.MYSQLDATABASE,
      port: process.env.MYSQLPORT || 3306
    });

    process.exit(1);
  } finally {
    if (connection) await connection.release();
  }
}

// Ejecutar la prueba de conexión
testConnection().catch(console.error);

// Manejo de eventos del pool
pool.on('acquire', (connection) => {
  console.log('🔌 Conexión adquirida del pool, ID:', connection.threadId);
});

pool.on('release', (connection) => {
  console.log('🔄 Conexión liberada al pool, ID:', connection.threadId);
});

pool.on('enqueue', () => {
  console.log('⏳ Esperando conexión disponible...');
});


// Manejo de errores
pool.on('error', (err) => {
  console.error('Error en el pool de MySQL:', {
    code: err.code,
    errno: err.errno,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});


module.exports = pool;