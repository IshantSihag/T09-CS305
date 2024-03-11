import React from 'react'
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

function RegisterTest() {
  const testTitle = "UI/UX Review Check"
  const testDescription = "Lorem ipsum Not far stuff she think the jokes. Going as by do known noise he wrote round leave. Warmly put branch people narrow see. Winding its waiting yet parlors married own feeling. Marry fruit do spite jokes an times. Whether at it unknown warrant herself winding if. Him same none name sake had post love. An busy feel form hand am up help. Parties it brother amongst an fortune of. Twenty behind wicket why age now itself ten. In it except to so temper mutual tastes mother. Interested cultivated its continuing now yet are. Out interested acceptance our partiality affronting unpleasant why add. Esteem garden men yet shy course. Consulted up my tolerably sometimes perpetual oh. Expression acceptance imprudence particular had eat unsatiable.  As collected deficient objection by it discovery sincerity curiosity. Quiet decay who round three world whole has mrs man. Built the china there tried jokes which gay why. Assure in adieus wicket it is. But spoke round point and one joy. Offending her moonlight men sweetness see unwilling. Often of it tears whole oh balls share an."
  const testDuration = "60"
  const testMarks = "100"
  const testQuestions = "10"
  const testDate = "2021-09-01"
  const testStartTime = "09:00 am"
  const testInstructions = "Not far stuff she think the jokes. Going as by do known noise he wrote round leave. Warmly put branch people narrow see. Winding its waiting yet parlors married own feeling. Marry fruit do spite jokes an times. Whether at it unknown warrant herself winding if. Him same none name sake had post love. An busy feel form hand am up help. Parties it brother amongst an fortune of. Twenty behind wicket why age now itself ten."
  const testType = "MCQ"
  
  return (
    <div>
      <Navbar />
      <div className='flex p-3 gap-x-2 items-center bg-gray-50'>
        <Card className="h-svh w-screen">
          <CardHeader floated={false} shadow={false} >  
            <Typography variant="h4" color="blue-gray" className="mb-2">
              {testTitle}
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
                    {testDuration} minutes
                  </Typography>
                </div>
                <div className=' w-5/6 p-2 h-fit bg-gray-100 rounded-[30px]'>
                  <Typography variant="h6" color="blue-gray" className="text-center">
                    Test Date
                  </Typography>
                  <Typography className='text-center'>
                    {testDate} 
                  </Typography>
                </div>
                <div className=' w-5/6 p-2 h-fit bg-gray-100 rounded-[30px]'>
                  <Typography variant="h6" color="blue-gray" className="text-center">
                    Test Start time
                  </Typography>
                  <Typography className='text-center'>
                    {testStartTime}
                  </Typography>
                </div>
                <div className=' w-5/6 p-2 h-fit bg-gray-100 rounded-[30px]'>
                  <Typography variant="h6" color="blue-gray" className="text-center">
                    Test Marks
                  </Typography>
                  <Typography className='text-center'>
                    {testMarks}
                  </Typography>
                </div>
                <div className=' w-5/6 p-2 h-fit bg-gray-100 rounded-[30px]'>
                  <Typography variant="h6" color="blue-gray" className="text-center">
                    Test Questions
                  </Typography>
                  <Typography className='text-center'>
                    {testQuestions}
                  </Typography>
                </div>
                <div className=' w-5/6 p-2 h-fit bg-gray-100 rounded-[30px]'>
                  <Typography variant="h6" color="blue-gray" className="text-center">
                    Test Type
                  </Typography>
                  <Typography className='text-center'>
                    {testType}
                  </Typography>
                </div>
              </div>              
            </div>
          </CardBody>
          <CardFooter className="pt-0 flex justify-center">
            <Button className='w-1/2 rounded-2xl'>Register</Button>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </div>
  )
}

export default RegisterTest