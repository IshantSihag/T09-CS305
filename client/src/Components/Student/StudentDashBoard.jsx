import React, { useState, useEffect } from "react";
import { Button, Input } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Common/Navbar";
import Footer from "../Common/Footer";
import profileImage from "../../Assets/profile_image.jpg"; // Import the image
import Cookies from "js-cookie"; // Import Cookies
import DialogBox from "../Common/DialogBox";

import {notifyError, notifySuccess} from "../UI/ToastNotification.jsx";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [studentDetails, setStudentDetails] = useState({});
  const [image, setImage] = useState(null);
  const [upcomingTests, setUpcomingTests] = useState([]);
  const [pastTests, setPastTests] = useState([]);
  const [ongoingTests, setOngoingTests] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  useEffect(() => {
    // Fetch student profile and tests data on component mount
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const accessToken = Cookies.get("access");

      if (!accessToken) {
        console.log("Access token not found, User not authorized");
        notifyError("User not authorized, Please Login again");
        navigate("/student/login");
        return;
      }

      const res = await fetch(`http://127.0.0.1:8000/dashboard`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setStudentDetails({
          name: data.name,
          bio: data.bio,
        });

        console.log(data.upcomingtests);
        console.log(data.pasttests);
        console.log(data.ongoingTests);
        setUpcomingTests(data.upcomingtests);
        setPastTests(data.pasttests);
        setOngoingTests(data.ongoingtests);

        notifySuccess("Tests details fetched successfully");
      } else {
        console.error("Failed to fetch student profile data");
        notifyError("Failed to fetch student profile data, Please try again");
      }
    } catch (error) {
      console.error("Error while fetching data:", error);
      notifyError("Error while fetching data, Please try again");
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(URL.createObjectURL(file));
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    fetchData();
  };

  const handleAttemptTest = (id) => {
    navigate(`/student/starttest/${id}`);
  };

  const handleViewAnalysis = (id) => {
    navigate(`/student/result/${id}`);
  };

  return (
    <div className="h-screen">
      <Navbar />
      <div className="flex flex-col flex-grow p-4">
        <div className="text-2xl font-bold mb-4 text-center">
          Student Dashboard
        </div>
        <div className="flex flex-row">
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="flex-1">
              <img
                src={image || profileImage}
                alt="Student"
                className="m-4 w-48 h-48 object-cover border-4 border-black"
              />
              <input
                type="file"
                accept="image/*"
                className="-m-5 "
                onChange={handleImageUpload}
              />
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="text-4xl text-center font-bold mb-2">
              {studentDetails.name}
            </div>
            <div className="text-2xl text-center m-4">{studentDetails.bio}</div>
            <div className="w-25 items-center">
              <div className="mt-4 px-3 w-full">
                {isDialogOpen && <DialogBox onClose={handleCloseDialog} />}
              </div>
              <div className="mt-4 px-3 w-full">
                <Button onClick={() => navigate("/student/profile")} className="w-32">
                  Profile
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 mt-8">
          <div className="mt-8 mb-8">
            {upcomingTests.length > 0 ? (
              <>
                <h2 className="text-xl font-bold mb-4 text-left">Upcoming Tests</h2>
                <table className="border-collapse border border-black w-full">
                  <thead>
                    <tr>
                      <th className="border border-black px-4 py-2">Sr No.</th>
                      <th className="border border-black px-4 py-2">
                        Test Title
                      </th>
                      <th className="border border-black px-4 py-2">
                        Start Time
                      </th>
                      <th className="border border-black px-4 py-2">
                        Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingTests.map((test, index) => (
                      <tr key={test.id}>
                        <td className="border border-black px-4 py-2">
                          {index + 1}
                        </td>
                        <td className="border border-black px-4 py-2">
                          {test.title}
                        </td>
                        <td className="border border-black px-4 py-2">
                          {new Date(test.start).toLocaleString()}
                        </td>
                        <td className="border border-black px-4 py-2">
                          {test.duration} seconds
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <p className="text-xl font-bold mb-2">No upcoming tests.</p>
            )}

            {ongoingTests.length > 0 ? (
              <>
              <h2 className="text-xl font-bold mb-4 text-left">Ongoing Tests</h2>
              <table className="border-collapse border border-black w-full">
                <thead>
                  <tr>
                    <th className="border border-black px-4 py-2">Sr No.</th>
                    <th className="border border-black px-4 py-2">
                      Test Title
                    </th>
                    <th className="border border-black px-4 py-2">
                      Start Time
                    </th>
                    <th className="border border-black px-4 py-2">
                      Duration
                    </th>
                    <th className="border border-black px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ongoingTests.map((test, index) => (
                    <tr key={test.id}>
                      <td className="border border-black px-4 py-2">
                        {index + 1}
                      </td>
                      <td className="border border-black px-4 py-2">
                        {test.title}
                      </td>
                      <td className="border border-black px-4 py-2">
                        {new Date(test.start).toLocaleString()}
                      </td>
                      <td className="border border-black px-4 py-2">
                        {test.duration} seconds
                      </td>
                      <td className="border border-black px-4 py-2">
                        <Button
                          color="blue"
                          ripple="light"
                          onClick={()=>handleAttemptTest(test.id)}
                        >
                          Attempt Test
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
            ) : (
              <p className="text-xl font-bold mb-2">No Ongoing tests.</p>
            )}

            {pastTests.length > 0 ? (
              <>
                <h2 className="text-xl font-bold mt-8 mb-2 text-left">Past Tests</h2>
                <table className="border-collapse border border-black w-full">
                  <thead>
                    <tr>
                      <th className="border border-black px-4 py-2">Sr No.</th>
                      <th className="border border-black px-4 py-2">
                        Test Title
                      </th>
                      <th className="border border-black px-4 py-2">
                        Start Time
                      </th>
                      <th className="border border-black px-4 py-2">
                        Duration
                      </th>
                      <th className="border border-black px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pastTests.map((test, index) => (
                      <tr key={test.id}>
                        <td className="border border-black px-4 py-2">
                          {index + 1}
                        </td>
                        <td className="border border-black px-4 py-2">
                          {test.title}
                        </td>
                        <td className="border border-black px-4 py-2">
                          {new Date(test.start).toLocaleString()}
                        </td>
                        <td className="border border-black px-4 py-2">
                          {(test.duration)} seconds
                        </td>
                        <td className="border border-black px-4 py-2">
                          <Button
                            color="blue"
                            ripple="light"
                            onClick={() => handleViewAnalysis(test.id)}
                          >
                            View Analysis
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <p className=" text-xl font-bold mt-8 mb-2">No Past tests.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StudentDashboard;
