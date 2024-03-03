import React, { useState, useEffect } from "react";
import { 
    Button
} from "@material-tailwind/react";

//css 
import "../../styles/AttemptTest.css";

//custom components
import Pagination from "../Common/Pagination";
import CheckList from "../Common/CheckList";
import QuickLink from "../Common/QuickLink";

//utils 
import secondsToHMS from "../../Utils/secondsToHMS";

//icons 
import { ClockIcon, Squares2X2Icon } from "@heroicons/react/24/outline";

const AttemptTest=()=>
{
    const [totalQuestions, setTotalQuestions] = useState(10);
    const [currentQuestion, setCurrentQuestion] = useState(1);

    const [timeLeft, setTimeLeft] = useState(1000);
    
    //for quicks links
    const [open, setOpen] = useState(false);


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
                            <div className="question-number">Question No. 1</div>
                            <div className="question-points">Points: 10</div>
                        </div>
                        <div className="question-statement">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                        Duis aute irure dolor in reprehenderit in 
                        voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
                    </div>
                    <div className="answer-container">
                        <div className="answer-statement">Answer Statement</div>
                        <div className="answer-option">
                            <CheckList />
                        </div>
                    </div>
                </div>
                <div className="test-footer">
                    <Button className="test-submit-btn">Submit</Button>
                    <div className="test-nav-btns">
                        <Button className="test-prev-btn">Previous</Button>
                        <Button className="test-next-btn">Next</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AttemptTest