import React, { useState } from 'react';
import Footer from '../Common/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faAsterisk } from '@fortawesome/free-solid-svg-icons';
import "./StudentReview.css";

const StudentReview = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (rating === 0) {
      setError('Please fill this field');
      return;
    }

    // Handle form submission here
    console.log("Rating:", rating);
    console.log("Improvements:", improvements);
    
    // Reset form fields
    setRating(0);
    setImprovements('');
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
        {error && <p className="error">{error}</p>} 
          <label htmlFor="rating" >
          <span style={{ color: '#FF6666', fontSize: '10px', verticalAlign: 'super'}}><FontAwesomeIcon icon={faAsterisk} / ></span>
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
        <button type="submit">Submit</button>
      </form>
      <Footer />
    </div>
  );
};

export default StudentReview;
