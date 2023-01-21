const apiController = {};

// apiController will contain numerous methods that will be utilized within route handlers to handle communication with face-api.js & ultimately store response in res.locals.authResponse (or something similar)
apiController.processImages = async (req, res, next) => {
  // imagesController.uploadImage middleware will provide us with the image to authenticate in: `res.locals.imageToAuthenticate`

  // imagesController.retrieveImages middleware will provide us with all the images in the `People` DB in: `res.locals.peopleInDb`

  // Provide the data to face-api.js for processing

  // Process response from face-api.js by comparing value with pre-defined thresholds (what should be considered 'authenticated' vs. 'not-authenticated')

  // Store final outcome in `res.locals.auth`

  // Move onto the next middleware
  return next();
};

// Export `apiController` for use within `routes/images.js`
module.exports = apiController;
