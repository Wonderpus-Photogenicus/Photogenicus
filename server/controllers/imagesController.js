// require SQL dependency that allows us to query database i.e. People
const fs = require('fs');
const path = require('path');
const db = require('../models/image')


// imagesController will contain numerous methods that will be utilized within route handlers to handle required functionality
const imagesController = {};

// This middleware will be utilized when the client makes a post request to the server with an image to test
imagesController.uploadImage = (req, res, next) => {

  //Webcam photo and headshot/reference file uploads will come in different spots
  //multi-file uplaods currently not working for some reason? but one phot will always upload here
  console.log("req files in uploadimage:" , req.files)

  //webcam photos (for comparison) will be passed as a base64 string here
  console.log("req body in uploadimage:" , req.body)

  // Deconstructs req.body object for `imageUpload` that will contain an image uploaded by our client
  // const { imageUpload } = req.body;
  const { file } = req.files; // Using express-fileUpload package

  // Image should be stored in `res.locals.imageToAuthenticate`
  res.locals.imageToAuthenticate = imageUpload;

  // Return the next middleware
  return next();
};

// This middleware will be utilized when the admin makes a batch upload request to the server with images of the new NYOI cohort
imagesController.batchImageUpload = (req, res, next) => {

  // Clarification note: This feature will take individual submissions of photos. Mutiple image submissions could run multiple requests from the front end using for loops.
  // The other option is for batch uploads of images to be merged into 1 mass image collage.
  // For the second option: a table with columns for orginization name, and batchimage blob file would be more appropriate.
  
  // Deconstructs req.body object for images included within batch-upload. Batch images should be recieved as a buffer anyway allowing direct input into tables.
  const { batchImages } = req.body;

  // executes SQL query. failure of statement.run() method throws an error which will be caught and sent to the global error handler
  try {
    // person is a placeholder for names in the future. For the time being, names do not matter
    const row = addRow.run('person', batchImages);
  } catch(err){
    return next({ log: err, message: 'database query failure in batchImageUpload'});
  }

  return next();
};

// Upon client request for authentication of an image, this middleware should be activated to retrieve all photos from `people` SQL database.
imagesController.retrieveImages = (req, res, next) => {

  // Define SQL query parameters to retrieve all images currently stored in database
  const getTable = db.prepare("SELECT image FROM people");

  // Execute SQL query to DB. If query fails, catch the Error that is thrown by sqlite3 and throw it to global error hanlder.
  try {
    const peopleBuffers = getTable.all();
    
    const peopleImages = [];

    for(let i = 0; i < peopleBuffers.length; i++){
      peopleImages.push(Buffer.from(peopleBuffers[i].image).toString('base64'));
    }
    
    // Store response of db into res.locals for access in next middleware
    res.locals.peopleInDb = peopleImages;
  } catch(err){
    return next({ log: err, message: 'database query failure in retrieveImages'});
  }
};

// Export `imagesController` for use within `routes/images.js`
module.exports = imagesController;
