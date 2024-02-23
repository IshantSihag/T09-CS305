import React, {useState} from "react";
import { 
    Button
} from "@material-tailwind/react";

//css 
import "../../styles/AttemptTest.css";

//custom components
import Pagination from "../Common/Pagination";

const AttemptTest=()=>
{
    const [totalQuestions, setTotalQuestions] = useState(10);
    const [currentQuestion, setCurrentQuestion] = useState(1);

    return (
        <div>
            <div className="test-container">
                <div className="test-header">
                    <div>ProctorX Test</div>
                    <div>
                        <Pagination 
                            total={totalQuestions}
                            currentIndex={currentQuestion}
                            setCurrentIndex={setCurrentQuestion}
                        />
                    </div>
                    <div className="test-header-timer">Time Left<span>00:00:00</span></div>
                </div>   
                <div className="test-body">
                    <div className="question-container">
                        <div className="question-meta-data">
                            <div className="question-number">Question No. 1</div>
                            <div className="question-points">Points: 10</div>
                        </div>
                        <div className="question-statement">Question Statement</div>
                    </div>
                    <div className="answer-container">
                        <div className="answer-statement">Answer Statement</div>
                        <div className="answer-option">Answer Options</div>
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