// StudentProfile.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';

const StudentProfile = () => {
  const [userProfile, setUserProfile] = useState({});

  useEffect(() => {
    // Fetch user profile data from your Django API
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('YOUR_DJANGO_API_ENDPOINT');
        setUserProfile(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.username}>{userProfile.username}</Text>
      <Text style={styles.tests}>{userProfile.tests}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tests: {
    fontSize: 16,
  },
});

export default StudentProfile;
