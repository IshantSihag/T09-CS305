import React from "react";
import { Checkbox, Typography } from "@material-tailwind/react";

//css
import "./DetailedAnalysisPage.css";

const CheckAnswer = ({ currentQuestion }) => {

    const getColor=(index)=>
    {
        if(currentQuestion.attempted_options_indices.includes(index) && currentQuestion.answer_options_indices.includes(index))
        {
            return "green"
        }
        else if(currentQuestion.attempted_options_indices.includes(index))
        {
            return "red"
        }
        else if(currentQuestion.answer_options_indices.includes(index))
        {
            return "green"
        }
        else
        {
            return "white"
        }
    }

  return (
    <div className="checklist">
      {currentQuestion.options.map((item, index) => (
        <div style={{ border: `2px solid ${getColor(index)}`, padding: "10px" }}>
          {currentQuestion.attempted_options_indices
.includes(index) && (
            <p style={{ color: `${getColor(index)}`, fontWeight: "bold" }}>Your Answer</p>
          )}

          <div className="checklist-item">
            {item && (
              <Typography color="blue-gray" className="font-medium">
                {item}
              </Typography>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CheckAnswer;
