import React from "react";
import { Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Common/Navbar";
import Footer from "../Common/Footer";

const StudentDashboard = () => {
  const navigate = useNavigate();

  // Function to handle logout
  const handleLogout = () => {
    // Perform logout logic here
    // For example, redirect to the login page
    navigate("/login");
  };

  // Function to handle profile click
  const handleProfile = () => {
    // Redirect to the profile page
    // Adjust the route as needed
    navigate("/profile");
  };

  // Function to handle attempt test click
  const handleAttemptTest = () => {
    // Redirect to the test page
    // Adjust the route as needed
    navigate("/attempt-test");
  };

  return (
    <div>
      <Navbar />

      <div className="p-4">
        <div className="text-2xl font-bold mb-4">Student Dashboard</div>

        <Button
          color="black"
          onClick={handleProfile}
          className="mb-4 px-6 py-3 mx-5"
          ripple="light"
        >
          Profile
        </Button>

        <Button
          color="black"
          onClick={handleAttemptTest}
          className="mb-4 px-6 py-3 mx-5  "
          ripple="light"
        >
          Attempt Test
        </Button>

        <Button
          color="black"
          onClick={handleLogout}
          className="mb-4 px-6 py-3 mx-5  "
          ripple="light"
        >
          Logout
        </Button>
      </div>

      <Footer />
    </div>
  );
};

export default StudentDashboard;
