import React from "react";
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
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => setOpen(!open);

    return (
        <>
            <Button onClick={handleOpen} variant="gradient">
                {dialogBtnText}
            </Button>
            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>{dialogHeading}</DialogHeader>
                <DialogBody>
                    {dialogText}
                    <Input label="Test Link" />
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
                    <Button variant="gradient" color="green" onClick={handleOpen}>
                        <span>{dialogConfirmBtnText || "Confirm"}</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}

export default DialogBox;