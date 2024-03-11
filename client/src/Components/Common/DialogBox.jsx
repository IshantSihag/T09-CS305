import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input
} from "@material-tailwind/react";

const DialogBox = ({
    dialogBtnText, dialogHeading, dialogText, dialogConfirmBtnText 
}) => {
    const [open, setOpen] = useState(false);
    const [testLink, setTestLink] = useState("");

    const handleOpen = () => setOpen(!open);

    const handleSubmitLink = (e) => {
        e.preventDefault();
        if (!testLink) return ;
        
        // TODO: make API request 
    };

    return (
        <>
            <Button onClick={handleOpen} variant="gradient">
                {dialogBtnText}
            </Button>
            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>{dialogHeading}</DialogHeader>
                <DialogBody>
                    {dialogText}
                    <Input 
                        label="Test Link" 
                        value={testLink}
                        onChange={(e) => setTestLink(e.target.value)}  
                        required={true}  
                    />
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={handleOpen}
                        className="mr-1"
                    >
                        <span>Cancel</span>
                    </Button>
                    <Button variant="gradient" color="green" onClick={(e) => handleSubmitLink(e)}>
                        <span>{dialogConfirmBtnText || "Confirm"}</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}

export default DialogBox;