import React, { useState, useRef, useCallback } from "react";
import { Button, Checkbox } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Common/Navbar";
import Footer from "../Common/Footer";
import PhotoCaptureWindow from "./PhotoCaptureWindow";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

const StartTest = () => {
  const navigate = useNavigate();
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [isCaptureWindowOpen, setCaptureWindowOpen] = useState(false);
  const videoRef = useRef(null); // Initialize with null

  const handle = useFullScreenHandle();
  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const handleStartTest = () => {
    const isDetailsFilled =
      // Check if all details are filled
      document.getElementById("studentName").value &&
      document.getElementById("dob").value &&
      document.getElementById("email").value &&
      document.getElementById("phone").value;

    if (!isDetailsFilled) {
      alert("Please fill in all details before starting the test.");
      return;
    }

    if (!photoCaptured) {
      alert("Please capture a photo before starting the test.");
      return;
    }

    if (!agreeTerms) {
      alert("Please agree to the terms and conditions to start the test.");
      return;
    }

    // Redirect to test page
    // Continue with test initiation or redirection logic
    alert("Test initiated successfully!");
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

  return (
    <div className="h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow p-10  flex  " handle={handle}>
        {/* User Information */}
        <div className="ml-20 p-20 mb--10 mr-20" >
          <div className="text-3xl font-bold mb-5">User Information</div>

{/* Student Information Form */}
<div className="mb-4 w-full max-w-md">
        <label
          htmlFor="studentName"
          className="block text-gray-700 font-bold mb-2 text-xl"
        >
          Student Name
        </label>
        <input
          id="studentName"
          type="text"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div className="mb-4 w-full max-w-md">
        <label
          htmlFor="dob"
          className="block text-gray-700 text-sm font-bold mb-2 text-xl"
        >
          Date of Birth
        </label>
        <input
          id="dob"
          type="date"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div className="mb-4 w-full max-w-md">
        <label
          htmlFor="email"
          className="block text-gray-700 text-sm font-bold mb-2 text-xl"
        >
          Email ID
        </label>
        <input
          id="email"
          type="email"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div className="mb-4 w-full max-w-md">
        <label
          htmlFor="phone"
          className="block text-gray-700 text-sm font-bold mb-2 text-xl"
        >
          Phone No
        </label>
        <input
          id="phone"
          type="tel"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      </div>

        {/* Camera Feed and Photo Capture */}
        <div className="flex p-20 flex-col items-center ">
          <div className="mb-4  items-center ">
            {!photoCaptured ? (
              <>
                <p className="text-2xl mb-2">
                  To start the test, we need to verify your identity. Please
                  capture a photo:
                </p>
                <Button
                  color="black"
                  onClick={openCaptureWindow}
                  className="text-1xl px-6 py-3 w-full max-w-md"
                  ripple="light"
                >
                  Capture Photo
                </Button>
              </>
            ) : (
              <>
                <p className="text-2xl mb-2">
                  Photo captured successfully. Would you like to recapture?
                </p>
                <Button
                  color="black"
                  onClick={recapturePhoto}
                  className="text-1xl   px-6 py-3 w-full max-w-md"
                  ripple="light"
                >
                  Recapture Photo
                </Button>
              </>
            )}
          </div>
          {/* Display Captured Photo */}
          {capturedPhoto && (
            <img
              src={capturedPhoto}
              alt="Captured Photo"
              className="rounded-lg mb-4 "
              style={{ maxWidth: "100%", maxHeight: "300px" }}
            />
          )}
          {/* Camera Feed */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full max-w-md"
          ></video>
        </div>
      </div>

      {isCaptureWindowOpen && (
        <PhotoCaptureWindow
          onCapture={capturePhoto}
          onClose={closeCaptureWindow}
        />
      )}
      {/* Terms and Conditions */}
      <div className="flex items-center justify-center flex-grow" >
        <div className="mb-4">
          <p className="text-xl mb-2">
            Please read and agree to the following terms and conditions before
            starting the test:
          </p>

          <ul className="text-lg list-disc pl-6">
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
          <div className="mb-2">
            <Checkbox
              color="lightBlue"
              checked={agreeTerms}
              onChange={handleCheckboxChange}
            />
            <label className="text-lg ml-2">
              I agree to the terms and conditions
            </label>
          </div>
        </div>
      </div>

      {/* Start Test and Back to Dashboard Buttons */}
      <div className="flex items-center justify-center">
        {/* Start Test Button */}
        <Button
          color="black"
          onClick={handleStartTest}
          className="text-lg mb-4 mr-20 px-6 py-3 w-full max-w-md"
          ripple="light"
        >
          Start Test
        </Button>

        {/* Back to Dashboard Button */}
        <Button
          color="black"
          onClick={handleBackToDashboard}
          className="text-lg mb-4 px-6 py-3 w-full max-w-md"
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