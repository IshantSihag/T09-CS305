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
  })

  useEffect(() => {
    let access = Cookies.get('access')
    if (!access) {
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
          alert("User not authorized, Please Login");
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
            const logMsg = "Test Details fetched successfully";
            console.log(logMsg);

            setTestData({
              title: data.title,
              duration: data.duration,
              marks: data.marks,
              questions: data.questions,
              date: data.date,
              time: data.time,
            });

          } else {
            console.log(`Error in fetching test details: ${data.error}`);
          }
        } else {
          //CHECK: for unauthorized request, user redirected to login
          if (res.status === 401) {
            console.log("Unauthorized : Please login");
            alert("Unauthorized : Please login");
            navigate('/student/login');

            return;
          }
          console.log(`Error in fetching test details`);
        }
      } catch (err) {
        console.log(`Error in fetching test details : ${err.message}`);
        alert('Error in fetching test details');
      }
    };

    fetchTestDetails();
  }, []);




  const testTitle = "UI/UX Review Check"
  const testDescription = "Lorem ipsum Not far stuff she think the jokes. Going as by do known noise he wrote round leave. Warmly put branch people narrow see. Winding its waiting yet parlors married own feeling. Marry fruit do spite jokes an times. Whether at it unknown warrant herself winding if. Him same none name sake had post love. An busy feel form hand am up help. Parties it brother amongst an fortune of. Twenty behind wicket why age now itself ten. In it except to so temper mutual tastes mother. Interested cultivated its continuing now yet are. Out interested acceptance our partiality affronting unpleasant why add. Esteem garden men yet shy course. Consulted up my tolerably sometimes perpetual oh. Expression acceptance imprudence particular had eat unsatiable.  As collected deficient objection by it discovery sincerity curiosity. Quiet decay who round three world whole has mrs man. Built the china there tried jokes which gay why. Assure in adieus wicket it is. But spoke round point and one joy. Offending her moonlight men sweetness see unwilling. Often of it tears whole oh balls share an."
  const testDuration = "60"
  const testMarks = "100"
  const testQuestions = "10"
  const testDate = "2021-09-01"
  const testStartTime = "09:00 am"
  const testInstructions = "1. Log in to your account to access the test.\n2. Read all instructions carefully before beginning the test.\n3. Ensure you have a stable internet connection throughout the test.\n4. You will be proctored during the test to maintain integrity.\n5. Manage your time wisely and answer each question to the best of your ability.\n6. Submit the test before the designated time limit expires."

  

  const handleRegister = async () => {
    let access = Cookies.get('access');
    if (!access) {
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
        navigate('/student');
      }
    } catch (err) {
      console.log("Failed to register for test. error:", err);
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
              {testDescription}
            </Typography>
          </CardHeader>
          <CardBody className='flex-row flex-1 flex gap-x-2'>
            <div className='flex h-fit'>
              <div className='w-1/2 pr-2 border-r-2'>
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  Test Instruction
                </Typography>
                <Typography className='text-justify'>
                  {testInstructions}
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