import React, { useState, useEffect } from 'react';
import { Card, CardImage, CardBody, CardHeader, IconButton } from '@material-tailwind/react/';

import { Avatar } from '@material-tailwind/react/';
import Navbar from "../Common/Navbar";
import './profile.css';
import { Pencil } from 'lucide-react';
import EditInstitutionProfile from './EditInstitutionProfilePage';
import ViewProfile from './viewProfile';

const InstitutionProfile = () => {
    const [edit, setEdit] = useState(false);
    const [name, setName] = useState("IIT Ropar");
    const [email, setEmail] = useState("james.iitrpr.ac.in");
    const [address, setAddress] = useState("downing streert");
    const [about, setAbout] = useState(" Lorem ipsum, dolor sit amet consectetur adipisicing elit. Veritatis, quam accusamus omnis tempora, voluptates minus quis obcaecati blanditiis earum cumque sint fugiat alias voluptatibus qui numquam. Error dolores reiciendis eum possimus non odio repudiandae magnam dignissimos! Quae dicta tempore rem corporis incidunt molestias inventore, explicabo perferendis.");
    const [avatarImageUrl, setAvatarImageUrl] = useState('https://randomuser.me/api/portraits/men/1.jpg');
    const stored = { name, email, address, about, avatarImageUrl };
    function handleEditComplete(result) {
        if (result != null) {
            setName(result.name);
            setEmail(result.email);
            setAddress(result.address);
            setAbout(result.about);
            setAvatarImageUrl(result.avatarImageUrl);      
        }        
        console.log("handleEditComplete", result);
        setEdit(false);
    }
    return (
        <>
            <Navbar />
            {edit ? <EditInstitutionProfile
                stored={stored}
                editCompleteCallback={handleEditComplete}
            />
                :
                <ViewProfile
                    stored={stored}
                    startEditCallback={() => setEdit(true)}
                />}
        </>
       
    );
}

export default InstitutionProfile;