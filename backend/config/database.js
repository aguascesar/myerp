// backend/config/database.js
const mysql = require('mysql2/promise');

// Validación de variables de entorno
const requiredEnvVars = ['MYSQLHOST', 'MYSQLUSER', 'MYSQLPASSWORD', 'MYSQLDATABASE'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(`Error de configuración: Faltan variables de entorno: ${missingVars.join(', ')}`);
}


console.log('🔌 Configurando conexión a la base de datos...');
console.log('📊 Base de datos:', process.env.MYSQLDATABASE);
console.log('🏠 Host:', process.env.MYSQLHOST);

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
const pool = mysql.createPool({
  host: process.env.MYSQLHOST || 'localhost',
  user: process.env.MYSQLUSER || 'db',
  password: process.env.MYSQLPASSWORD || 'pass',
  database: process.env.MYSQLDATABASE || 'db',
  port: process.env.MYSQLPORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
*/

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