const mysql = require('mysql2/promise')
require('dotenv').config()

const connection_pool = mysql.createPool({
    host              : process.env.HYPERDB_HOST,
    port              : process.env.HYPERDB_PORT,
    user              : process.env.HYPERDB_USER,
    password          : process.env.HYPERDB_PASS,
    database          : 'hyperdb',
    waitForConnections: true,
    connectionLimit   : 10,
    queueLimit        : 0
  });


module.exports = connection_pool