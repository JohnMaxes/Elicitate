import React, { createContext, useState } from 'react';
import { getLearnedCourseNumber, getLearnedWordNumber, clearWordsLearned, importWordsLearned } from './Database';
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

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    const resetPfp = async (uri) => {
        try {
            const response = await axios.post(
                'https://59db-2402-800-6314-c5d1-35ea-fe23-8d7e-6bf8.ngrok-free.app/resetPfp',
                qs.stringify({
                    username: contextUsername,
                    email: contextEmail,
                    pfp: uri,
                }),
                config
            );
            if (response.status === 200) {
                await AsyncStorage.setItem('pfp', uri);
                setPfp(uri);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.log('Error saving pfp via API', error);
        }
    };

    const toggleTheme = async () => {
        const newTheme = !isDarkMode ? 'dark' : 'light';
        setIsDarkMode(!isDarkMode);
        await AsyncStorage.setItem('theme', newTheme);
    };

    const setUpContext = async () => {
        try {
            setPfp(null);
            let result = await getLearnedWordNumber();
            setWordCount(result.total_words);

            result = await getLearnedCourseNumber();
            setCourseCount(result.total_courses);

            let token = await getJWT();
            if(token) {
                let object = await decodeJWT(token);
                setContextUsername(object.user);
                setContextEmail(object.email);
                if(object.pfp !== '') {
                    setPfp(object.pfp);
                    console.log('set up last pfp!');
                }
                setTimeSpent(object.timeSpent);
                setStreakCount(object.streak);
                if(object.learnedWords !== '') {
                    await importWordsLearned(object.learnedWords, setWordCount);
                }
                setTimeSpent(object.timeSpent);
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
        setTimeSpent(timeSpent + currentTimeSpent);
        try {
            console.log(currentTimeSpent);
            await axios.post(
                'https://59db-2402-800-6314-c5d1-35ea-fe23-8d7e-6bf8.ngrok-free.app/saveTimeSpent',
                qs.stringify({
                    username: contextUsername,
                    email: contextEmail,
                    timeSpent: currentTimeSpent
                }),
                config
            );
            console.log('Saved ' + currentTimeSpent + ' seconds and now have ' + (timeSpent + currentTimeSpent) + ' seconds total.');
        } catch (error) {
            console.error("Error saving time spent: ", error);
        }
    };

    const removeContext = async () => {
        setPfp(null);
        setTimeSpent(0);
        setWordCount(0);
        setCourseCount(0);
        setStreakCount(0);
        await clearWordsLearned();
    }

    return (
        <GlobalContext.Provider value={{ streakCount, wordCount, setStreakCount, 
        setWordCount, setCourseCount, courseCount, currentCourse, setCurrentCourse, 
        contextUsername, contextEmail, timeSpent, pfp, resetPfp,
        setUpContext, saveTimeSpent, isDarkMode, setIsDarkMode, toggleTheme, removeContext }}>
            {children}
        </GlobalContext.Provider>
    );
};