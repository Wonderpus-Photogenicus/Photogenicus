const config = require('./utils/config.js');
const path = require('path');
const fileUpload = require('express-fileupload');
const express = require('express');

const db = require('./models/image');

const app = express();
const morgan = require('morgan');
const cors = require('cors');

// Baseplate test for database
const makeTable = "CREATE TABLE IF NOT EXISTS people ( personName VARCHAR(255), image BLOB);";
const addJordy = db.prepare("INSERT INTO people (personName, image) VALUES ('Jordan', 'This works');");
const addTest2 = db.prepare("INSERT INTO people (personName, image) VALUES ('testing', '12345');");
const getTable = db.prepare("SELECT personName FROM people");

db.exec(makeTable);
addTest2.run();
console.log(getTable.get());



// imagesRouter handles all client requests to '/image' endpoint
const imagesRouter = require('./routes/images.js');

// Defines cors middleware configuration
const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    callback(null, true);
  },
};

// Enabling middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(fileUpload());
app.use(morgan('tiny'));

// imagesRouter handles all client requests to '/image' endpoint
app.use('/image', imagesRouter);

// Unknown endpoint handler
app.use('*', (req, res) =>
  res.status(404).send("This is not the page you're looking for...")
);

app.use(express.json())

app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

// Listen to server on specified port (defined within config.js)
app.listen(config.PORT, () => {
  console.log(`Server listening on port: ${config.PORT}`);
});

// Export express app
module.exports = app;
