import React from 'react';
import './DisplayJSON.css'; // Import the CSS file

const DisplayJSON = ({ jsonObject }) => {
  const renderJSON = (obj) => {
    return (
      <ul>
        {Object.entries(obj).map(([key, value]) => (
          <li key={key}>
            <strong>{key}:</strong>
            {typeof value === 'object' ? renderJSON(value) : value}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="display-json"> {/* Apply the className here */}
      {renderJSON(jsonObject)}
    </div>
  );
};

export default DisplayJSON;
