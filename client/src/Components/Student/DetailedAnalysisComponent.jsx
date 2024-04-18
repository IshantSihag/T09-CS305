import React, { useState, useEffect } from "react";
import { Button } from "@material-tailwind/react";
import "./DetailedAnalysisPage.css";
import Pagination from "../Common/Pagination";
import CheckAnswer from "./CheckAnswer";
import QuickLink from "../Common/QuickLink";
import { ClockIcon, Squares2X2Icon } from "@heroicons/react/24/outline";

const DetailedAnalysisComponent = () => {
    const [totalQuestions, setTotalQuestions] = useState(10);
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [timeLeft, setTimeLeft] = useState(1000);
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
                            total={1}
                            currentIndex={1}
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
                </div>   
                <div className="test-body">
                    <div className="question-container">
                        <div className="question-meta-data">
                            <div className="question-number">Question No. 1</div>
                            <div className="question-points">Marks: 2</div>
                        </div>
                        <div className="question-statement">Question 1</div>
                    </div>
                    <div className="answer-container">
                        <div className="answer-statement">Answer Statement</div>
                        <div className="answer-option">
                            <CheckAnswer />
                        </div>
                    </div>
                </div>
                <div className="test-footer">
                    <div className="test-nav-btns">
                        <Button className="test-prev-btn">Previous</Button>
                        <Button className="test-next-btn">Next</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailedAnalysisComponent;
