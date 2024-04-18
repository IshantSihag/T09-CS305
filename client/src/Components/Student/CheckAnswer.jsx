import React from 'react'
import { 
    Checkbox, Typography
} from "@material-tailwind/react";

//css 
import "./DetailedAnalysisPage.css";

const CheckAnswer = ({}) => {
    return (
        <div className="checklist">
                  <div style={{border: '', padding: '10px'}}>
            {/* <p style={{color: 'red', fontWeight: 'bold'}}>Your Answer</p> */}
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
            Option A
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
                    Option B
                </Typography>
            </div>
            <div style={{border: '2px solid green', padding: '10px'}}>
            <p style={{color: 'green', fontWeight: 'bold'}}>Your Answer</p>
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
        Option C
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
                Option D
                </Typography>
            </div>
        </div>
    )
}

export default CheckAnswer