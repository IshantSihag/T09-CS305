import React, { useState, useRef } from "react";
import FaceDetector from "./FaceDetector";

export default function CountFaces() {
    const [stream, setStream] = useState(null);
    const videoRef = useRef();

    const handleStart = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(stream);
    };

    const handleStop = () => {
        stream.getTracks().forEach((track) => {
            track.stop();
        });
        setStream(null);
    };

    return (
        <div>
            <h1>Face Detection</h1>
            <div>
                <button onClick={handleStart}>Start</button>
                <button onClick={handleStop}>Stop</button>
            </div>
            <div>
                <video ref={videoRef} autoPlay />
            </div>
            <div>
                {stream && <FaceDetector stream={stream}/>}
            </div>
        </div>
    );
}