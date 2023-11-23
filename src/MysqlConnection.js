const mysql2 = require('mysql2/promise');

const pool =  mysql2.createPool({uri : process.env.DATABSE_URL});
module.exports = pool;