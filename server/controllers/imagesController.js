// require SQL dependency that allows us to query database i.e. People

const db = require('../models/image')

// Baseplate test for database

const addTest2 = db.prepare("INSERT INTO people (personName, image) VALUES (?, ?);");
addTest2.run("superhot", "delete");

const getTable = db.prepare("SELECT * FROM people");
console.log(getTable.all());

// imagesController will contain numerous methods that will be utilized within route handlers to handle required functionality
const imagesController = {};

// This middleware will be utilized when the client makes a post request to the server with an image to test
imagesController.uploadImage = (req, res, next) => {
  const addRow = db.prepare("INSERT INTO people (personName, image) VALUES (?, ?);");
  addRow.run("superhot", "delete");

  // Deconstructs req.body object for `imageUpload` that will contain an image uploaded by our client
  // const { imageUpload } = req.body;
  // Jordan: The image will be on the request body as a buffer. This line parses the buffer into a blob file.
  const imageToUpload = new Blob([req.body]);
  const { file } = req.files; // Using express-fileUpload package

  // Image should be stored in `res.locals.imageToAuthenticate`
  res.locals.imageToAuthenticate = imageUpload;

  // Return the next middleware
  return next();
};

// This middleware will be utilized when the admin makes a batch upload request to the server with images of the new NYOI cohort
imagesController.batchImageUpload = (req, res, next) => {
  // Deconstructs req.body object for images included within batch-upload
  const { batchImages } = req.body;

  // All images should be stored in SQL database

  // Define SQL query/value parameters
  const query = 'INSERT INTO people ... $1 ...';
  const values = [batchImages];

  // Execute SQL query to DB
  db.query(query, values)
    .then((dbResponse) => next())
    .catch((err) => next({ message: `${err}` }));

  // Continue to next middleware
  return next();
};

// Upon client request for authentication of an image, this middleware should be activated to retrieve all photos from `people` SQL database.
imagesController.retrieveImages = (req, res, next) => {
  // Define SQL query parameters to retrieve all images currently stored in database
  const query = 'SELECT image FROM images';

  // Execute SQL query to DB
  db.query(query, values)
    // Store response of db into res.locals for access in next middleware
    .then((peopleInDb) => {
      res.locals.peopleInDb = peopleInDb;
      return next();
    })
    .catch((err) => next({ message: `${err}` }));
};

// Export `imagesController` for use within `routes/images.js`
module.exports = imagesController;
