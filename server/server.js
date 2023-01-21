const config = require('./utils/config.js');
const path = require('path');
const fileUpload = require('express-fileupload');
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

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

// Global error handler
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
