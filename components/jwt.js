import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";

export const storeJWT = async (token) => {
  try {
    await AsyncStorage.setItem('token', token);
  } catch (error) {
    console.error('Error storing JWT:', error);
  }
};

export const removeJWT = async () => {
  try {
    await AsyncStorage.removeItem('token');
    console.log('token removed from async storage');
  } catch (error) {
    console.error('Error removing JWT:', error);
  }
}

export const getJWT = async () => {
  try {
    return await AsyncStorage.getItem('token');
  } catch (error) {
    console.error('Error getting JWT:', error);
  }
}

export const decodeJWT = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        return jwtDecode(token);
    } catch (error) {
        console.error('Error decoding: ', error);
    }
}