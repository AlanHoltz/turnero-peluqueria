const mysql = require("mysql");


let db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "turnero",
    
});


module.exports = db;
