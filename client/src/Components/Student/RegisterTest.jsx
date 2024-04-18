import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';
import { useNavigate, useParams } from 'react-router-dom';
import secondsToHMS from '../../Utils/secondsToHMS';
import {notifySuccess, notifyError} from "../UI/ToastNotification.jsx";

function RegisterTest() {
  const navigate = useNavigate();

  const { id } = useParams();
  const [testData, setTestData] = useState({
    title: "",
    duration: "",
    marks: "",
    questions: "",
    date: "",
    time: "",
    description: "",
    instructions: "",
  })

  useEffect(() => {
    let access = Cookies.get('access')
    if (!access) {
      console.log("User not authorized, Please Login");
      notifyError("User not authorized, Please Login");
      navigate('/student/login');
    }
  })

  // useEffect(() => {
  //   let access = Cookies.get('access')
  //   if (!access) {
  //     navigate('/student/login');
  //   }
  //   // fetchData();
  // }, [])

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        //accessing access token from cookies 
        const accessToken = Cookies.get('access');

        if (!accessToken) {
          console.log("Access token not found, User not authorized");
          // alert("User not authorized, Please Login");
          notifyError("User not authorized, Please Login");
          navigate('/student/login');

          return;
        }

        const formData = new FormData();
        formData.append('test_id', id);

        const res = await fetch(`http://127.0.0.1:8000/getTestDetails/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          },
          body: formData
        })

        if (res.ok) {
          const data = await res.json();

          if (data.ok) {
            console.log("data: ", data);
            const logMsg = "Test Details fetched successfully";
            console.log(logMsg);
            notifySuccess(logMsg);

            setTestData({
              title: data.title,
              duration: data.duration,
              marks: data.marks,
              questions: data.questions,
              date: data.date,
              time: data.time,
              description: data.description,
              instructions: data.instructions
            });

          } else {
            console.log(`Error in fetching test details: ${data.error}`);
            notifyError(`Error in fetching test details: ${data.error}`);
          }
        } else {
          //CHECK: for unauthorized request, user redirected to login
          if (res.status === 401) {
            console.log("Unauthorized : Please login");
            // alert("Unauthorized : Please login");
            notifyError("Unauthorized : Please login");
            navigate('/student/login');

            return;
          }
          console.log(`Error in fetching test details`);
          notifyError("Error in fetching test details");
        }
      } catch (err) {
        console.log(`Error in fetching test details : ${err.message}`);
        // alert('Error in fetching test details');
        notifyError('Error in fetching test details');
      }
    };

    fetchTestDetails();
  }, []);

  const handleRegister = async () => {
    let access = Cookies.get('access');
    if (!access) {
      console.log("User not authorized, Please Login");
      notifyError("User not authorized, Please Login");
      navigate('/student/login');
    }
    const sendData = new FormData();
    sendData.append('test_id', id);
    console.log(id);
    try {
      const response = await fetch('http://localhost:8000/student/registerForTest/', {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${access}`
        },
        body: sendData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);

        if (data.ok) {
          notifySuccess("User registered successfully");
          console.log("User registered successfully");
          navigate('/student');
        } else {
          console.log("Error while registering");
          notifyError("Error while registering");
        }
      }
    } catch (err) {
      console.log("Failed to register for test. error:", err);
      notifyError("Failed to register for test");
    }
  }

  return (
    <div>
      <Navbar />
      <div className='flex p-3 gap-x-2 items-center bg-gray-50'>
        <Card className="h-svh w-screen">
          <CardHeader floated={false} shadow={false} >
            <Typography variant="h4" color="blue-gray" className="mb-2">
              {testData.title}
            </Typography>
            <Typography className='text-justify'>
              {testData.description}
            </Typography>
          </CardHeader>
          <CardBody className='flex-row w-full flex-1 flex gap-x-2'>
            <div className='flex w-full h-fit'>
              <div className='w-1/2 pr-2 border-r-2'>
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  Test Instruction
                </Typography>
                <Typography className='text-justify'>
                  {testData.instructions}
                </Typography>
              </div>
              <div className=' w-1/2 h-full grid grid-cols-2 place-content-evenly place-items-center gap-y-4'>
                <div className=' w-5/6 p-2 h-fit bg-gray-100 rounded-[30px]'>
                  <Typography variant="h6" color="blue-gray" className="text-center">
                    Test Duration
                  </Typography>
                  <Typography className='text-center'>
                    {secondsToHMS(testData.duration)} 
                  </Typography>
                </div>
                <div className=' w-5/6 p-2 h-fit bg-gray-100 rounded-[30px]'>
                  <Typography variant="h6" color="blue-gray" className="text-center">
                    Test Date
                  </Typography>
                  <Typography className='text-center'>
                    {testData.date}
                  </Typography>
                </div>
                <div className=' w-5/6 p-2 h-fit bg-gray-100 rounded-[30px]'>
                  <Typography variant="h6" color="blue-gray" className="text-center">
                    Test Start time
                  </Typography>
                  <Typography className='text-center'>
                    {testData.time}
                  </Typography>
                </div>
                <div className=' w-5/6 p-2 h-fit bg-gray-100 rounded-[30px]'>
                  <Typography variant="h6" color="blue-gray" className="text-center">
                    Test Marks
                  </Typography>
                  <Typography className='text-center'>
                    {testData.marks}
                  </Typography>
                </div>
                <div className=' w-5/6 p-2 h-fit bg-gray-100 rounded-[30px]'>
                  <Typography variant="h6" color="blue-gray" className="text-center">
                    Test Questions
                  </Typography>
                  <Typography className='text-center'>
                    {testData.questions}
                  </Typography>
                </div>
              </div>
            </div>
          </CardBody>
          <CardFooter className="pt-0 flex justify-center">
            <Button
              className='w-1/2 rounded-2xl'
              onClick={() => {
                window.location.href = '/student';
                handleRegister();
              }}
            >
              Register
            </Button>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </div>
  )
}

export default RegisterTest