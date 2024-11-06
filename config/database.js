const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: 'rachitdbms',
    password: '1234',
    database: process.env.DB_NAME || 'banking_system',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

module.exports = pool.promise();