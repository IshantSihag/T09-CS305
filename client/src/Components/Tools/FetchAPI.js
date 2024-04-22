import React, { useState, useEffect } from "react";
import Cookies from 'js-cookie';
const fetchAPI = async (url, data, method, isTokenRequired = true) => {
    const headers = {
      'Content-Type': 'application/json',
    };
  
    // Check if the token is required and available in localStorage
    if (isTokenRequired && Cookies.get('access')) {
      headers['Authorization'] = `Bearer ${Cookies.get('access')}`;
    }
  
    let options = {
      method: method,
      headers: headers,
      body: JSON.stringify(data),
    };
  
    if (method === 'GET') {
      options = {
        method: method,
        headers: headers,
      };
    }
  
    return fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
      });
  };
  

export default fetchAPI;
