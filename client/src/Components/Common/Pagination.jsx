import React from 'react'
import { 
    Button, IconButton
} from "@material-tailwind/react";

import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

const Pagination = ({
    total, currentIndex, setCurrentIndex
}) => {
    const getItemProps = (index) => ({
        variant: currentIndex === index ? "filled" : "text",
        color: "gray",
        onClick: () => setActive(index),
    });
  
    const next = () => {
        if (currentIndex === total) return;
        setCurrentIndex(currentIndex + 1);
    };
  
    const prev = () => {
        if (currentIndex === 1) return;
        setCurrentIndex(currentIndex - 1);
    };
    
    return (
        <div className="flex items-center gap-4">
        <Button
            variant="text"
            className="flex items-center gap-2"
            onClick={prev}
            disabled={currentIndex === 1}
        >
            <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
        </Button>
        <div className="flex items-center gap-2">
            {
                currentIndex <= total ?
                <IconButton {...getItemProps(currentIndex)}>{currentIndex}</IconButton> : 
                <IconButton color="gray" variant="text"></IconButton>
            }
            {
                currentIndex <= total-1 ? 
                <IconButton {...getItemProps(currentIndex+1)}>{(currentIndex+1)}</IconButton> : 
                <IconButton color="gray" variant="text"></IconButton>
            }
            {
                currentIndex <= total-2 ? 
                <IconButton {...getItemProps(currentIndex+2)}>{(currentIndex+2)}</IconButton> : 
                <IconButton color="gray" variant="text"></IconButton>
            }
            {
                currentIndex <= total-3 ? 
                <IconButton {...getItemProps(currentIndex+3)}>{(currentIndex+3)}</IconButton> : 
                <IconButton color="gray" variant="text"></IconButton>
            }
            { 
                currentIndex <= total-4 ? 
                <IconButton {...getItemProps(currentIndex+4)}>{(currentIndex+4)}</IconButton> : 
                <IconButton color="gray" variant="text"></IconButton>
            }
        </div>
        <Button
            variant="text"
            className="flex items-center gap-2"
            onClick={next}
            disabled={currentIndex === total}
        >
            Next
            <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
        </Button>
        </div>
    );
}

export default Pagination