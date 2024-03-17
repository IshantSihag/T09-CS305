import React, { useState, useEffect } from "react";
import { 
    Button
} from "@material-tailwind/react";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";

//css 
import "../../styles/AttemptTest.css";

//custom components
import Pagination from "../Common/Pagination";
import CheckList from "../Common/CheckList";
import QuickLink from "../Common/QuickLink";
import { GridLoadingScreen } from "../UI/LoadingScreen";

//utils 
import secondsToHMS from "../../Utils/secondsToHMS";

//icons 
import { ClockIcon, Squares2X2Icon } from "@heroicons/react/24/outline";

const AttemptTest=()=>
{
    //for quicks links
    const [open, setOpen] = useState(false);
    
    //dynamically fetched data 
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [timeLeft, setTimeLeft] = useState(0);
    const [userQuestions, setUserQuestions] = useState([]);

    const navigate = useNavigate();

    //TODO: fetch correct test id
    const testId = 1;

    const storeListToCookies = async(usrQ, usrT) => {
        // console.log("COOKIES");

        console.log("userT = " + usrT); 
        Cookies.set(`ques/${testId}`, JSON.stringify({ usrQ }), { expires: 1 });
        Cookies.set(`time/${testId}`, JSON.stringify({ usrT }), { expires: 1 });
    };

    useEffect(() => {
        const fetchQuestions = async() => {
            try {
                //fetching the questions list, if it is available in cookies
                const cookiesQuesData = Cookies.get(`ques/${testId}`);  
                const cookiesTimeData = Cookies.get(`time/${testId}`); 

                // console.log("cookiesQuesData : ", cookiesQuesData, " cookiesTimeData : ", cookiesTimeData);
                
                // filling values with the cookies data
                if (cookiesQuesData && cookiesTimeData) {
                    console.log("Data found in cookies");
                    const parsedQ = await JSON.parse(cookiesQuesData);
                    const parsedT = await JSON.parse(cookiesTimeData);
                    
                    // console.log("Parsed Data from cookies : Q = ", parsedQ, " T = ", parsedT);
                    
                    setTotalQuestions(parsedQ.usrQ.length);
                    setTimeLeft(parsedT.usrT);
                    setUserQuestions(parsedQ.usrQ);

                    return ;
                }

                console.log("No data found in cookies, fetching the questions list from API...");
                
                //accessing access token from cookies 
                const accessToken = Cookies.get('access');

                if (!accessToken) {
                    console.log("Access token not found, User not authorized");
                    navigate('/student/login');
                    return ;
                }  

                //calling API (cookies does not exist)
                const formData = new FormData();
                formData.append('test_id', testId);

                const res = await fetch(`${process.env.REACT_APP_API_URL}/startTest/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}` 
                    },
                    body: formData
                });

                if (res.ok) {
                    const data = await res.json();
                    
                    //setting up variables 
                    setTotalQuestions(data.questions.length);
                    setTimeLeft(data.duration);

                    //user's questions list 
                    const questionsList = [];
                    for (const ques of data.questions) {
                        questionsList.push({ ...ques, answerList: [] });
                    } 

                    setUserQuestions(questionsList);

                    //setting cookies data
                    console.log("Data fetched, setting up cookies with fetched data..."); 
                    await storeListToCookies(questionsList, data.duration); 

                    // console.log("stored cookies questionList : ", questionsList);
                } else {
                    //CHECK: for unauthorized request, user redirected to login
                    if (res.status === 401) {
                        console.log("Unauthorized : Please login");
                        navigate('/student/login');
                    }
                    console.log(`Fetch Error : ${res.status}`);
                }
            } catch (err) {
                console.log(`Error while fetching test: ${err.message}`); 
            }
        };
        
        fetchQuestions();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(prevTimeLeft => {
                if (prevTimeLeft <= 0) {
                    clearInterval(interval); 
                    return 0; 
                }
                return prevTimeLeft - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    if (userQuestions.length === 0) {
        return <><GridLoadingScreen /></>
    }

    const handleButtonClick = (e, act) => {
        if (act === "next") {
            if (currentQuestion < totalQuestions) setCurrentQuestion(currentQuestion+1);
        } else if (act === "prev") {
            if (currentQuestion > 1) setCurrentQuestion(currentQuestion-1);
        }
    };

    const handleTestSubmit = async(e) => {
        e.preventDefault();
        try {
            const accessToken = Cookies.get('access');
            if (!accessToken) {
                console.log("Access token not found, User not authorized");
                navigate('/student/login');
                return;
            }

            const data = {
                test_id :testId,
                user_response: userQuestions
            };

            const res = await fetch(`${process.env.REACT_APP_API_URL}/submitTest/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                const data = await res.json();
                
                //TODO: handle error message using toastify
                
                console.log("Test submitted successfully");
                // Handle the response data as needed
            } else {
                // Handle the error response
                console.log(`Test submission failed: ${res.status}`);
            }
        } catch (err) {
            console.log(`Error while submitting test: ${err.message}`);
        }
    }; 

    const handleOptionClick = async(e, index) => {
        // console.log("userQuestion before option clicked : ", userQuestions);    
        const newAnswerList = [...userQuestions];
        // console.log("currentQuestion : ", currentQuestion);
        
        const question = userQuestions[currentQuestion-1];
        
        // console.log("question : ", question);
        // console.log("index : ", index);

        if (question.type === 'single') {
            //user wants to remove a already selected option
            if (question.answerList.includes(index)) {
                newAnswerList[currentQuestion-1].answerList = []; 
            } 
            //user wants to select a new option
            else {
                newAnswerList[currentQuestion-1].answerList = [index];
            } 
        } else if (question.type === 'multiple') {
            //user wants to remove a already selected option
            if (question.answerList.includes(index)) {
                newAnswerList[currentQuestion-1].answerList = question.answerList.filter(opt => opt !== index); 
            } 
            //user wants to select a new option
            else {
                newAnswerList[currentQuestion-1].answerList.push(index);
            } 
        }
        // console.log("new answerList : ", newAnswerList);
        setUserQuestions(newAnswerList);  

        //setting cookies data
        await storeListToCookies(newAnswerList, timeLeft); 
    };

    return (
        <div>
            <div className="test-container">
                <div className="test-header">
                    <div className="test-header-heading">ProctorX Test</div>
                    <div className="test-header-content">
                        <Pagination 
                            total={totalQuestions}
                            currentIndex={currentQuestion}
                            setCurrentIndex={setCurrentQuestion}
                        />
                        <div className="quick-links-container">
                            <Squares2X2Icon className="ml-2 h-6 w-6 text-gray-500 cursor-pointer quick-links-icon" onClick={() => setOpen(!open)} />
                            {open && <QuickLink
                                className="quick-links" 
                                total={totalQuestions}
                                currentIndex={currentQuestion}
                                setCurrentIndex={setCurrentQuestion}
                                setOpen={setOpen}
                            />}
                        </div>
                    </div>
                    <div className="test-header-timer"><ClockIcon />Time Left<span style={{ color: timeLeft >= 5*60 ? "green" : "red" }}>{secondsToHMS(timeLeft)}</span></div>
                </div>   
                <div className="test-body">
                    <div className="question-container">
                        <div className="question-meta-data">
                            <div className="question-number">Question No. {currentQuestion}</div>
                            <div className="question-points">Points: {userQuestions[currentQuestion-1].marks}</div>
                        </div>
                        <div className="question-statement">{userQuestions[currentQuestion-1].statement}</div>
                    </div>
                    <div className="answer-container">
                        <div className="answer-statement">Answer Statement</div>
                        <div className="answer-option">
                            <CheckList 
                                userQuestions={userQuestions}
                                currentQuestion={currentQuestion}
                                handleOptionClick={handleOptionClick}
                            />
                        </div>
                    </div>
                </div>
                <div className="test-footer">
                    <Button className="test-submit-btn" onClick={(e) => handleTestSubmit(e)}>Submit</Button>
                    <div className="test-nav-btns">
                        <Button className="test-prev-btn" disabled={currentQuestion === 1} onClick={(e) => handleButtonClick(e, "prev")}>Previous</Button>
                        <Button className="test-next-btn" disabled={currentQuestion === totalQuestions} onClick={(e) => handleButtonClick(e, "next")}>Next</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AttemptTest