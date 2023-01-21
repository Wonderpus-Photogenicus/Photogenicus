require('dotenv').config({ path: '../.env' });

const SQL_URI = process.env.SQL_URI;
const PORT = process.env.PORT;

console.log("config in config.js", SQL_URI, PORT)

module.exports = { SQL_URI, PORT };
