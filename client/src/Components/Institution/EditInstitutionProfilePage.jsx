

import React, { useState } from 'react';

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
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Edit Information</h2>

            <form>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600">Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="mt-1 p-2 border rounded-md w-full"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600">Email:</label>
                    <input
                        type="text"
                        name="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="mt-1 p-2 border rounded-md w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600">Address:</label>
                    <input
                        type="text"
                        name="Address"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        className="mt-1 p-2 border rounded-md w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600">About:</label>
                    <input
                        type="textarea"
                        name="About"
                        value={about}
                        onChange={e => setAbout(e.target.value)}
                        className="mt-1 p-2 border rounded-md w-full"
                    />
                </div>

                

                <div className="mt-4">
                    <button
                        type="button"
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
                    >
                        Save
                    </button>
                </div>
                <div className="mt-4">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditInstitutionProfile;
