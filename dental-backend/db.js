const mysql = require('mysql2');

const db = mysql.createConnection({
  host: '127.0.0.1', // Changing this from 'localhost' fixes ECONNREFUSED
  user: 'root',
  password: '',
  database: 'dental_clinic_db'
});

db.connect((err) => {
    if (err) {
        console.error('Connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL! Your database is ready.');
});

module.exports = db;