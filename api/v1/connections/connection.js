const mysql = require('mysql');
require('dotenv').config();


// This is for single connect
const connectionProductManagementSystem = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST_v1,
    user: process.env.DB_USER_v1,
    password: process.env.DB_PASS_v1,
    database: process.env.DB_DATABASE_v1
});


module.exports = {
    
    connectionProductManagementMYSQL: connectionProductManagementSystem,
   
}