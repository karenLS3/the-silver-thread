import axios from './axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAccessToken = async () => {
    let accessToken = await AsyncStorage.getItem('accessToken');
    const refreshToken = await AsyncStorage.getItem('refreshToken');

    try {
        const response = await axios.post('/token/refresh/', { refresh: refreshToken });
        accessToken = response.data.access;
        await AsyncStorage.setItem('accessToken', accessToken);
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
    }

    return accessToken;
};
