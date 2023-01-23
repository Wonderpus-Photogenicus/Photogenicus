// import './App.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Counter } from './features/counter/Counter.js'
import { FileUploader } from "react-drag-drop-files";
import axios from 'axios'; 
import Webcam from 'react-webcam';

// Import React FilePond
import { FilePond, File, registerPlugin } from 'react-filepond'

// Import FilePond styles
import 'filepond/dist/filepond.min.css'

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

// // Our app
// const  FilePondHook () {
//   const [files, setFiles] = useState([])
//   return (
//     <div className="App">
//       <FilePond
//         files={files}
//         onupdatefiles={setFiles}
//         allowMultiple={true}
//         maxFiles={3}
//         server="/api"
//         name="files" {/* sets the file input name, it's filepond by default */}
//         labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
//       />
//     </div>
//   )
// }


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
    mirrored="true"
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
  // const handleChange = (files) => {
  //   console.log("handleChange running");
  //   axios({
  //     method: 'POST',
  //     url: 'http://localhost:3001/image',
  //     data: {files},
  //     headers: {
  //       "Content-Type": "multipart/form-data"
  //     }
  //   })
  //   .then()
  // }
  const filesProcessed = () => {
    axios({
      method: 'GET',
      url: 'http://localhost:3001/image/batchImages'
    })
    .then(data => {
      console.log(data)
      imageArchive.push(data)
      return data});
  }

  const imageArchive = []


  return (
    <div>Hello from Team Photogenicus
      <Counter></Counter>
      <FilePond
        // files={files}
        // onupdatefiles={setFiles}
        // onupdatefiles={files => {
        //   const formData = new FormData();
        //   files.forEach(item => formData.append('my-file', item.file))
        //   console.log(formData)
        //   // handleChange(formData)
        // }}
        onprocessfile={filesProcessed}
        // onprocessfiles={files => {
        //   filesProcessed();
        //   // console.log('files processed', files);
          
        // }}
        allowMultiple={true}
        // maxFiles={}
        server="http://localhost:3001/image/batchImages"
        // name="files"
        // labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
      />
      {/* <FileUploader handleChange={handleChange} name="file" types={undefined} /> */}
      <WebcamCapture />
      {imageArchive.length ? imageArchive : null}
    </div>
   
  );
};

export default App;