import React, { useEffect, useState } from 'react';
import { notifyError, notifySuccess } from "../UI/ToastNotification.jsx";
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';
import "./Studentinfo.css";
import Cookies from "js-cookie"; // Import Cookies
import fetchAPI from '../Tools/FetchAPI';
import { useNavigate } from 'react-router-dom';

const port = process.env.REACT_APP_API_URL;

const Studentinfo = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [course, setCourse] = useState('');
  const [batch, setBatch] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profileUrl, setProfieUrl] = useState('');
  const [errors, setErrors] = useState({});


  const fetchData = async () => {
    try {

      const accessToken = Cookies.get("access");

      if (!accessToken) {
        console.log("Access token not found, User not authorized");
        notifyError("User not authorized, Please Login again");
        navigate("/student/login");
        return;
      }

      let res = await fetch(`http://127.0.0.1:8000/dashboard`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if(res.ok)
      {
        const data = await res.json();
        console.log(data);
        setName(data.name);
      }

      
       res = await fetch(`http://127.0.0.1:8000/student/fetchStudentDetails`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        const { bio, course, batch, cgpa, phone_number,profile_url } = res;
      
        setBio(bio);
        setCourse(course);
        setBatch(batch);
        setCgpa(cgpa);
        setPhoneNumber(phone_number);
        setProfieUrl(profile_url);
        notifySuccess("Student data fetched successfully");
      } else {
        notifyError("Error in fetching data");
      }
    } catch (error) {
      notifyError("Error in fetching data");
    }
  };


  useEffect(() => {
   
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = Cookies.get("access");
    const formData = new FormData();
  
    formData.append("bio", bio);
    formData.append("course", course);
    formData.append("batch", batch);
    formData.append("cgpa", cgpa);
    formData.append("phone_number", phoneNumber);
    formData.append("profile_url", profileUrl);
    
    try {
      
    
    
      let res = await fetch(
        `http://127.0.0.1:8000/student/updateStudentDetails`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
  
          body: formData,
        }
      );
  
      if (res.ok) {
        notifySuccess("Profile Updated successfully");
         
        await fetchData();

      } else {
        notifyError("Profile Updation failed, Please try again");
      }
    } catch (error) {
      notifyError("Profile Updation failed, Please try again");
    }
  };

  return (
    <div>
      <Navbar />
      <h1>Profile</h1>
    
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor="bio">Bio:</label>
            <textarea
              id="bio"
              name="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="course">Course:</label>
            <input
              type="text"
              id="course"
              name="course"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="batch">Batch:</label>
            <input
              type="text"
              id="batch"
              name="batch"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="cgpa">CGPA:</label>
            <input
              type="text"
              id="cgpa"
              name="cgpa"
              value={cgpa}
              onChange={(e) => setCgpa(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number:</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <button type="submit">Update Details</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Studentinfo;
