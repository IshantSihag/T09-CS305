import React, { useState, useRef } from "react";
import {notifyError} from "../UI/ToastNotification.jsx";

const PhotoCaptureWindow = ({ onCapture, onClose }) => {
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = useRef();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      setCameraStream(stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      notifyError("Error while accessing camera");
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      const tracks = cameraStream.getTracks();

      tracks.forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  const capturePhoto = () => {
    const videoElement = videoRef.current;
  
    if (videoElement && cameraStream) {
    
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
  
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
  
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  
      const photoDataURL = canvas.toDataURL("image/jpeg");
  
      // Call the callback function to pass the captured photo data
      onCapture(photoDataURL);
  
      // Close the photo capture window
      onClose();
  
      // Stop the camera
      stopCamera();
      
    }
  };
  
  React.useEffect(() => {
    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="relative">
        <video ref={videoRef} autoPlay playsInline muted className="w-full max-w-md"></video>
        <button
          onClick={capturePhoto}
          className="absolute bottom-4 right-4 px-4 py-2 bg-white text-black rounded"
        >
          Capture
        </button>
      </div>
    </div>
  );
};

export default PhotoCaptureWindow;
