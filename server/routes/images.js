const imagesRouter = require('express').Router();
const imagesController = require('../controllers/imagesController.js');
const apiController = require('../controllers/apiController.js');


//  Responds to client post request to '/image' endpoint [When a user takes an image to be authenticated by our application]
imagesRouter.post(
  '/',
  imagesController.uploadImage,
  imagesController.retrieveImages,
  apiController.processImages,
  async (req, res) => {
    // Final outcome of authentication after middleware processing will be stored in: `res.locals.auth`
    res.status(200).send(res.locals.auth);
  }
);

imagesRouter.post('/batchImages',
  imagesController.batchImageUpload, 
  // imagesController.batchedTotal,
  (req, res) => {
    res.sendStatus(200).json(res.locals.allImages)
  }
)

imagesRouter.get('/batchImages',
  imagesController.retrieveImages,
  (req, res) => {
    res.json(res.locals.peopleInDb)
  }
)

module.exports = imagesRouter;
