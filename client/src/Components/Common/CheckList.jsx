import React from 'react'
import { 
    Checkbox, Typography
} from "@material-tailwind/react";

//css 
import "../../styles/AttemptTest.css";

const CheckList = ({}) => {
    return (
        <div className="checklist">
            <div className="checklist-item">
                <Checkbox 
                    id="checkbox-1"
                    ripple={true}
                    className="hover:before:opacity-0"
                    containerProps={{
                    className: "p-0",
                    }}
                />
                <Typography color="blue-gray" className="font-medium">
                    React.js
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </Typography>
            </div>
            <div className="checklist-item">
                <Checkbox 
                    id="checkbox-2"
                    ripple={false}
                    className="hover:before:opacity-0"
                    containerProps={{
                    className: "p-0",
                    }}
                />
                <Typography color="blue-gray" className="font-medium">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                </Typography>
            </div>
            <div className="checklist-item">
                <Checkbox 
                    id="checkbox-3"
                    ripple={false}
                    className="hover:before:opacity-0"
                    containerProps={{
                    className: "p-0",
                    }}
                />
                <Typography color="blue-gray" className="font-medium">
                    Duis aute irure dolor in reprehenderit in 
                    voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                </Typography>
            </div>
            <div className="checklist-item">
                <Checkbox 
                    id="checkbox-4"
                    ripple={false}
                    className="hover:before:opacity-0"
                    containerProps={{
                    className: "p-0",
                    }}
                />
                <Typography color="blue-gray" className="font-medium">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
                sunt in culpa qui officia deserunt mollit anim id est laborum.
                </Typography>
            </div>
        </div>
    )
}

export default CheckList