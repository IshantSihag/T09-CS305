import React from 'react'
import { 
    Checkbox, Typography
} from "@material-tailwind/react";

//css 
import "./DetailedAnalysisPage.css";

const CheckAnswer = ({}) => {
    return (
        <div className="checklist">
                  <div style={{border: '2px solid red', padding: '10px'}}>
            <p style={{color: 'red', fontWeight: 'bold'}}>Your Answer</p>
    <div className="checklist-item">
        {/* <Checkbox 
          
            id="checkbox-3"
            ripple={false}
            className="hover:before:opacity-0"
            containerProps={{
                className: "p-0",
            }}
        /> */}
      
        <Typography color="blue-gray" className="font-medium">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </Typography>
    </div>
   
</div>
            <div className="checklist-item">
                {/* <Checkbox 
                    id="checkbox-2"
                    ripple={false}
                    className="hover:before:opacity-0"
                    containerProps={{
                    className: "p-0",
                    }}
                /> */}
                <Typography color="blue-gray" className="font-medium">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                </Typography>
            </div>
            <div style={{border: '2px solid green', padding: '10px'}}>
            <p style={{color: 'green', fontWeight: 'bold'}}>Correct Answer</p>
    <div className="checklist-item">
        {/* <Checkbox 
          
            id="checkbox-3"
            ripple={false}
            className="hover:before:opacity-0"
            containerProps={{
                className: "p-0",
            }}
        /> */}
      
        <Typography color="blue-gray" className="font-medium">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </Typography>
    </div>
   
</div>
             <div className="checklist-item">
                {/* <Checkbox 
                    id="checkbox-4"
                    ripple={false}
                    className="hover:before:opacity-0"
                    containerProps={{
                    className: "p-0",
                    }}
                /> */}
                <Typography color="blue-gray" className="font-medium">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
                sunt in culpa qui officia deserunt mollit anim id est laborum.
                </Typography>
            </div>
        </div>
    )
}

export default CheckAnswer