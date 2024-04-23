import { useState } from "react";
import { notifySuccess, notifyError, notifyWarn } from "../../Components/UI/ToastNotification";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

import { Typography } from "@material-tailwind/react";
import { SparklesIcon } from "@heroicons/react/16/solid";
import Navbar from "../Common/Navbar";
import Footer from "../Common/Footer";

const CreateTestAI = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [topic, setTopic] = useState('');
    const [quesno, setQuesno] = useState(0);
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

    const setQues = (ques, check) => {
        if(!check) {
            setQuestions((prev) => 
                [ 
                    {
                        id: 1,
                        statement: ques.question,
                        type: "single_correct",
                        choices: [
                            { value: ques.option1, isCorrect: ques.option1 === ques.answer },
                            { value: ques.option2, isCorrect: ques.option2 === ques.answer },
                            { value: ques.option3, isCorrect: ques.option3 === ques.answer},
                            { value: ques.option4, isCorrect: ques.option4 === ques.answer},
                        ],
                        answer: "",
                        marks: "",
                    }
                ]
            );
        }
        else {
            setQuestions((prev) => 
                [
                    ...prev,
                    {
                        id: prev.length + 1,
                        statement: ques.question,
                        type: "single_correct",
                        choices: [
                            { value: ques.option1, isCorrect: ques.option1 === ques.answer },
                            { value: ques.option2, isCorrect: ques.option2 === ques.answer },
                            { value: ques.option3, isCorrect: ques.option3 === ques.answer},
                            { value: ques.option4, isCorrect: ques.option4 === ques.answer},
                        ],
                        answer: "",
                        marks: "",
                    }
                ]
            );
        }
    };

    const handleGenerateQuestions = async () => {
        if (topic === '' || quesno === 0) {
            notifyWarn("Please fill all the fields");
            return;
        }
        setLoading(true);
        try {
            const datas = new FormData();
            datas.append('numberOfQuestion', quesno);
            datas.append('topic', topic);
            const res = await fetch('https://plankton-app-tkucz.ondigitalocean.app/acad/se', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    topic,
                    quesno
                })
            });
            const data = await res.json();
            if (data.ok) {
                console.log(data);
                notifySuccess("Questions generated successfully");
                const len = data.test.questions.length;
                setQues(data.test.questions[0], 0);
                for(let i=1; i<len; i++) {
                    setQues(data.test.questions[i], 1);
                }
                Cookies.set("questions", JSON.stringify(questions));
                navigate('/institution/createtest');
            } else {
                notifyError(data.message);
            }
        } catch (err) {
            notifyError("Something went wrong, Please try again");
        }
        setLoading(false);
    }

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
                    <div className="flex w-1/2 gap-x-4 h-full">
                        <Typography variant="h4" color="blue-gray" className="my-auto align-middle">
                            Topic
                        </Typography>
                        <input
                            type="text"
                            placeholder="Test Topic"
                            value={topic}
                            className="w-fit p-1.5 mr-2 mb-2 border-1 border-blue-gray-100 rounded-md"
                            onChange={(e) => setTopic(e.target.value)}
                        />
                    </div>
                    <div className="flex w-1/2 gap-x-4 h-full">
                        <Typography variant="h4" color="blue-gray" className="my-auto align-middle">
                            Number of Questions
                        </Typography>
                        <input
                            type="number"
                            placeholder="Number of Questions"
                            value={quesno}
                            className="w-fit p-1.5 mr-2 mb-2 border-1 border-blue-gray-100 rounded-md"
                            onChange={(e) => setQuesno(e.target.value)}
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                        className={`${!loading ? 'bg-green-500 hover:bg-green-700 text-white' : 'bg-gray-500 text-gray-300 cursor-not-allowed'} font-bold py-2 px-4 rounded mt-4 mx-2`}
                        disabled={loading}
                        onClick={handleGenerateQuestions}
                    >
                        Get questions with AI 
                        {!loading ? <SparklesIcon className="animate-bounce inline-block h-5 w-5 ml-2" /> : null}
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

export default CreateTestAI;