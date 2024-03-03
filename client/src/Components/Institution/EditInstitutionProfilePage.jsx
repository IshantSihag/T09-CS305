

import React, { useState } from 'react';
import { Button,Input,Textarea } from '@material-tailwind/react/';

const EditInstitutionProfile = ({ stored, editCompleteCallback }) => {

    const [name, setName] = useState(stored.name);
    const [email, setEmail] = useState(stored.email);
    const [address, setAddress] = useState(stored.address);
    const [about, setAbout] = useState(stored.about);
    const [avatarImageUrl, setAvatarImageUrl] = useState(stored.avatarImageUrl);

    

    function handleCancel() {
        editCompleteCallback(null);
    }

    function handleSave() {
        console.log("Saved");
        editCompleteCallback({ name, email, address, about, avatarImageUrl });
    }

    return (
        <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-4">Edit Information</h2>
  
        <form>
          <div className="mb-4">
            <label className="text-sm font-semibold text-gray-600 mb-1">Name:</label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              color="blue"
              size="lg"
              placeholder="Enter your name"
            />
          </div>
  
          <div className="mb-4">
            <label className="text-sm font-semibold text-gray-600 mb-1">Email:</label>
            <Input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              color="blue"
              size="lg"
              placeholder="Enter your email"
            />
          </div>
  
          <div className="mb-4">
            <label className="text-sm font-semibold text-gray-600 mb-1">Address:</label>
            <Input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              color="blue"
              size="lg"
              placeholder="Enter your address"
            />
          </div>
  
          <div className="mb-4">
            <label className="text-sm font-semibold text-gray-600 mb-1">About:</label>
            <Textarea
              type="textarea"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              color="blue"
              size="lg"
              placeholder="Tell us about yourself"
              rows={4}
            />
          </div>
  
          <div className="flex justify-between">
            <Button
              color="blue"
              onClick={handleSave}
              ripple="light"
              className="focus:outline-none focus:ring focus:border-blue-300"
            >
              Save
            </Button>
            <Button
              color="gray"
              onClick={handleCancel}
              ripple="light"
              className="focus:outline-none focus:ring focus:border-gray-300"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    );
};

export default EditInstitutionProfile;
