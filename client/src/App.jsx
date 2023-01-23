import './styles/App.css';
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { FileUploader } from 'react-drag-drop-files';
import axios from 'axios';
import Webcam from 'react-webcam';
import successLogo from '../assets/success.png';
import denyLogo from '../assets/denied.png';

const fileTypes = ['JPG', 'PNG'];

const WebcamCapture = ({ setAuth }) => {
  const handleChange = (base64Image) => {
    axios({
      method: 'POST',
      url: 'http://localhost:3001/image',
      data: { base64Image },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((data) => {
      if (data.request.responseText.includes('person')) {
        setAuth(true);
      } else {
        setAuth(false);
      }
      setTimeout(() => {
        setAuth(null);
      }, 5000);
    });
  };

  return (
    <div id='webcam-container'>
      <Webcam
        audio={false}
        height={360}
        screenshotFormat='image/jpeg'
        width={480}
      >
        {({ getScreenshot }) => (
          <button
            onClick={() => {
              const imageSrc = getScreenshot();
              handleChange(imageSrc);
            }}
            id='capture-button'
          >
            CAPTURE PHOTO
          </button>
        )}
      </Webcam>
    </div>
  );
};

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

  return (
    <div id='container'>
      <h1>photogenicus</h1>
      <div className='image-containers'>
        <div className='sub-container'>
          {webcam && (
            <p className='capture-subtext'>
              <i>Click 'Capture Photo' to initiate authentication process.</i>
            </p>
          )}
          {webcam && <WebcamCapture setAuth={setAuth} setWebcam={setWebcam} />}
          <button className='webcam-status' onClick={handleCameraStatus}>
            {`Click here to turn ${webcam ? 'off' : 'on'} your devices' camera`}
          </button>
          {auth === true ? renderAuth(true) : ''}
          {auth === false ? renderAuth(false) : ''}
        </div>
        <div className='sub-container'>
          <p className='upload-subtext'>
            <i>Drag-and-drop identification photographs here.</i>
          </p>
          <FileUploader
            handleChange={handleChange}
            name='file'
            types={fileTypes}
            className='file-uploader'
            height={360}
            width={360}
            multiple={true}
            onDrop={(file) => console.log(`Your files have been received.`)}
          />
          <p className='drop-status'>
            {file ? `File name: ${file.name}` : 'No files uploaded yet.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
