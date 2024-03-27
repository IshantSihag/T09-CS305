import React, { useState, useEffect } from "react";
import { Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Common/Navbar";
import Footer from "../Common/Footer";
import profileImage from "../../Assets/profile_image.jpg"; // Import the image
import Cookies from "js-cookie"; // Import Cookies

const InstituteDashboard = () => {
  const navigate = useNavigate();
  const [instituteDetails, setInstituteDetails] = useState({
    name: "Sumit Patil",
    bio: " Lorem ipsum dolor sit, amet consectetur adipisicing elit. Adipisci laudantium, ullam illum nemo qui explicabo non sit eligendi, doloribus, molestiae quaerat beatae impedit praesentium perferendis commodi cum nulla. Totam tempora, at voluptates illum ipsa ea dolore, aperiam veritatis dolores consectetur dolorem? Fugit temporibus totam, quasi aliquid id quidem magni omnis!",
  });

  const [image, setImage] = useState(null);
  const [hostedTests, setHostedTests] = useState([]);
  const [toHostTests, setToHostTests] = useState([]);

  useEffect(() => {
    fetchDummyData();
  }, []);

  const fetchDummyData = async () => {
    // Fetching dummy data for hosted tests
    const dummyHostedTests = [
      {
        id: 1,
        title: "Dummy Hosted Test 1",
        startDate: "2024-04-01",
        duration: "2 hours",
      },
      {
        id: 2,
        title: "Dummy Hosted Test 2",
        startDate: "2024-04-05",
        duration: "1.5 hours",
      },
    ];

    // Fetching dummy data for to host tests
    const dummyToHostTests = [
      {
        id: 3,
        title: "Dummy To Host Test 1",
        startDate: "2024-04-10",
        duration: "1 hour",
      },
      {
        id: 4,
        title: "Dummy To Host Test 2",
        startDate: "2024-04-15",
        duration: "2.5 hours",
      },
    ];

    setHostedTests(dummyHostedTests);
    setToHostTests(dummyToHostTests);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(URL.createObjectURL(file));
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
                className="m-10"
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
          </div>
        </div>

        {/* Hosted Tests Table */}
        <div className="flex-1 mt-8">
          <div className="mt-8 mb-8">
            <h2 className="text-xl font-bold mb-2">Hosted Tests</h2>
            <table className="border-collapse border border-black w-full">
              <thead>
                <tr>
                  <th className="border border-black px-4 py-2">Sr No.</th>
                  <th className="border border-black px-4 py-2">Test Title</th>
                  <th className="border border-black px-4 py-2">Start Date</th>
                  <th className="border border-black px-4 py-2">Duration</th>
                  <th className="border border-black px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {hostedTests.map((test, index) => (
                  <tr key={test.id}>
                    <td className="border border-black px-4 py-2">
                      {index + 1}
                    </td>
                    <td className="border border-black px-4 py-2">
                      {test.title}
                    </td>
                    <td className="border border-black px-4 py-2">
                      {test.startDate}
                    </td>
                    <td className="border border-black px-4 py-2">
                      {test.duration}
                    </td>
                    <td className="border border-black px-4 py-2">
                      <Button color="blue" ripple="light">
                        View Test
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* To Host Tests Table */}
        <div className="flex-1 mt-8">
          <div className="mt-8 mb-8">
            <h2 className="text-xl font-bold mb-2">To Host Tests</h2>
            <table className="border-collapse border border-black w-full">
              <thead>
                <tr>
                  <th className="border border-black px-4 py-2">Sr No.</th>
                  <th className="border border-black px-4 py-2">Test Title</th>
                  <th className="border border-black px-4 py-2">Start Date</th>
                  <th className="border border-black px-4 py-2">Duration</th>
                  <th className="border border-black px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {toHostTests.map((test, index) => (
                  <tr key={test.id}>
                    <td className="border border-black px-4 py-2">
                      {index + 1}
                    </td>
                    <td className="border border-black px-4 py-2">
                      {test.title}
                    </td>
                    <td className="border border-black px-4 py-2">
                      {test.startDate}
                    </td>
                    <td className="border border-black px-4 py-2">
                      {test.duration}
                    </td>
                    <td className="border border-black px-4 py-2">
                      <Button color="blue" ripple="light">
                        View Test
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default InstituteDashboard;
