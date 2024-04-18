import React, { useEffect, useState } from 'react';
import {notifyError, notifySuccess} from "../UI/ToastNotification.jsx"; 

import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';
import "./Studentinfo.css";
import fetchAPI from '../Tools/FetchAPI'
const port = process.env.REACT_APP_API_URL


const Studentinfo = () => {
  const [instituteName, setInstituteName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [bioGraphy, setBioGraphy] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [resume, setResume] = useState(null);
  const [errors, setErrors] = useState({
    instituteName: '',
    mobileNumber: '',
    cgpa: '',
    resume: ''
  });
  useEffect(() => {
    const fetchData = async () => {
      let response = await fetchAPI(`${port}/student/fetchStudentDetails`, {}, 'GET', true)
      if (response.ok) {
        setMobileNumber(response.phone_number)
        setCgpa(response.cgpa)
        setBioGraphy(response.bio)

        console.log("Student data fetched successfully")
        notifySuccess("Student data fetched successfully")
      }
      else
      {
        // alert("Error in fetching data")
        console.log("Error in fetching data")
        notifyError("Error in fetching data")

      }
    }
    fetchData()
  }, [])
  const handleInstituteNameChange = (e) => {
    setInstituteName(e.target.value);
    setErrors({ ...errors, instituteName: '' });
  };

  const handleMobileNumberChange = (e) => {
    const value = e.target.value;
    setMobileNumber(value);

    if (!/^\d*$/.test(value)) {
      setErrors({ ...errors, mobileNumber: 'Mobile number should contain only digits' });
    } else {
      setErrors({ ...errors, mobileNumber: '' });
    }
  };

  const handleCgpaChange = (e) => {
    const value = e.target.value;
    setCgpa(value);

    if (!/^\d*\.?\d*$/.test(value)) {
      setErrors({ ...errors, cgpa: 'Invalid CGPA format' });
    } else if (parseFloat(value) < 0 || parseFloat(value) > 10) {
      setErrors({ ...errors, cgpa: 'CGPA must be between 0 and 10' });
    } else {
      setErrors({ ...errors, cgpa: '' });
    }
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type !== 'application/pdf') {
      setErrors({ ...errors, resume: 'Please upload a PDF file' });
    } else {
      setResume(file);
      setErrors({ ...errors, resume: '' });
    }
  };

  const handleBioChange = (e) => {
    setBioGraphy(e.target.value);
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!instituteName) {
      newErrors.instituteName = 'Please enter institute name';
    }
    if (!mobileNumber) {
      newErrors.mobileNumber = 'Please enter mobile number';
    } else if (!/^\d*$/.test(mobileNumber)) {
      newErrors.mobileNumber = 'Mobile number should contain only digits';
    }
    if (!cgpa) {
      newErrors.cgpa = 'Please enter CGPA';
    } else if (!/^\d*\.?\d*$/.test(cgpa)) {
      newErrors.cgpa = 'Invalid CGPA format';
    }
    if (!resume) {
      newErrors.resume = 'Please upload resume';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      if (errors.instituteName) {
        notifyError(errors.instituteName);
      } else if (errors.mobileNumber) {
        notifyError(errors.mobileNumber);
      } else if (errors.cgpa) {
        notifyError(errors.cgpa);
      } else if (errors.resume) {
        notifyError(errors.resume);
      }

      return;
    }

    console.log("Institute Name:", instituteName);
    console.log("Mobile Number:", mobileNumber);
    console.log("CGPA:", cgpa);
    console.log("Resume:", resume);
    const dataToSend = {
      phoneNumber: mobileNumber,
      cgpa: cgpa,
      batch: "Batch/joining year of the student",
      course: "Course of study of the student",
      bio: bioGraphy,
      profile_url: "URL to the user's profile picture"
    }
    let response = await fetchAPI(`${port}/student/updateStudentDetails`, { dataToSend }, "POST", true)
    if (response.ok) {
      // alert("Profile Updated successfully");
      console.log("Profile Updated successfully");
      notifySuccess("Profile Updated successfully");

      setInstituteName('');
      setMobileNumber('');
      setCgpa('');
      setResume(null);
      setErrors({
        instituteName: '',
        mobileNumber: '',
        cgpa: '',
        resume: ''
      });

    }
    else {
      // alert("Profile Updation failed");
      console.log("Profile Updation failed");
      notifyError("Profile Updation failed, Please try again");

    }
  };

  return (
    <div>
      <Navbar />
      <h1>Profile Page</h1>
      <h2>Enter Your Information</h2>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            {errors.instituteName && <p className="error">{errors.instituteName}</p>}
            <label htmlFor="instituteName"><span className='ast'>*</span> Institute Name:</label>
            <input
              type="text"
              id="instituteName"
              name="instituteName"
              value={instituteName}
              onChange={handleInstituteNameChange}
            />
          </div>
          <div className="form-group">
            {errors.mobileNumber && <p className="error">{errors.mobileNumber}</p>}
            <label htmlFor="mobileNumber"><span className='ast'>*</span> Mobile Number:</label>
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              value={mobileNumber}
              onChange={handleMobileNumberChange}
            />
          </div>
          <div className="form-group">
            {errors.cgpa && <p className="error">{errors.cgpa}</p>}
            <label htmlFor="cgpa"><span className='ast'>*</span> CGPA:</label>
            <input
              type="text"
              id="cgpa"
              name="cgpa"
              value={cgpa}
              onChange={handleCgpaChange}
            />
          </div>
          <div className="form-group">
            {errors.cgpa && <p className="error">{errors.cgpa}</p>}
            <label htmlFor="cgpa"><span className='ast'>*</span> Bio :</label>
            <input
              type="text"
              id="bio"
              name="bio"
              value={bioGraphy}
              onChange={handleBioChange}
            />
          </div>
          <div className="form-group">
            {errors.resume && <p className="error">{errors.resume}</p>}
            <label htmlFor="resume"><span className='ast'>*</span> Resume:</label>
            <input
              type="file"
              id="resume"
              name="resume"
              onChange={handleResumeChange}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Studentinfo;