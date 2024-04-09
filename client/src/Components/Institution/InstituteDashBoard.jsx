import React, { useState, useEffect } from "react";
import { Button, Input } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Common/Navbar";
import Footer from "../Common/Footer";
import profileImage from "../../Assets/profile_image.jpg"; // Import the image
import Cookies from "js-cookie"; // Import Cookies

const InstituteDashboard = () => {
  const navigate = useNavigate();
  const [instituteDetails, setInstituteDetails] = useState({});

  const [image, setImage] = useState(null);
  // Dummy data for upcoming tests
  const [upcomingTests, setUpcomingTests] = useState([]);

  // Dummy data for past tests
  const [pastTests, setPastTests] = useState([]);

  useEffect(() => {
    // Fetch student profile and tests data on component mount
    fetchData();
  }, []);

  // Fetch student profile and tests data
  const fetchData = async () => {
    try {
      // Fetch student data and tests data from API
      const accessToken = Cookies.get("access");

      if (!accessToken) {
        console.log("Access token not found, User not authorized");
        navigate("/student/login");
        return;
      }

      const res = await fetch(`${process.env.REACT_APP_API_URL}/dashboard`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setInstituteDetails({
          name: data.name,
          bio: data.bio,
        });

        // Assuming the tests data is returned as part of the response
        console.log(data.upcomingtests);
        console.log(data.pasttests);
        setUpcomingTests(data.upcomingtests);
        setPastTests(data.pasttests);
      } else {
        console.error("Failed to fetch student profile data");
      }
    } catch (error) {
      console.error("Error while fetching data:", error);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    // Handle image upload logic here
    setImage(URL.createObjectURL(file));
  };

  const handleCreateTest = () => {
    navigate("/institution/createtest");
  };

  const handleUpdateTest = () => {
    navigate("/institution/updatetest");
  };

  const handleViewAnalysis = () => {
    navigate("/institution/testresult");
  };

  return (
    <div className="h-screen ">
      <Navbar />
      <div className="flex flex-col flex-grow p-4">
        <div className="text-2xl font-bold mb-4 text-center">
          Institute Dashboard
        </div>
        <div className="flex flex-row">
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="flex-1">
              <img
                src={image || profileImage}
                alt="Institute"
                className="m-4 w-48 h-48 object-cover border-4 border-black"
              />
              <input
                type="file"
                accept="image/*"
                className="-m-5"
                onChange={handleImageUpload}
              />
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="text-4xl text-center font-bold mb-2">
              {instituteDetails.name}
            </div>
            <div className="text-2xl text-center m-4">
              {instituteDetails.bio}
            </div>
            <div className="w-25 items-center">
              <Button
                color="black"
                onClick={handleCreateTest}
                className="mt-4 px-6 py-3 w-full"
                ripple="light"
              >
                Create Test
              </Button>
            </div>
          </div>
        </div>

        {/* Tables */}
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
                      <th className="border border-black px-4 py-2">Test ID</th>
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
                    {upcomingTests.map((test, index) => (
                      <tr key={test.id}>
                        <td className="border border-black px-4 py-2">
                          {index + 1}
                        </td>
                        <td className="border border-black px-4 py-2">
                          {test.title}
                        </td>
                        <td className="border border-black px-4 py-2">
                          {test.id}
                        </td>
                        <td className="border border-black px-4 py-2">
                          {new Date(test.start).toLocaleString()}
                        </td>
                        <td className="border border-black px-4 py-2">
                          {(test.duration)} minutes
                        </td>

                        <td className="border border-black px-4 py-2">
                          <Button
                            color="blue"
                            ripple="light"
                            onClick={handleUpdateTest}
                          >
                            Update Test
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <p className="text-xl font-bold mb-2">No upcoming tests.</p>
            )}

            {pastTests.length > 0 ? (
              <>
                <h2 className="text-xl font-bold mt-8 mb-2 text-left">Hosted Tests</h2>
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
                          {(test.duration)} minutes
                        </td> 
                        <td className="border border-black px-4 py-2">
                          <Button
                            color="blue"
                            ripple="light"
                            onClick={handleViewAnalysis}
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
              <p className=" text-xl font-bold mt-8 mb-2">No hosted tests.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default InstituteDashboard;
