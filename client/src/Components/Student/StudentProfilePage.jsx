import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Common/Navbar";
import Footer from "../Common/Footer";
import "@fortawesome/fontawesome-svg-core/styles.css"; // Import the styles
import "tailwindcss/tailwind.css"; // Import Tailwind CSS styles
import profileimage from "../../Assets/profile_image.jpg";
import Cookies from "js-cookie"; // Import Cookies


const StudentProfilePage = () => {
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState("");
  const [studentDetails, setStudentDetails] = useState({
    bio: "",
    cgpa: "",
    batch: "",
    course: "",
    phoneNumber: "",
    profileImage: "",
  });

  useEffect(() => {
    const accessToken = Cookies.get("access");
    const fetchStudentName = async () => {

      try {
        
        const res = await fetch(`http://127.0.0.1:8000/dashboard`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setStudentName(data.name);
        } else {
          console.error("Failed to fetch student name");
        }
      } catch (error) {
        console.error("Error fetching student name:", error);
      }
    };

    const fetchStudentProfile = async () => {
      try {
      
        const res = await fetch(`http://127.0.0.1:8000/student/fetchStudentDetails`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setStudentDetails({
            bio: data.bio,
            cgpa: data.cgpa,
            batch: data.batch,
            course: data.course,
            phoneNumber: data.phone_number,
            profileImage: data.profile_url,
          });
        } else {
          console.error("Failed to fetch student profile");
        }
      } catch (error) {
        console.error("Error fetching student profile:", error);
      }
    };

    fetchStudentName();
    fetchStudentProfile();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="flex  ">
        <div className="flex-1  items-center justify-center   flex-col p-12 pl-64">
          <h1 className="text-4xl font-bold text-[hsl(0,0%,8%)] lg:text-7xl mb-12">
            {studentName}
          </h1>
          <p className="text-base lg:text-lg my-2 text-[hsl(0,0%,41%)]  font-medium">
            Bio: {studentDetails.bio}
          </p>
          <p className="text-base lg:text-lg my-2 text-[hsl(0,0%,41%)] font-medium">
            CGPA: {studentDetails.cgpa}
          </p>
          <p className="text-base lg:text-lg my-2 text-[hsl(0,0%,41%)] font-medium">
            Batch: {studentDetails.batch}
          </p>
          <p className="text-base lg:text-lg my-2 text-[hsl(0,0%,41%)] font-medium">
            Course: {studentDetails.course}
          </p>
          <p className="text-base lg:text-lg my-2 text-[hsl(0,0%,41%)] font-medium">
            Phone Number: {studentDetails.phoneNumber}
          </p>
          <button className="bg-[hsl(0,0%,8%)] text-white py-3 px-6 rounded-xl mt-12" onClick = {() => navigate('/student')}>
            Back to Dashboard
          </button>
        </div>
        <div className="flex-1  p-12 pr-64">
          <img
            src={studentDetails.profileImage}
            alt=""
            className="rounded-full h-48 w-48 mx-auto lg:mx-0"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StudentProfilePage;
