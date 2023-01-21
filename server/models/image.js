const Database = require('better-sqlite3');
const db = new Database('people.db', { verbose: console.log });

module.exports = db;