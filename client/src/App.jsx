import './styles/App.css';
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { FileUploader } from 'react-drag-drop-files';
import axios from 'axios';
import Webcam from 'react-webcam';
import successLogo from '../assets/success.png';
import denyLogo from '../assets/denied.png';
import octopusBlue from '../assets/wonderpusBannerBlue.png'
import octopusPink from '../assets/wonderpusBannerPink.png'
import WebcamCapture from './components/WebcamCapture';

//Begin Filepond (batch image upload) stuff
//// Import React FilePond
import { FilePond, File, registerPlugin } from 'react-filepond'
//// Import FilePond styles
import 'filepond/dist/filepond.min.css'
//// Import the Image EXIF Orientation and Image Preview plugins
//// Note: These need to be installed separately
//// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
//// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)
//End Filepond stuff




// const fileTypes = ['JPG', 'PNG'];

// const WebcamCapture = ({ setAuth }) => {
//   const handleChange = (base64Image) => {
//     axios({
//       method: 'POST',
//       url: 'http://localhost:3001/image',
//       data: { base64Image },
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     }).then((data) => {
//       if (data.request.responseText.includes('person')) {
//         setAuth(true);
//       } else {
//         setAuth(false);
//       }
//       setTimeout(() => {
//         setAuth(null);
//       }, 5000);
//     });
//   };

//   return (
//     <div id='webcam-container'>
//       <Webcam
//         audio={false}
//         height={360}
//         screenshotFormat='image/jpeg'
//         width={480}
//         mirrored={true}
//       >
//         {({ getScreenshot }) => (
//           <button
//             onClick={() => {
//               const imageSrc = getScreenshot();
//               handleChange(imageSrc);
//             }}
//             id='capture-button'
//           >
//             CAPTURE PHOTO
//           </button>
//         )}
//       </Webcam>
//     </div>
//   );
// };

const App = () => {
  const [file, setFile] = useState(null);
  const [auth, setAuth] = useState(null);
  const [webcam, setWebcam] = useState(false);

  const handleChange = (files) => {
    setFile(files);
    axios({
      method: 'POST',
      url: 'http://localhost:3001/image/batch',
      data: { file },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };

  const renderAuth = (status) => (
    <img
      className='auth_status'
      src={status === true ? successLogo : denyLogo}
    />
  );

  const handleCameraStatus = () => {
    webcam ? setWebcam(false) : setWebcam(true);
  };

  //this currently has no use, but might be helpful if you want to show people EVERY image they've uploaded to the DB across time
  //// const filesProcessed = () => {
  ////   axios({
  ////     method: 'GET',
  ////     // this needs a differer
  ////     url: 'http://localhost:3001/image/batch'
  ////   })
  //// }

  const imageArchive = []


  return (
    <div id='container'>
      <img className="bannerLogo" src={octopusBlue}></img>
      {/* <h1>photogenicus</h1> */}
      <div className='image-containers'>

        {/* WEBCAM CAPTURE CONTAINER */}
        <div className='sub-container'>
          {webcam && (
            <p className='capture-subtext'>
              <i>Click 'Capture Photo' to initiate authentication process.</i>
            </p>
          )}
          {/* READ ME PLSSSS:  the backend will crash if you click "capture photo" before the webcam video renders */}
          {webcam && <WebcamCapture setAuth={setAuth} setWebcam={setWebcam} />}

          <button className='webcam-status' onClick={handleCameraStatus}>
            {`Click here to turn ${webcam ? 'off' : 'on'} your devices' camera`}
          </button>
          {/* {auth ? auth : null} */}
          {auth === true ? renderAuth(true) : ''}
          {auth === false ? renderAuth(false) : ''}

        </div>

        {/* IMAGE CONTAINER     */}
        <div className='sub-container'>
          <p className='upload-subtext'>
            <i>Drag-and-drop identification photographs here.</i>
          </p>
          <FilePond
            // see note on const filesProcessed above
            // onprocessfile={filesProcessed}
            allowMultiple={true}
            server="http://localhost:3001/image/batch"
          />
          <p className='drop-status'>
            {file ? `File name: ${file.name}` : 'No files uploaded yet.'}
          </p>
          {imageArchive ? imageArchive : null}
        </div>
      </div>
    </div>
  );
};

export default App;
