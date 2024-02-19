import React from 'react';
import { Card, CardImage, CardBody, CardHeader, IconButton } from '@material-tailwind/react/';



import { Avatar } from '@material-tailwind/react/';
import Navbar from "../Common/Navbar";
import './profile.css';
let name_of_institution = "IIT Ropar";
let emai = "james.iitrpr.ac.in";
let backgroundImageUrl = 'https://source.unsplash.com/random';
let avatarImageUrl = 'https://randomuser.me/api/portraits/men/1.jpg';
const InstitutionProfile = () => {
    return (

        <div className="min-h-screen bg-cover bg-center flex flex-col justify-center items-center">
            <div className="mb-4">

                {/* <img src={backgroundImageUrl} className= 'object-cover h-40 w-5/6'></img> */}
                <Avatar
                    src={avatarImageUrl}
                    alt="Avatar"
                    size="xxl"
                    className="border-4 border-white"
                />


            </div>

            <div>
                <Card className="bg-white shadow-lg rounded-md p-6 m-auto">
                    <CardBody>
                        <div className="mb-4">
                            <div className="flex justify-center items-center mb-4">
                                {/* You can add additional content or styling here */}
                            </div>
                            <h5 className="text-gray-800 text-2xl font-bold mb-4">Institution Details</h5>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-gray-100 p-4 rounded-md">
                                    <h6 className="text-gray-700 text-lg font-semibold mb-2">Name</h6>
                                    <p className="text-gray-600">
                                        Indian Institute Of Technology Ropar
                                    </p>
                                </div>

                                <div className="bg-gray-100 p-4 rounded-md">
                                    <h6 className="text-gray-700 text-lg font-semibold mb-2">Email</h6>
                                    <p className="text-gray-600">
                                        example@example.com
                                    </p>
                                </div>
                                <div className="bg-gray-100 p-4 rounded-md">
                                    <h6 className="text-gray-700 text-lg font-semibold mb-2">Address</h6>
                                    <p className="text-gray-600">
                                        123 Institution Street, City
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-300 mt-4 pt-4">
                            <h6 className="text-gray-700 text-lg font-semibold mb-2">About</h6>
                            <p className="text-gray-600">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec urna euismod, tincidunt velit sit amet, commodo leo.
                                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatibus quaerat rem molestias officiis omnis, beatae ullam delectus. Consectetur delectus error saepe provident est ullam quae cupiditate ut voluptatum quas rerum, illo aperiam perferendis quos!
                            </p>
                        </div>
                        <div className=' m-2 absolute bottom-2 right-2' >
                            <IconButton variant="filled">
                                <i className="fas fa-heart text-base" />
                            </IconButton>
                        </div>
                    </CardBody>
                </Card>
            </div>
            
        </div>
    );
}

export default InstitutionProfile;