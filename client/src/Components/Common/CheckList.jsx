import React, { useState } from 'react'
import { 
    Checkbox, Typography
} from "@material-tailwind/react";

//css 
import "../../styles/AttemptTest.css";

const CheckList = ({
    userQuestions, currentQuestion, handleOptionClick
}) => {
    return (
        <div className="checklist">
            {userQuestions.length !== 0 && userQuestions[currentQuestion-1].options.map((opt, index) => (
                <div className="checklist-item" key={index} onClick={(e) => handleOptionClick(e, index)}>
                    <Checkbox 
                        id="checkbox-1"
                        ripple={true}
                        className="hover:before:opacity-0"
                        containerProps={{
                            className: "p-0",
                        }}
                        // onChange={() => {}}
                        checked={userQuestions[currentQuestion-1].answerList.includes(index)}
                    />
                    <Typography color="blue-gray" className="font-medium">{opt}</Typography>
                </div> 
            ))}
        </div>
    )
}

export default CheckList