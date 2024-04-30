const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./puppee.db', (err) => {
    if (err) {
        console.error(err.message)
    }
    console.log('Connected to puppee database.')
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS EVENTS(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT,
        type TEXT,
        time TEXT,
        ate BOOLEAN
    )`, (err) => {
        if (err) {
            console.error(err.message)
        }
    });
});

module.exports = db;