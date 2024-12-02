const mysql = require('mysql2');

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'admin123',
  database: 'dispatcher_management_system'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    throw err;
  }
  console.log('Connected to MySQL!');
});

module.exports = db;
