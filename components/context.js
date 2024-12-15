import React, { createContext, useState } from 'react';
import { getLearnedCourseNumber, getLearnedWordNumber } from './Database';
import { getJWT, decodeJWT, removeJWT } from './jwt';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import qs from 'qs';

// KHÔNG ĐƯỢC SET useEffect Ở ĐÂY
// MUỐN KHỞI TẠO FIRST TIME THÌ XÀI SETTER SET NÓ TRONG useEffect CỦA SCREEN CẦN XÀI CONTEXT
export const GlobalContext = createContext();
export const Context = ({ children }) => {
    const [streakCount, setStreakCount] = useState(0);
    const [wordCount, setWordCount] = useState(0);
    const [currentCourse, setCurrentCourse] = useState(null);
    const [courseCount, setCourseCount] = useState(0);
    const [contextUsername, setContextUsername] = useState('');
    const [contextEmail, setContextEmail] = useState('');
    const [timeSpent, setTimeSpent] = useState(0);
    const [pfp, setPfp] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const resetPfp = async (base64string) => {
        try {
            const config = {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            const response = await axios.post(
              'https://e283-113-161-81-171.ngrok-free.app/resetPfp',
              qs.stringify({
                  username: contextUsername,
                  email: contextEmail,
                  pfp: base64string,
              }),
              config
            );
    
            if (response.status === 200) {
                await AsyncStorage.setItem('pfp', base64string);
                setPfp(base64string);
                return true;
            } else {
                setPfp(base64string)
                return false;
            }
          } catch (error) {
            console.log('Error saving pfp via API', error);
            setPfp(base64string);
        };    
    }

    const toggleTheme = async () => {
        const newTheme = !isDarkMode ? 'dark' : 'light';
        setIsDarkMode(!isDarkMode);
        await AsyncStorage.setItem('theme', newTheme);
    };

    const setUpContext = async () => {
        try {
            let result = await getLearnedWordNumber();
            setWordCount(result.total_words);
            setStreakCount(15);

            result = await getLearnedCourseNumber();
            setCourseCount(result.total_courses);

            let token = await getJWT();
            if(token) {
                console.log(token);
                let object = await decodeJWT(token);
                console.log('Username: ' + object.user);
                console.log('Email: ' + object.email);
                setContextUsername(object.user);
                setContextEmail(object.email);

                if(object.pfp !== undefined) {
                    await AsyncStorage.setItem('pfp', object.pfp);
                    setPfp(object.pfp);
                }
                
                const time = await AsyncStorage.getItem('timeSpent');
                if( time !== null) setTimeSpent(parseInt(time));
                else AsyncStorage.setItem('timeSpent', '0');    
            }

            const savedTheme = await AsyncStorage.getItem('theme');
            if (savedTheme) {
                setIsDarkMode(savedTheme === 'dark');
            }

        }
        catch (error) {
            console.log('Error setting up context!');
            console.log(error);
        }  
    }

    const saveTimeSpent = async (currentTimeSpent) => {
        try {
            const existingTimeSpent = await AsyncStorage.getItem('timeSpent');
            const newTotalTimeSpent = existingTimeSpent 
                ? parseInt(existingTimeSpent) + currentTimeSpent 
                : currentTimeSpent;
            setTimeSpent(newTotalTimeSpent)
            await AsyncStorage.setItem('timeSpent', newTotalTimeSpent.toString());
            console.log('Saved ' + currentTimeSpent + ' seconds and now have ' + newTotalTimeSpent + ' seconds total.');
        } catch (error) {
            console.error("Error saving time: ", error);
        }
    };

    return (
        <GlobalContext.Provider value={{ streakCount, wordCount, setStreakCount, 
        setWordCount, setCourseCount, courseCount, currentCourse, setCurrentCourse, 
        contextUsername, contextEmail, timeSpent, pfp, resetPfp,
        setUpContext, saveTimeSpent, isDarkMode, toggleTheme }}>
            {children}
        </GlobalContext.Provider>
    );
};