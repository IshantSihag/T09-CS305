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

	const navigate=useNavigate()

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
					<Input label="Name" type="lg" />
          <Input label="Email" size="lg" />
          <Input label="Password" size="lg" />
          <div className="-ml-2.5">
            <Checkbox label="Remember Me" />
          </div>
        </CardBody>
        <CardFooter className="pt-0">
          <Button variant="gradient" fullWidth>
            Sign Up
          </Button>
          <Typography variant="small" className="mt-6 flex justify-center">
            Already have an account?
            <Typography
              as="a"
              onClick={()=>navigate('/institution/login')}
              variant="small"
              color="blue-gray"
              className="ml-1 font-bold cursor-pointer"
            >
              Sign In
            </Typography>
						<Typography
							as="a"
							onClick={()=>navigate('/student/signup')}
							variant="small"
							color="blue"
							className="ml-1 font-bold cursor-pointer"
						>
							Student?
						</Typography>
          </Typography>
        </CardFooter>
      </Card>
    </div>
  );
}
