import React, { useEffect, useRef } from 'react';
import Cookies from 'js-cookie';

const WebcamCapture = () => {
    const videoRef = useRef(null);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then((stream) => {
                    if (videoRef.current) videoRef.current.srcObject = stream;
                })
                .catch((err) => {
                    console.error("Error accessing the webcam: ", err);
                });
        }

        intervalRef.current = setInterval(() => {
            captureImage();
        }, 15000);

        return () => {
            clearInterval(intervalRef.current);
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const captureImage = () => {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(blob => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                const base64data = reader.result;
                sendImageToBackend(base64data);
            };
        }, 'image/jpeg');
    };

    const sendImageToBackend = async (imageStr) => {
        const formData = new FormData();
        formData.append('image', imageStr);

        try {
            const access = Cookies.get("access");

            const response = await fetch(`${process.env.REACT_APP_API_URL}/verifyUser`, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${access}`
                },
                body: formData,
            });
            if (response.ok) {
                const data = await response.json();
                if (data.ok) {
                    console.log('Image sent successfully');
                } else {
                    console.log(`Error(sending-image) : ${data.error}`);
                }
            } else {
                console.error('Error(sending-image) : Failed to send image');
            }
        } catch (err) {
            console.error('Error sending image to backend: ', err.message);
        }
    };

    return <video ref={videoRef} autoPlay playsInline
        // style={{ display: "none" }}
    />

};

export default WebcamCapture;
