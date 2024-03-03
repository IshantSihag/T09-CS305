import { Card, CardImage, CardBody, CardHeader, IconButton } from '@material-tailwind/react/';
import { Avatar } from '@material-tailwind/react/';
import { Pencil } from 'lucide-react';
const ViewProfile = ({
    stored,
    startEditCallback
}) => {
    const unsplashImage='https://plus.unsplash.com/premium_photo-1707728599692-5b58748965d0?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
    return (

        <>
            <div className="min-h-screen bg-cover bg-center flex flex-col justify-center items-center">
                <div className="mb-4 h-40 w-11/12 relative bg-cover bg-center rounded-2xl" style={{ backgroundImage: `url('${unsplashImage}')` }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Avatar
                            src={stored.avatarImageUrl}
                            alt="Avatar"
                            size="xxl"
                            className="border-4 border-white"
                        />
                    </div>
                </div>

                <div>
                    <Card className="bg-white shadow-xl rounded-md  p-6 m-auto w-11/12">
                        <CardBody>
                            <div className="mb-4">
                                <div className="flex justify-center items-center mb-4">

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
                                <h6 className="text-gray-700 text-lg font-semibold">About</h6>
                                <p className="text-gray-600 mb-10">
                                    {stored.about}
                                </p>
                            </div>
                            <div className=' mb-5 mr-5 absolute bottom-0 right-0' >
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