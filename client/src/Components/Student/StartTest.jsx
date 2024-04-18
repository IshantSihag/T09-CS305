import React, { useState, useRef, useCallback } from "react";
import { Button, Checkbox } from "@material-tailwind/react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Common/Navbar";
import Footer from "../Common/Footer";
import PhotoCaptureWindow from "./PhotoCaptureWindow";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import Cookies from "js-cookie";

import {notifyError, notifySuccess} from "../UI/ToastNotification.jsx";

const StartTest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [isCaptureWindowOpen, setCaptureWindowOpen] = useState(false);
  const videoRef = useRef(null); // Initialize with null

  const handle = useFullScreenHandle();
  const handleBackToDashboard = () => {
    navigate("/student/");
  };

  const handleFullscreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen().catch((err) => {
        console.error("Fullscreen request failed:", err);
      });
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen().catch((err) => {
        console.error("Fullscreen request failed:", err);
      });
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen().catch((err) => {
        console.error("Fullscreen request failed:", err);
      });
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen().catch((err) => {
        console.error("Fullscreen request failed:", err);
      });
    }
  };

  const handleStartTest = async () => {
      const isDetailsFilled = document.getElementById("studentName").value &&
      document.getElementById("dob").value &&
      document.getElementById("email").value &&
      document.getElementById("phone").value;

    if (!isDetailsFilled) {
      alert("Please fill in all details before starting the test.");
      return;
    }
    if (!photoCaptured) {
      // alert("Please capture a photo before starting the test.");
      notifyError("Please capture a photo before starting the test.");
      return;
    }

    if (!agreeTerms) {
      // alert("Please agree to the terms and conditions to start the test.");
      notifyError("Please agree to the terms and conditions to start the test.");
      return;
    }

    // Redirect to test page
    // Continue with test initiation or redirection logic
    // alert("Test initiated successfully!");
    notifySuccess("Test initiated successfully!");

    let result = await sendPhotoToBackend(capturedPhoto);
    if (result === 0) {
      return;
    } else {
      navigate(`/student/attemptest/${id}`);
    }
    // Redirect to test page
    handleFullscreen();
    navigate(`/student/attemptest/${id}`);
  };

  const handleCheckboxChange = () => {
    setAgreeTerms(!agreeTerms);
  };

  const openCaptureWindow = () => {
    setCaptureWindowOpen(true);
  };

  const closeCaptureWindow = () => {
    setCaptureWindowOpen(false);
  };

  const capturePhoto = (photoDataURL) => {
    setCapturedPhoto(photoDataURL);
    setPhotoCaptured(true);
  };

  const recapturePhoto = () => {
    setPhotoCaptured(false);
    setCapturedPhoto(null);
    openCaptureWindow();
  };


  const sendPhotoToBackend = async (photoDataURL) => {
    const formData = new FormData();
    formData.append("user_image_base64", photoDataURL);

    const accessToken = Cookies.get("access");

    if (!accessToken) {
      console.log("Access token not found, User not authorized");
      notifyError("User not authorized, Please login again");
      navigate("/student/");
      return 0;
    }

    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/submitInitialImage/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },

        body: formData,
      }
    );

    if (res.ok) {
      // const data = await res.json();
      // console.log(data);
      console.log("Photo sent to backend successfully");
      notifySuccess("Photo sent to backend successfully");
      return 1;
    } else {
      console.error("Failed to send photo to backend");
      notifyError("Failed to send photo to backend");
      return 0;
    }
  };

  return (
    <div className="flex flex-col">
      <Navbar />
      <div className=" flex-1 flex mt-10 mb-12">
        <div className="flex-1 p-28  items-center justify-center "> 
          
            {!photoCaptured ? (
              <>
                <p className="text-xl mb-2">
                  To start the test, we need to verify your identity. Please
                  capture a photo:
                </p>
                <Button
                  color="black"
                  onClick={openCaptureWindow}
                  className="text-2lg px-6 py-3 w-full max-w-md"
                  ripple="light"
                >
                  Capture Photo
                </Button>
              </>
            ) : (
              <>
                <p className="text-xl mb-2">
                  Photo captured successfully. Would you like to recapture?
                </p>
                <Button
                  color="black"
                  onClick={recapturePhoto}
                  className="text-2lg   px-6 py-3 w-full max-w-md"
                  ripple="light"
                >
                  Recapture Photo
                </Button>
              </>
            )}
          
        
        </div>
        <div className="flex-1 p-8 ">
          
          {capturedPhoto && (
            <img
              src={capturedPhoto}
              alt="Captured Photo"
              className="rounded-lg "
              style={{ maxWidth: "100%", maxHeight: "300px" }}
            />
          )}
         
        {/* Camera Feed
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          
        ></video> */}
        </div>

      </div>

      {isCaptureWindowOpen && (
        <PhotoCaptureWindow
          onCapture={capturePhoto}
          onClose={closeCaptureWindow}
        />
      )}

      {/* Terms and Conditions */}
      <div className="flex-1 p-20 pt-0 items-center justify-center ">
        <div className="mb-4">
          <p className="text-xl mb-2">
            Please read and agree to the following terms and conditions before
            starting the test:
          </p>

          <ul className="text-l list-disc pl-6">
            <li>
              I will not engage in any form of cheating, including but not
              limited to using unauthorized materials, notes, or external
              assistance during the test.
            </li>
            <li>
              I will not use any external software or tools to manipulate or
              alter the test environment, including attempting to switch tabs or
              navigate away from the test page.
            </li>
            <li>
              I understand that any attempt to deceive or manipulate the test
              process will result in disqualification and potential consequences
              as outlined by the institution or organization conducting the
              test.
            </li>
            {/* Add more terms and conditions as needed */}
          </ul>

          <div className="flex items-center">
            <Checkbox
              color="lightBlue"
              checked={agreeTerms}
              onChange={handleCheckboxChange}
              className="m--2 p-2 "
            />
            <label className="text-lg ">
              I agree to the terms and conditions
            </label>
          </div>
        </div>
      </div>

      {/* Start Test and Back to Dashboard Buttons */}
      <div className="flex-1 items-center justify-center">
        {/* Start Test Button */}
        <Button
          color="black"
          onClick={handleStartTest}
          className="text-1lg mb-4 mr-20 ml-64 px-6 py-3 w-full max-w-md"
          ripple="light"
        >
          Start Test
        </Button>

        {/* Back to Dashboard Button */}
        <Button
          color="black"
          onClick={handleBackToDashboard}
          className="text-1lg mb-4 px-6 py-3 w-full max-w-md"
          ripple="light"
        >
          Back to Dashboard
        </Button>
      </div>

      <Footer />
    </div>
  );
};

export default StartTest;
