import React, { createContext, useState, useEffect } from 'react';
import { getLearnedCourseNumber, getLearnedWordNumber } from './Database';
import { getJWT, decodeJWT, removeJWT } from './jwt';

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
    const [pfp, setPfp] = useState('');

    const setUpContext = async () => {
        try {
            let result = await getLearnedWordNumber();
            setWordCount(result.total_words);
            setStreakCount(15);

            result = await getLearnedCourseNumber();
            setCourseCount(result.total_courses);

            let object = await decodeJWT(await getJWT());
            setContextUsername(object.user);
            setContextEmail(object.email);
            console.log(contextUsername);
        }
        catch (error) {
            console.log('Error setting up context!');
            console.log(error);
        }  
    }

    const removeContext = async () => {
        try {
            await removeJWT();
        } catch (error) {
            console.log('Error removing JWT');
            console.log(error);
        }
    }

    return (
        <GlobalContext.Provider value={{ streakCount, wordCount, setStreakCount, 
        setWordCount, setCourseCount, courseCount, currentCourse, setCurrentCourse, 
        contextUsername, contextEmail,
        setUpContext, removeContext }}>
            {children}
        </GlobalContext.Provider>
    );
};