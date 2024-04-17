import React, { useState, useEffect } from "react";
import {
    Button
} from "@material-tailwind/react";
import Cookies from 'js-cookie';
import { useNavigate, useParams } from "react-router-dom";

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
import Watermark from "../Common/Watermark";
import WebcamCapture from "../Common/WebcamCatpure";

//TODO: REPLACE ALL ALERTS TO REACT TOAST

const AttemptTest = () => {
    //for quicks links
    const [open, setOpen] = useState(false);

    //for voilations warning 
    const [voilation, setVoilation] = useState(false);

    //dynamically fetched data 
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [timeLeft, setTimeLeft] = useState(0);
    const [userQuestions, setUserQuestions] = useState([]);

    const navigate = useNavigate();

    //TODO: fetch the correct user email 
    const email = Cookies.get('email') || "";

    //TODO: fetch correct test id
    // const testId = "98897fbc-55c2-456d-94f2-b14759a57381";
    const { id: testId } = useParams();
    const storeListToCookies = async (usrQ) => {
        // console.log("COOKIES");
        Cookies.set(`ques/${testId}`, JSON.stringify({ usrQ }), { expires: 1 });
    };

    const warningCount = 3;

    //to calculate time left 
    const timeLeftCalc = (startTimeForTest, duration) => {
        const now = new Date();
        const startTime = new Date(startTimeForTest);

        const diffInMs = now.getTime() - startTime.getTime();
        const diffInSec = Math.floor(diffInMs / 1000);

        const left = Math.max(duration - diffInSec, 0);
        return left;
    };

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
              // Tab is active 
            } else {
              alert("TAB SWITCHHH!!!");
            }
          };
      
          document.addEventListener("visibilitychange", handleVisibilityChange);
        const fetchQuestions = async () => {
            try {
                //fetching the questions list, if it is available in cookies
                const cookiesQuesData = Cookies.get(`ques/${testId}`);

                // console.log("cookiesQuesData : ", cookiesQuesData, " cookiesTimeData : ", cookiesTimeData);

                // filling values with the cookies data
                if (cookiesQuesData) {
                    console.log("Data found in cookies");
                    const parsedQ = await JSON.parse(cookiesQuesData);

                    // console.log("Parsed Data from cookies : Q = ", parsedQ, " T = ", parsedT);

                    setTotalQuestions(parsedQ.usrQ.length);
                    setUserQuestions(parsedQ.usrQ);

                    return;
                }

                console.log("No data found in cookies, fetching the questions list from API...");

                //accessing access token from cookies 
                const accessToken = Cookies.get('access');

                if (!accessToken) {
                    console.log("Access token not found, User not authorized");
                    alert("User not authorized, Please Login");
                    navigate('/student/login');
                    return;
                }

                //calling API (cookies does not exist)
                const formData = new FormData();
                formData.append('test_id', testId);

                const res = await fetch(`http://127.0.0.1:8000/startTest/`, {
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

                    const logMsg = "Data fetched, setting up cookies with fetched data...";
                    console.log(logMsg);
                    alert("Data fetched successfully");

                    //setting cookies data
                    await storeListToCookies(questionsList);

                    //setting up the warning count in the cookies
                    Cookies.set(`warn/${testId}`, warningCount, { expires: 1 });

                    // console.log("stored cookies questionList : ", questionsList);
                } else {
                    //CHECK: for unauthorized request, user redirected to login
                    if (res.status === 401) {
                        console.log("Unauthorized : Please login");
                        navigate('/student/login');

                        return;
                    }
                    console.log(`Fetch Error : ${res.status}`);
                }
            } catch (err) {
                console.log(`Error while fetching test: ${err.message}`);
            }
        };

        fetchQuestions();
    }, []);

    //to synchronize the clock on refresh 
    useEffect(() => {
        const fetchTime = async () => {
            try {
                //accessing access token from cookies 
                const accessToken = Cookies.get('access');

                if (!accessToken) {
                    console.log("Access token not found, User not authorized");
                    alert("User not authorized, Please Login");
                    navigate('/student/login');

                    return;
                }

                const formData = new FormData();
                formData.append('test_id', testId);

                const res = await fetch(`http://127.0.0.1:8000/clocksync/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: formData
                })
                if (res.ok) {
                    const data = await res.json();

                    if (data.ok) {
                        const logMsg = "Time fetched successfully";
                        console.log(logMsg);

                        const left = timeLeftCalc(data.start_time, data.duration);
                        setTimeLeft(left);
                    } else {
                        console.log(`Error in fetching test timings: ${data.error}`);
                    }
                } else {
                    //CHECK: for unauthorized request, user redirected to login
                    if (res.status === 401) {
                        console.log("Unauthorized : Please login");
                        alert("Unauthorized : Please login");
                        navigate('/student/login');

                        return;
                    }
                    console.log(`Error in fetching test timings`);
                }
            } catch (err) {
                console.log(`Error in fetching test timings : ${err.message}`);
                alert('Error in fetching test timings');
            }
        };

        fetchTime();
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
            if (currentQuestion < totalQuestions) setCurrentQuestion(currentQuestion + 1);
        } else if (act === "prev") {
            if (currentQuestion > 1) setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleTestSubmit = async (e) => {
        e?.preventDefault();
        try {
            const accessToken = Cookies.get('access');

            if (!accessToken) {
                console.log("Access token not found, User not authorized");
                alert("User not authorized, Please Login");
                navigate('/student/login');
                return;
            }

            const data = {
                test_id: testId,
                user_response: userQuestions
            };

            const sendData = JSON.stringify(data);

            const sendFormData = new FormData();
            sendFormData.append("data", sendData);

            const res = await fetch(`http://127.0.0.1:8000/submitTest/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                body: sendFormData
            });

            const resData = await res.json();

            // console.log("res = ", res);
            // console.log("resData = ", resData);

            if (res.ok) {
                const receievedMsg = resData.message;

                if (resData.ok) {
                    //removing cookies data after successfully submitting the test
                    Cookies.remove(`ques/${testId}`);
                    Cookies.remove(`warn/${testId}`);
                    // Cookies.remove(`time/${testId}`);

                    console.log(receievedMsg);
                    alert(receievedMsg);

                    //navigating to student dashboard
                    navigate("/student/review");
                } else {
                    // Handle the error response
                    let errMsg = `Test submission failed: ${resData.error}` || "Error (submit-test)";
                    console.log(`Error (submit-test) : ${errMsg}`);
                    alert("Submit test failed");
                }
            } else {
                // Handle the error response
                let errMsg = `Error while submitting test`;
                console.log(errMsg);
                alert("Submit test failed");
            };
        } catch (err) {
            let errMsg = `Error while submitting test: ${err.message}`;
            console.log(`Error (submit-test) : ${err}`);
            alert(errMsg);
        }
    };

    const handleOptionClick = async (e, index) => {
        // console.log("userQuestion before option clicked : ", userQuestions);    
        const newAnswerList = [...userQuestions];
        // console.log("currentQuestion : ", currentQuestion);

        const question = userQuestions[currentQuestion - 1];

        // console.log("question : ", question);
        // console.log("index : ", index);

        if (question.type === 'single') {
            //user wants to remove a already selected option
            if (question.answerList.includes(index)) {
                newAnswerList[currentQuestion - 1].answerList = [];
            }
            //user wants to select a new option
            else {
                newAnswerList[currentQuestion - 1].answerList = [index];
            }
        } else if (question.type === 'multiple') {
            //user wants to remove a already selected option
            if (question.answerList.includes(index)) {
                newAnswerList[currentQuestion - 1].answerList = question.answerList.filter(opt => opt !== index);
            }
            //user wants to select a new option
            else {
                newAnswerList[currentQuestion - 1].answerList.push(index);
            }
        }
        // console.log("new answerList : ", newAnswerList);
        setUserQuestions(newAnswerList);

        //setting cookies data
        await storeListToCookies(newAnswerList, timeLeft);
    };

    return (
        <>
            <Watermark text={email} />
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
                        <div className="test-header-timer"><ClockIcon />Time Left<span style={{ color: timeLeft >= 5 * 60 ? "green" : "red" }}>{secondsToHMS(timeLeft)}</span></div>
                        <div className="test-header-webcam">
                            <WebcamCapture 
                                voilation={voilation}
                                setVoilation={setVoilation}
                                handleTestSubmit={handleTestSubmit}
                                testId={testId}
                            />
                        </div>
                    </div>
                    <div className="test-body">
                        <div className="question-container">
                            <div className="question-meta-data">
                                <div className="question-number">Question No. {currentQuestion}</div>
                                <div className="question-points">Points: {userQuestions[currentQuestion - 1].marks}</div>
                            </div>
                            <div className="question-statement">{userQuestions[currentQuestion - 1].statement}</div>
                        </div>
                        <div className="answer-container">
                            <div className="answer-statement">{userQuestions[currentQuestion - 1].type} choice</div>
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
        </>
    )
}

export default AttemptTest