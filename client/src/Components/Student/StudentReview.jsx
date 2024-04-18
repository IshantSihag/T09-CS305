import React, { useState } from 'react';
import Footer from '../Common/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faAsterisk } from '@fortawesome/free-solid-svg-icons';
import "./StudentReview.css";
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { notifyError, notifySuccess } from '../UI/ToastNotification';


const StudentReview = () => {
  const navigate = useNavigate();

  const {id:testId} = useParams();

  const [rating, setRating] = useState(0);
  const [improvements, setImprovements] = useState('');
  const [error, setError] = useState('');

  const handleRatingChange = (value) => {
    setRating(value);
    setError(''); 
  };

  const handleImprovementsChange = (e) => {
    setImprovements(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("feedback submitted");

    if (rating === 0) {
      notifyError("Please fill all the fields");
      setError('Please fill this field');
      return;
    }

    try {
      const access = Cookies.get('access');

      if (!access) {
        console.log("User not logged in, Please login");
        //alert("User not logged in, Please login");
        notifyError("User not logged in, Please login");

        navigate("/student/login");
      }

      const sendFormData = new FormData();
      sendFormData.append('test_id', testId);
      sendFormData.append('rating', rating);
      sendFormData.append('suggestion', improvements);

      const response = await fetch('http://localhost:8000/submitTestRating/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${access}`
        },
        body: sendFormData
      });

      console.log("RESPONSE (submit-review): ", response)

      const data = await response.json();

      if (response.ok) {

        if (data.ok) {
          console.log(data.message);
          notifySuccess(data.message || "Feedback submitted successfully");


          // Reset form fields
          setRating(0);
          setImprovements('');

          //navigating to the student dashbaord
          navigate('/student');
        } else {
          console.log(`Error (submit-feedback): ${data.error}`);
          setError('Failed to submit rating. Please try again.');
          notifyError('Failed to submit rating. Please try again.');
        }
      } else {
        setError(data.error); 
        notifyError(data.error || "Error in submitting feedback, Please try again"); 

      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to submit rating. Please try again.');
      notifyError('Failed to submit rating. Please try again.');

    }
  };

  return (
    <div>
      <h1>Test Name</h1>
      <p className="ins">Institute Name</p>
      <div className="form_">
        <h2>Test Submitted Successfully</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          {/*{error && <p className="error">{error}</p>}*/} 
          <label htmlFor="rating">
            <span style={{ color: '#FF6666', fontSize: '10px', verticalAlign: 'super'}}><FontAwesomeIcon icon={faAsterisk} /></span>
            How was your overall experience? {' '}
            <span>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </span>
            {[...Array(5)].map((_, index) => (
              <FontAwesomeIcon 
                key={index}
                icon={faStar}
                className={index < rating ? 'star-filled star-icon' : 'star-empty star-icon'}
                onClick={() => handleRatingChange(index + 1)}
                size='lg' 
              />
            ))}
          </label>
        </div>
        
        <div className="form-group">
          <label htmlFor="improvements">Any suggestion or improvement?</label>
          <textarea
            id="improvements"
            name="improvements"
            value={improvements}
            onChange={handleImprovementsChange}
          />
        </div>
        <button type="submit" onClick={(e) => handleSubmit(e)}>Submit</button>
      </form>
      <Footer />
    </div>
  );
};

export default StudentReview;
