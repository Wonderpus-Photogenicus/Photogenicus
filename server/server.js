const path = require('path');
const express = require('express');

const db = require('./models/image');

const app = express();
const PORT = 3001;

const makeTable = "CREATE TABLE IF NOT EXISTS people ( personName VARCHAR(255), image BLOB);";
const addJordy = db.prepare("INSERT INTO people (personName, image) VALUES ('Jordan', 'This works');");
const addTest2 = db.prepare("INSERT INTO people (personName, image) VALUES ('testing', '12345');");
const getTable = db.prepare("SELECT personName FROM people");

db.exec(makeTable);
addTest2.run();
console.log(getTable.get());

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = app;
