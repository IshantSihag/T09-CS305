import React, { useState } from 'react';
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';
import "./Studentinfo.css";

const Studentinfo = () => {
  const [instituteName, setInstituteName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [resume, setResume] = useState(null);
  const [errors, setErrors] = useState({
    instituteName: '',
    mobileNumber: '',
    cgpa: '',
    resume: ''
  });

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

  const handleSubmit = (e) => {
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
      return;
    }

    console.log("Institute Name:", instituteName);
    console.log("Mobile Number:", mobileNumber);
    console.log("CGPA:", cgpa);
    console.log("Resume:", resume);


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
