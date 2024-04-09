import { useState } from "react";
import Papa from "papaparse";

import { Typography } from "@material-tailwind/react";
import { CheckIcon, LockClosedIcon } from "@heroicons/react/16/solid";
import Navbar from "../Common/Navbar";
import Footer from "../Common/Footer";

const readCSVFile = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
        header: true,
        complete: function(results) {
            const testData = results.data.map((item, index) => ({
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
            console.log({ questions: testData });
        }
    });
}

const CreateTestUpload = () => {
    const [testData, setTestData] = useState({ title: '', start: '', duration: 0 });
    const [upstate, setUpstate] = useState(false);
    let date = new Date();
    return (
        <div>
            <Navbar />
            <div style={{ display: 'flex', flexDirection: 'column', height: '60vh' }}>
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
                            placeholder="Duration in min"
                            className="w-fit p-1.5 border-1 border-blue-gray-100 rounded-md"
                            value={testData.duration / 60}
                            onChange={(e) =>
                                setTestData({ ...testData, duration: e.target.value * 60 })
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
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                        onClick={() => {
                            console.log(testData);
                            console.log(document.getElementById('out').innerHTML);
                        }}
                        className={`flex font-bold py-2 px-4 rounded mt-4 mx-2 ${upstate ? 'bg-blue-500 hover:bg-blue-700 text-white' : 'bg-gray-500 text-gray-300 cursor-not-allowed'}`}
                        disabled={!upstate}
                    >
                        {!upstate ? <LockClosedIcon className="w-6" /> : <CheckIcon className="w-6"/>}
                        Preview
                    </button>
                    <button
                        onClick={() => {
                            console.log(testData);
                            console.log(document.getElementById('out').innerHTML);
                        }}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mx-2"
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