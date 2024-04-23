import React, { useState, useEffect } from "react";
import { Button } from "@material-tailwind/react";
import "./DetailedAnalysisPage.css";
import Pagination from "../Common/Pagination";
import CheckAnswer from "./CheckAnswer";
import QuickLink from "../Common/QuickLink";
import { ClockIcon, Squares2X2Icon } from "@heroicons/react/24/outline";

const DetailedAnalysisComponent = ({ questions }) => {
  const [totalQuestions, setTotalQuestions] = useState(questions.length);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timeLeft, setTimeLeft] = useState(1000);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    console.log(questions);
  }, []);
  const NextQuestion = () => {
    if(currentQuestion<totalQuestions)
    {
        setCurrentQuestion(currentQuestion+1)
    }
  };
  const PreviousQuestion = () => {
    if(currentQuestion>1)
    {
        setCurrentQuestion(currentQuestion-1)
    }
  
  }
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
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
              total={questions.length}
              currentIndex={currentQuestion}
              setCurrentIndex={setCurrentQuestion}
            />
            <div className="quick-links-container">
              <Squares2X2Icon
                className="ml-2 h-6 w-6 text-gray-500 cursor-pointer quick-links-icon"
                onClick={() => setOpen(!open)}
              />
              {open && (
                <QuickLink
                  className="quick-links"
                  total={questions.length}
                  currentIndex={currentQuestion}
                  setCurrentIndex={setCurrentQuestion}
                  setOpen={setOpen}
                />
              )}
            </div>
          </div>
        </div>
        <div className="test-body">
          <div className="question-container">
            <div className="question-meta-data">
              <div className="question-number">Question No. {currentQuestion}</div>
              <div className="question-points">Marks: {questions[currentQuestion-1].marks_scored}</div>
            </div>
            {questions && currentQuestion <= questions.length && (
              <div className="question-statement">
                {questions[currentQuestion - 1].statement}
              </div>
            )}
          </div>
          <div className="answer-container">
            <div className="answer-statement">Answer Statement</div>
            <div className="answer-option">
              {currentQuestion <= questions.length && (
                <CheckAnswer currentQuestion={questions[currentQuestion - 1]} />
              )}
            </div>
          </div>
        </div>
        <div className="test-footer">
          <div className="test-nav-btns">
            <Button className="test-prev-btn" onClick={PreviousQuestion}>Previous</Button>
            <Button className="test-next-btn" onClick={NextQuestion}>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedAnalysisComponent;
