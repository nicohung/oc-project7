//this file is used to connect the database

//Pool allows us to configure the connection
const Pool = require('pg').Pool;

// Create a new pool with your PostgreSQL database connection details
const pool = new Pool({
  user: 'nicolashung',
  host: 'localhost',
  database: 'groupomania_db',
  password: 'password',
  port: 5432, // Default PostgreSQL port
});

module.exports = pool;
