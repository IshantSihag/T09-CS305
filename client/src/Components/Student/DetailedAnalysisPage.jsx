import React from "react";
import "./StudentResultPage.css"; // Import corresponding CSS file

const DetailedAnalysisPage = () => {
    // Sample data for detailed analysis
    const analysisData = [
        { question: "Question 1", correctness: "Correct" },
        { question: "Question 2", correctness: "Incorrect" },
        { question: "Question 3", correctness: "Unattempted" },
        // Add more analysis data as needed
    ];

    return (
        <div className="detailed-analysis-container">
            <h2 className="analysis-title">Detailed Analysis</h2>
            <div className="analysis-list">
                {analysisData.map((item, index) => (
                    <div key={index} className="analysis-item">
                        <div className="question">{item.question}</div>
                        <div className={`correctness ${item.correctness.toLowerCase()}`}>{item.correctness}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DetailedAnalysisPage;
