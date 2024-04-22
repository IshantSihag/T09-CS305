import React, { useEffect } from "react";
import "./StudentResultPage.css"; // Import corresponding CSS file
import DetailedAnalysisComponent from "./DetailedAnalysisComponent";

const DetailedAnalysisPage = ({questions}) => {
    // Sample data for detailed analysis
    useEffect(()=>{
        console.log(questions)
    
    },[])
    return (
        <div className="detailed-analysis-container">
           
            {questions.length>0 && <DetailedAnalysisComponent questions={questions}/>}
        </div>
    );
};

export default DetailedAnalysisPage;
