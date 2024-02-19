import { Card, CardImage, CardBody, CardHeader, IconButton } from '@material-tailwind/react/';
import { Avatar } from '@material-tailwind/react/';
import { Pencil } from 'lucide-react';
const ViewProfile = ({
    stored,
    startEditCallback
}) => {
    return (

        <>
            <div className="min-h-screen bg-cover bg-center flex flex-col justify-center items-center">
                <div className="mb-4 w-5/6">


                    <Avatar
                        src={stored.avatarImageUrl}
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
                                            {stored.name}
                                        </p>
                                    </div>

                                    <div className="bg-gray-100 p-4 rounded-md">
                                        <h6 className="text-gray-700 text-lg font-semibold mb-2">Email</h6>
                                        <p className="text-gray-600">
                                            {stored.email}
                                        </p>
                                    </div>
                                    <div className="bg-gray-100 p-4 rounded-md">
                                        <h6 className="text-gray-700 text-lg font-semibold mb-2">Address</h6>
                                        <p className="text-gray-600">
                                            {stored.address}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-300 mt-4 pt-4">
                                <h6 className="text-gray-700 text-lg font-semibold mb-2">About</h6>
                                <p className="text-gray-600">
                                    {stored.about}
                                </p>
                            </div>
                            <div className=' m-2 absolute bottom-2 right-2' >
                            <button onClick={startEditCallback}>
                                <IconButton variant="filled" onclick={startEditCallback} >
                                    <Pencil className='h-4 w-4' />
                                </IconButton>
                            </button>   
                            </div>
                        </CardBody>
                    </Card>
                </div>

            </div>
        </>
    );
}

export default ViewProfile;