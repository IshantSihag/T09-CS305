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


import { ToastContainer, notifyError, notifySuccess } from '../UI/ToastNotification';

export default function InstitutionSignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleValidation = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);  
  };

  const handleSignup = async() => {
    // Handle signup logic here
    console.log("Signing up with:", name, email, password);
    if(!name || !email || !password) {
      notifyError("Please fill all the fields");
      return;
    }
    if (handleValidation()) {
      const formData = new FormData();

      formData.append('name', name);
      formData.append('password', password);
      formData.append('username', email);
      formData.append('type', "institute");
 
      const response = await fetch('http://127.0.0.1:8000/signup/', {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        if (data.ok) {
          console.log("Signup Successfully");
          notifySuccess("Signup Successful");
          navigate("/institution/login");  
        } else {
          const errMsg = data?.error || "Error in Signup, Please try again";
          notifyError(errMsg);
          console.log(errMsg);
        }
      } else {
        console.log("Signup Failed Please try again");
        notifyError(data?.error || "Error in Signup, Please try again");
      }

      console.log(response);
    } else {
      notifyError("Please enter a valid email");
      console.error("Invalid email address");
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
            Institute Sign Up
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <Input
            label="Name"
            type="lg"
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Email"
            size="lg"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Password"
            size="lg"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="-ml-2.5">
            <Checkbox label="Remember Me" />
          </div>
        </CardBody>
        <CardFooter className="pt-0">
          <Button variant="gradient" fullWidth onClick={handleSignup}>
            Sign Up
          </Button>
          <Typography variant="small" className="mt-6 flex justify-center">
            Already have an account?
            <Typography
              as="a"
              onClick={() => navigate("/institution/login")}
              variant="small"
              color="blue-gray"
              className="ml-1 font-bold cursor-pointer"
            >
              Sign In
            </Typography>
            <Typography
              as="a"
              onClick={() => navigate("/student/signup")}
              variant="small"
              color="blue"
              className="ml-1 font-bold cursor-pointer"
            >
              Student?
            </Typography>
          </Typography>
        </CardFooter>
      </Card>
      {/* <ToastContainer /> */}
    </div>
  );
}
