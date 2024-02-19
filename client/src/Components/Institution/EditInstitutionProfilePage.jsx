

import React, { useState } from 'react';

const EditInstitutionProfile = ({ selectedItem, onSave }) => {
  const [editedInfo, setEditedInfo] = useState({
    // Initialize with the selected item's information
    // This assumes your selectedItem is an object with properties like 'name', 'description', etc.
    ...selectedItem,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Pass the edited information to the onSave callback
    onSave(editedInfo);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Information</h2>

      <form>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Name:</label>
          <input
            type="text"
            name="name"
            value={editedInfo.name}
            onChange={handleInputChange}
            className="mt-1 p-2 border rounded-md w-full"
          />
        </div>

        {/* Add similar input fields for other properties */}

        <div className="mt-4">
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditInstitutionProfile;
