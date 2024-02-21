import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Common/Navbar";
import Footer from "../Common/Footer";

const StudentProfilePage = () => {
  const [userData, setUserData] = useState({
    username: "",
    testsTaken: ["Test 1", "Test 2", "Test 3"],
  });

  useEffect(() => {
    // Simulating a delay to mimic a network request
    const delay = setTimeout(() => {
      // Dummy data for testing
      const dummyData = {
        username: "John Doe",
        testsTaken: ["Test 1", "Test 2", "Test 3"],
      };
      console.log("Dummy Data:", dummyData);
      setUserData(dummyData);
    }, 1000);

    // Cleanup function to clear the timeout in case the component unmounts
    return () => clearTimeout(delay);
  }, []); // Empty dependency array ensures useEffect runs only once on component mount

  return (
    <div>
      <Navbar />
      <div className="font-epilogue bg-[hsl(0,0%,98%)]">
        <div className="lg:flex lg:mx-44 lg:gap-4 lg:mt-10">
          <div className="px-5 mt-8 mb-48 lg:pt-20 lg:pr-32">
            <div className="flex flex-col items-center lg:items-start">
              <h1 className="text-4xl font-bold text-[hsl(0,0%,8%)] lg:text-7xl">
                {userData.username}'s Profile
              </h1>
              <p className="text-center lg:text-start lg:pr-11 lg:my-10 text-base lg:text-lg my-6 text-[hsl(0,0%,41%)] font-medium">
                Tests Taken:
              </p>
              <ul className="list-disc pl-6">
                {userData.testsTaken.map((test, index) => (
                  <li key={index} className="text-base font-medium">
                    {/* Link for each test */}
                    <Link to={`/test/${index + 1}`}>{test}</Link>
                  </li>
                ))}
              </ul>
              <div className="flex space-x-4 mt-6">
                <button className="bg-[hsl(0,0%,8%)] text-white hover:bg-transparent hover:border hover:text-[hsl(0,0%,8%)] hover:border-[hsl(0,0%,8%)] py-3 px-6 rounded-xl">
                  Edit Profile
                </button>
                <button className="bg-[hsl(0,0%,8%)] text-white hover:bg-transparent hover:border hover:text-[hsl(0,0%,8%)] hover:border-[hsl(0,0%,8%)] py-3 px-6 rounded-xl">
                  Manage Tests
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StudentProfilePage;
