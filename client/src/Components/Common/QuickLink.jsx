import React, { useEffect, useState } from 'react'
import { 
    IconButton
} from "@material-tailwind/react";

import "../../styles/QuickLink.css";

const QuickLink = ({
    total, currentIndex, setCurrentIndex, setOpen
}) => {
    
    const [quickLinksArr, setQuickLinksArr] = useState([]);
    useEffect(() => {
        const arr = [];
        for (let k=1; k<=total; k++) {
            arr.push(k);
        } 
        setQuickLinksArr(arr);
    }, []);  

    const getItemProps = (index) => ({
        variant: currentIndex === index ? "filled" : "text",
        color: "gray",
        onClick: () => {
            setOpen(false);
            setCurrentIndex(index);
        }    
    });

    return (
    <div className='quick-links'>
        {quickLinksArr.reduce((acc, link, index) => {
            const chunkIndex = Math.floor(index / 5);
    
            if (!acc[chunkIndex]) {
                acc[chunkIndex] = []; 
            }
    
            acc[chunkIndex].push(
                <IconButton {...getItemProps(link)} key={index}>{link}</IconButton>
            );
    
            return acc;
        }, []).map((chunk, index) => (
            <div className='quick-link-row' key={index}>
                {chunk}
            </div>
        ))}
    </div>
    
  )
}

export default QuickLink