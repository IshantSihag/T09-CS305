import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
  Button,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';


import { ToastContainer, notifyError, notifySuccess } from '../UI/ToastNotification';


const StudentLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);

  const validateEmail = () => {
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(email));
  };

  const handleLogin = async() => {
    validateEmail();
    if(!email || !password) {
      console.log("Please fill all the fields");
      notifyError("Please fill all the fields");
      return;
    }
    if (isValidEmail) {
      console.log("Login with email:", email, "and password:", password);
      
      const formData = new FormData();
      
      formData.append('password', password);
      formData.append('username', email);
      formData.append('type', "student");
 
      const response = await fetch('http://127.0.0.1:8000/login/', {
        method: "POST",
        body: formData
      });

      console.log("student response: ", response);

      const data = await response.json();
      if (response.ok) {
        if (data.ok) {
          console.log("Login Successfully");
          notifySuccess("Login Successful");

          //setting up the cookies with the fetched data
          Cookies.set('access', data.access, { expires: 1, path: '/' });          
          Cookies.set('refresh', data.refresh, { expires: 1, path: '/' });          
          Cookies.set('type', data.type, { expires: 1, path: '/' });     
          Cookies.set('name', data.name, { expires: 1, path: '/' })     
          Cookies.set('email', data.email, { expires: 1, path: '/' })     

          navigate("/");  
        } else {
          const errMsg = data?.error || "Error in Signup, Please try again";
          notifyError(errMsg);
          console.log(errMsg);
        }
      } else {
        console.log("Login Failed Please try again");
        notifyError(data?.error || "Error in Login, Please try again");
      }

      // Perform login action here
    } else {
      console.error("Invalid email address");
      notifyError("Please enter a valid email");
    }
  };

  return (
    <div className="h-screen flex items-center place-content-center">
      <Card className="w-96">
        <CardHeader
          variant="gradient"
          color="gray"
          className=" fkex-1 mb-4 grid h-28 place-items-center"
        >
          <Typography variant="h3" color="white">
            Student Login Page
          </Typography>
        </CardHeader>
        <CardBody>
          <div className="mb-4">
            <Input
              label="Email"
              size="lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={validateEmail}
            />
            {!isValidEmail && (
              <Typography variant="p" color="red">
                Invalid email address
              </Typography>
            )}
          </div>
          <div className="mb-4">
            <Input
              label="Password"
              size="lg"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Checkbox label="Remember Me" />
        </CardBody>
        <CardFooter>
          <Button variant="gradient" fullWidth onClick={handleLogin}>
            Login
          </Button>
          <Typography variant="small" className="mt-6 flex justify-center">
            Don't have an account?
            <Typography
              as="a"
              onClick={() => navigate("/student/signup")}
              variant="small"
              color="blue"
              className="ml-1 font-bold cursor-pointer"
            >
              Sign Up
            </Typography>
          </Typography>
        </CardFooter>
      </Card>
      {/* <ToastContainer /> */}
    </div>
  );
};

export default StudentLogin;
