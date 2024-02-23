import React, { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import 'firebase/storage';


const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};


const firebaseApp = initializeApp(firebaseConfig);
const uploadFileToStorage = async (fileData, filePath, fileName) => {
    try {
        const storage = getStorage(firebaseApp); // Get Firebase Storage instance
        const storageRef = ref(storage, `${filePath}/${fileName}`);
        await uploadBytes(storageRef, fileData);
        // can be retrieved from the console of google firebase
        const accessToken = 'feee26d1-dab5-4057-af31-728eecd35313';

        const url = await getDownloadURL(storageRef, accessToken);


        return url; // Return the URL for further use
    } catch (error) {
        console.error('Error uploading file:', error);
        return null; // Return null in case of an error
    }
};


export { uploadFileToStorage }
