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

export default function InstitutionSignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);

  const validateEmail = () => {
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(email));
  };

  const handleSignup = () => {
    if (isValidEmail) {
      console.log("Signup with name : ", name, "email:", email, "and password:", password);
    } else {
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
            Student Sign Up
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <Input label="Name" type="lg" onChange={(e) => setName(e.target.value)} />
          <Input label="Email" size="lg" onChange={(e) => setEmail(e.target.value)} />
          <Input label="Password" size="lg" onChange={(e) => setPassword(e.target.value)} />
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
              onClick={() => navigate("/student/login")}
              variant="small"
              color="blue-gray"
              className="ml-1 font-bold cursor-pointer"
            >
              Sign In
            </Typography>
            <Typography
              as="a"
              onClick={() => navigate("/institution/signup")}
              variant="small"
              color="blue"
              className="ml-1 font-bold cursor-pointer"
            >
              Institute?
            </Typography>
          </Typography>
        </CardFooter>
      </Card>
    </div>
  );
}
