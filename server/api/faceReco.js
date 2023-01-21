// tensorflow dependency is not required but speeds up operations drastically
// Note: python must be installed on your local machine for this dependency to work
require('@tensorflow/tfjs-node');
const canvas = require('canvas');
const faceapi = require('face-api.js');

// Canvas allows use of HTMLCanvasElement, HTMLImageElement, and ImageData in the nodejs environment
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// Identify path of models/shards & execute loading utilizing relative file path
const MODEL_URI = '../public/models';

// Schedule asynchronous actions from models utilizing Promise.all
const ssdMobilenetv1 = `faceapi.nets.ssdMobilenetv1.loadFromUri(${MODEL_URI})`;
const faceRecognitionNet = `faceapi.nets.faceRecognitionNet.loadFromUri(${MODEL_URI})`;
const faceLandmark68Net = `faceapi.nets.faceLandmark68Net.loadFromUri(${MODEL_URI})`;

const facialRecognition = async (queryImage, referenceImage) => {
  // Only run the faceapi.detectSingleFace model once positive the above three models have loaded/resolved
  try {
    await Promise.all([ssdMobilenetv1, faceRecognitionNet, faceLandmark68Net]);
  } catch (err) {
    console.log('Error occurred in loading of models/assets', err);
  }

  // Form recognition will utilize faceapi.FaceMatcher to compare REFERENCE face descriptors to QUERY face descriptors

  try {
    // Compute face descriptors of `referenceImage`
    const referenceData = await faceapi
      .detectAllFaces(referenceImage)
      .withFaceLandmarks()
      .withFaceDescriptors();

    if (!referenceData.length) {
      return;
    }

    // Use `referenceImage` face descriptor computation to initialize
    const faceMatcher = new faceapi.FaceMatcher(referenceData);

    // Compute face descriptors of `queryImage`
    const singleResult = await faceapi
      .detectSingleFace(queryImage)
      .withFaceLandmarks()
      .withFaceDescriptor();

    // If singleResult is returned, compare this to our previously initialized faceMatcher (initialized with referenceData)
    if (singleResult) {
      const bestMatch = faceMatcher.findBestMatch(singleResult.descriptor);
      console.log(bestMatch.toString());
    }
  } catch (err) {
    console.log(
      'Error occurred in attempting to perform facial recognition:',
      err
    );
  }
};
