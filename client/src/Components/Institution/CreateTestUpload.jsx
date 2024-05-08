import { useState } from "react";
import Papa from "papaparse";
import { notifySuccess, notifyError, notifyWarn } from "../../Components/UI/ToastNotification";
import Cookies from "js-cookie";

import { Typography } from "@material-tailwind/react";
import { CheckIcon, LockClosedIcon } from "@heroicons/react/16/solid";
import Navbar from "../Common/Navbar";
import Footer from "../Common/Footer";

const CreateTestUpload = () => {
    const [testData, setTestData] = useState({ title: "", start: "", duration: "", description: "", instructions: "" });
    const [upstate, setUpstate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([
        {
            id: 1,
            title: "",
            statement: "",
            type: "single_correct",
            choices: [
                { value: "", isCorrect: false },
                { value: "", isCorrect: false },
            ],
            answer: "",
            marks: "",
        },
    ]);
    let date = new Date();

    const handlePreview = () => {
        localStorage.setItem('testData', JSON.stringify(testData));
        localStorage.setItem('testQuestion', JSON.stringify(questions));
        window.open('/institution/createtest/preview', '_blank');
    };

    const readCSVFile = (event) => {
        const file = event.target.files[0];
        Papa.parse(file, {
            header: true,
            complete: function (results) {
                const tempData = results.data.map((item, index) => ({
                    id: index + 1,
                    title: item.Question_Title,
                    statement: item.Statement,
                    type: item.Type.toLowerCase().replace(' ', '_'),
                    choices: item.Options.split(', ').map(option => ({
                        value: option,
                        isCorrect: item.Answer.split(', ').includes(option)
                    })),
                    answer: "",
                    marks: parseInt(item.Marks)
                }));
                setQuestions(tempData);
            }
        });
        setUpstate(true);
    };

    const handleSubmit = () => {
        setLoading(true);
        console.log(testData);
        const data = new FormData();
        if (testData.title === "" || testData.start === "" || testData.duration === "") {
            setLoading(false);
            return notifyError("Please fill all the fields", 5000);
        }
        if (!upstate) {
            setLoading(false);
            return notifyError("Please upload a file first", 5000);
        }
        let access = Cookies.get("access");
        if (!access) {
            setLoading(false);
            navigator.push('/institution/login');
            return notifyError("Please login first", 5000);
        }
        data.append('title', testData.title);
        data.append('start', testData.start + " +0530");
        data.append('duration', testData.duration);
        data.append("description", testData.description);
        data.append("instructions", testData.instructions);
        data.append('questions', JSON.stringify(questions));
        //alert('Are you absolutely sure you want to create this test? Please preview once before creating!')
        //notifyWarn('Are you absolutely sure you want to create this test? Please preview once before creating!')
        if (window.confirm('Are you absolutely sure you want to create this test? Please preview once before creating!')) {
            fetch("http://localhost:8000/createTest/", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access}`,
                },
                body: data,
            })
                .then(res => res.json())
                .then(data => {
                    if (data.error) {
                        console.log(data.error);
                        notifyError(data.error, 5000);
                    } else {
                        notifySuccess(data.message, 5000);
                    }
                })
                .catch(err => {
                    console.log(err);
                    notifyError("An error occurred. Please try again later", 5000);
                });
        }
        localStorage.removeItem('testData');
        localStorage.removeItem('testQuestion');
        setLoading(false);
        return;
    };
    return (
        <div>
            <Navbar />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="bg-gray-50 flex px-6 py-2 mt-10">
                    <Typography variant="h3" color="blue-gray" className="my-auto">
                        Upload Test
                    </Typography>
                </div>
                <div className="bg-gray-50 flex px-6 py-2">
                    <div className="flex w-1/3 gap-x-4 h-full">
                        <Typography variant="h4" color="blue-gray" className="my-auto align-middle">
                            Test
                        </Typography>
                        <input
                            type="text"
                            placeholder="Test Title"
                            className="w-fit p-1.5 mr-2 mb-2 border-1 border-blue-gray-100 rounded-md"
                            value={testData.title}
                            onChange={(e) => setTestData({ ...testData, title: e.target.value })}
                        />
                    </div>
                    <div className="flex w-1/3 gap-x-4 h-full my-auto">
                        <Typography
                            variant="h4"
                            color="blue-gray"
                            className="my-auto align-middle"
                        >
                            Start Time
                        </Typography>
                        <input
                            type="datetime-local"
                            min={date.toISOString().slice(0, 16)}
                            placeholder="Start Time"
                            className="w-fit p-1.5 border-1 border-blue-gray-100 rounded-md"
                            value={testData.start}
                            onChange={(e) => setTestData({ ...testData, start: e.target.value.slice(0, 16) + ":00" })}
                        />
                    </div>
                    <div className="flex w-1/3 gap-x-4 h-full my-auto">
                        <Typography
                            variant="h4"
                            color="blue-gray"
                            className="my-auto align-middle"
                        >
                            Duration
                        </Typography>
                        <input
                            type="number"
                            placeholder="Duration in sec"
                            className="w-fit p-1.5 border-1 border-blue-gray-100 rounded-md"
                            min={0}
                            value={testData.duration}
                            onChange={(e) =>
                                setTestData({ ...testData, duration: e.target.value })
                            }
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <input
                        accept=".csv"
                        id="csvInput"
                        style={{ width: '50%' }}
                        onChange={readCSVFile}
                        type="file"
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <p>Find sample CSV file <a className="text-blue-500" href="https://docs.google.com/spreadsheets/d/1w014PNlua2iDwv378ejkR6GdHu9LR5MYO5uuJBMa2Eo/edit?usp=sharing" target="_blank">here</a></p>
                </div>
                <div className="flex">
                    <Typography variant="h6" color="blue-gray" className="my-auto">
                        Description
                    </Typography>
                    <textarea
                        
                        placeholder="Type description here"
                        className="mt-2 border-1 border-blue-gray-100 rounded-md w-1/2 h-20 mx-5"
                        value={testData.description}
                        onChange={(e) => { setTestData({ ...testData, description: e.target.value }) }}

                    />
                    <Typography variant="h6" color="blue-gray" className="my-auto">
                        Instructions
                    </Typography>
                    <textarea
                        placeholder="Type instructions here"
                        className="mt-2 border-1 border-blue-gray-100 rounded-md w-1/2 h-20 mx-5"
                        value={testData.instructions}
                        onChange={(e) => { setTestData({ ...testData, instructions: e.target.value }) }}

                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                        onClick={handlePreview}
                        className={`flex font-bold py-2 px-4 rounded mt-4 mx-2 ${upstate ? 'bg-green-500 hover:bg-blue-700 text-white' : 'bg-gray-500 text-gray-300 cursor-not-allowed'}`}
                        disabled={!upstate}
                    >
                        {!upstate ? <LockClosedIcon className="w-6" /> : <CheckIcon className="w-6" />}
                        Preview
                    </button>
                    <button
                        onClick={handleSubmit}
                        className={`${!loading ? 'bg-blue-500 hover:bg-blue-700 text-white' : 'bg-gray-500 text-gray-300 cursor-not-allowed'} font-bold py-2 px-4 rounded mt-4 mx-2`}
                        disabled={loading}
                    >
                        Create
                    </button>
                </div>
                <div className="bg-gray-50 px-6 py-2">
                    <div className="w-full gap-x-4 h-full">
                        <Typography variant="h5" color="blue-gray" className="my-auto align-middle">
                            Important
                        </Typography>
                        <ul className="list-disc">
                            <li className="ml-8">Make sure your file is according to format specified in the demo file</li>
                            <li className="ml-8">Make sure that options in answer field are present in option fields and vice versa</li>
                            <li className="ml-8">Make sure your file is in CSV format</li>
                            <li className="ml-8">ProctorX does not store any of your files</li>
                        </ul>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default CreateTestUpload;