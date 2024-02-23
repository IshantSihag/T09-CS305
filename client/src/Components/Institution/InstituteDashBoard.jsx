// import React from "react";
// import { Button } from "@material-tailwind/react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../Common/Navbar";
// import Footer from "../Common/Footer";

// const InstituteDashboard = () => {
//   const navigate = useNavigate();

//   // Function to handle logout
//   const handleLogout = () => {
//     // Perform logout logic here
//     // For example, redirect to the login page
//     navigate("/login");
//   };

//   // Function to handle profile click
//   const handleProfile = () => {
//     // Redirect to the profile page
//     // Adjust the route as needed
//     navigate("/profile");
//   };

//   // Function to handle create test click
//   const handleCreateTest = () => {
//     // Redirect to the create test page
//     // Adjust the route as needed
//     navigate("/create-test");
//   };

//   // Function to handle view all tests click
//   const handleViewAllTests = () => {
//     // Redirect to the view all tests page
//     // Adjust the route as needed
//     navigate("/all-tests");
//   };

  return (
    <div className="h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow p-4 flex flex-col items-center">
        <div className="text-2xl font-bold mb-4">Institute Dashboard</div>

        <Button
          color="black"
          onClick={handleProfile}
          className="mb-4 px-6 py-3 w-full max-w-md"
          ripple="light"
        >
          Profile
        </Button>

        <Button
          color="black"
          onClick={handleCreateTest}
          className="mb-4 px-6 py-3 w-full max-w-md"
          ripple="light"
        >
          Create Test
        </Button>

        <Button
          color="black"
          onClick={handleViewAllTests}
          className="mb-4 px-6 py-3 w-full max-w-md"
          ripple="light"
        >
          All Tests
        </Button>

        <Button
          color="black"
          onClick={handleLogout}
          className="mb-4 px-6 py-3 w-full max-w-md"
          ripple="light"
        >
          Logout
        </Button>
      </div>

      <Footer />
    </div>
  );
};
export default InstituteDashboard;
