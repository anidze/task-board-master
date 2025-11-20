const sql = require('mssql');
require('dotenv').config();

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT),
  options: {
    encrypt: true, // Use encryption for Azure SQL
    trustServerCertificate: true, // Trust self-signed certificate for local SQL Server
    enableArithAbort: true
  }
};

// Connection pool
let pool;

const getConnection = async () => {
  try {
    if (!pool) {
      pool = await sql.connect(config);
      console.log('✅ Connected to SQL Server successfully');
    }
    return pool;
  } catch (err) {
    console.error('❌ Database connection error:', err.message);
    throw err;
  }
};

module.exports = {
  getConnection,
  sql
};
