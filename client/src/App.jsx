// import './App.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Counter } from './features/counter/Counter.js'
import { FileUploader } from "react-drag-drop-files";
import axios from 'axios'; 
import Webcam from 'react-webcam';



const WebcamCapture = () => {
  // const webcamRef = React.useRef(null);
  // const [imgSrc, setImgSrc] = React.useState(null);

  // const capture = React.useCallback(() => {
  //   const imageSrc = webcamRef.current.getScreenshot();
  //   setImgSrc(imageSrc);
  // }, [webcamRef, setImgSrc]);
  // const setRef = (webcam) => {
  //   this.webcam = webcam;
  // };

  const handleChange = (base64Image) => {
    console.log(base64Image);
    axios({
      method: 'POST',
      url: 'http://localhost:3001/image',
      // body: {base64Image},
      data: {base64Image},
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
  }

  return (
    <div>
    <Webcam
    audio={false}
    height={720}
    screenshotFormat="image/jpeg"
    width={1280}
    // videoConstraints={videoConstraints}
  >
    {({ getScreenshot }) => (
      <button
        onClick={() => {
          const imageSrc = getScreenshot()
          console.log(imageSrc)
          handleChange(imageSrc)
        }}
      >
        Capture photo
      </button>
    )}
  </Webcam>
</div>



    // <div>
    //   <Webcam
    //     audio={false}
    //     screenshotFormat="image/jpeg"
    //   >
    //   {({ getScreenshot }) => (
    //   <button
    //     onClick={() => {
    //       const imageSrc = getScreenshot()
    //     }}
    //   >Capture Photo</button>
    //   </Webcam>
    // </div>
  );
};







const App = () => {
  const handleChange = (files) => {
    console.log(files);
    axios({
      method: 'POST',
      url: 'http://localhost:3001/image',
      data: {files},
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
  }
  
  return (
    <div>Hello from Team Photogenicus
      <Counter></Counter>
      <FileUploader handleChange={handleChange} name="file" types={undefined} />
      <WebcamCapture />
    </div>
   
  );
};

export default App;