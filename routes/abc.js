const sqlite3 = require('sqlite3').verbose();

// open a database connection
let db = new sqlite3.Database('./users.db');

//
const data = ['987654', 'user1@email.com'];
const sql = `UPDATE users
            SET pin = ?
            WHERE email = ?`;

db.run(sql, data, function (err) {
  if (err) {
    return console.error(err.message);
  }
  console.log(`Row(s) updated: ${this.changes}`);
});

// close the database connection
db.close();