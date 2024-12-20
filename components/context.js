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
    const [interactedToday, setInteractedToday] = useState(false);

    const getCurrentDateString = () => {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
      
        return `${day}/${month}/${year}`;
    };

    const calculateDateDifference = (dateString1, dateString2) => {
        const parseDate = (dateString) => {
            const [day, month, year] = dateString.split('/').map(Number);
            return new Date(year, month - 1, day); // Month is zero-indexed
        };
        const date1 = parseDate(dateString1);
        const date2 = parseDate(dateString2);
        
        const differenceInTime = Math.abs(date2.getTime() - date1.getTime());
        const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
        
        return differenceInDays;
    };    

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    const resetPfp = async (uri) => {
        try {
            const response = await axios.post(
                'https://90fa-14-161-6-190.ngrok-free.app/resetPfp',
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

    const editUsernameEmail = async (editedUsername, editedEmail) => {
        try {
            const response = await axios.post(
                'https://90fa-14-161-6-190.ngrok-free.app/editUsernameEmail',
                qs.stringify({
                    username: contextUsername,
                    email: contextEmail,
                    newUsername: editedUsername,
                    newEmail: editedEmail,
                }),
                config
            );
            if (response.status === 200) {
                await AsyncStorage.setItem('updatedUsername', newUsername);
                await AsyncStorage.setItem('updatedEmail', newEmail);
                console.log('Async storage updated');
                console.log(await AsyncStorage.getItem('updatedEmail'));
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

    const setStreakToBackend = async () => {
        if(interactedToday == false)
        {
            let today = getCurrentDateString();
            try {
                const response = await axios.post(
                    'https://90fa-14-161-6-190.ngrok-free.app/setStreak',
                    qs.stringify({
                        username: contextUsername,
                        email: contextEmail,
                        interactionDate: today,
                    }),
                    config
                );
                if (response.status === 200) {
                    let newStreakCount = response.data.newStreak;
                    setStreakCount(newStreakCount);
                    await AsyncStorage.setItem('streak', newStreakCount.toString());
                    await AsyncStorage.setItem('lastInteraction', today);
                    setInteractedToday(true);
                    return true;
                } else {
                    return false;
                }
            } catch (error) {
                console.log('Error saving pfp via API', error);
            }    
        }
        else console.log('Interacted today!');
    }

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

                let updatedUsername = await AsyncStorage.getItem('updatedUsername');
                let updatedEmail = await AsyncStorage.getItem('updatedEmail');

                if (updatedUsername) setContextUsername(updatedUsername);
                else setContextUsername(object.user);

                if (updatedEmail) setContextEmail(updatedEmail);
                else setContextEmail(object.email);

                if(object.pfp !== '') {
                    setPfp(object.pfp);
                    console.log('set up last pfp!');
                }

                let onMachineTimeSpent = await AsyncStorage.getItem('timeSpent');
                if(onMachineTimeSpent) {
                    setTimeSpent(parseInt(onMachineTimeSpent));
                }
                else {
                    setTimeSpent(object.timeSpent);
                    AsyncStorage.setItem('timeSpent', object.timeSpent.toString())
                }

                let onMachineLastInteraction = await AsyncStorage.getItem('lastInteraction');
                if (onMachineLastInteraction) {
                    let currentDate = getCurrentDateString();
                    if(calculateDateDifference(onMachineLastInteraction, currentDate) >= 1)
                    {
                        setStreakCount(1);
                        AsyncStorage.setItem('streak', '1');
                        await setStreakToBackend(getCurrentDateString);
                    }
                    else setInteractedToday(true);
                }

                let onMachineStreak = await AsyncStorage.getItem('streak');
                if(onMachineStreak) setStreakCount(onMachineStreak);
                else {
                    let currentDate = getCurrentDateString();
                    setStreakCount(object.streak);
                    AsyncStorage.setItem('streak', object.streak.toString()); // this becomes onMachineStreak
                    AsyncStorage.setItem('lastInteraction', currentDate);
                }

                if(object.learnedWords !== '') {
                    await importWordsLearned(object.learnedWords, setWordCount);
                }
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
            console.log(currentTimeSpent);
            await axios.post(
                'https://90fa-14-161-6-190.ngrok-free.app/saveTimeSpent',
                qs.stringify({
                    username: contextUsername,
                    email: contextEmail,
                    timeSpent: currentTimeSpent
                }),
                config
            );
            console.log('Saved ' + currentTimeSpent + ' seconds and now have ' + (timeSpent + currentTimeSpent) + ' seconds total.');
            setTimeSpent(lastTimeSpent => lastTimeSpent + currentTimeSpent);
            await AsyncStorage.setItem('timeSpent', (timeSpent + currentTimeSpent).toString());
        } catch (error) {
            console.error("Error saving time spent: ", error);
        }
    };

    const removeContext = async () => {
        setPfp(null);
        setTimeSpent(0);
        setWordCount(0);
        setCourseCount(0);
        setStreakCount(1);
        setInteractedToday(false);
        await clearWordsLearned();
        
        await AsyncStorage.removeItem('timeSpent');
        await AsyncStorage.removeItem('streak');
        await AsyncStorage.removeItem('interactedToday');
    }

    return (
        <GlobalContext.Provider value={{ streakCount, wordCount, setStreakCount, 
        setWordCount, setCourseCount, courseCount, currentCourse, setCurrentCourse, 
        contextUsername, setContextUsername, setContextEmail, contextEmail, timeSpent, pfp, resetPfp,
        setUpContext, saveTimeSpent, isDarkMode, setIsDarkMode, toggleTheme, removeContext, 
        editUsernameEmail, setStreakToBackend, setInteractedToday}}>
            {children}
        </GlobalContext.Provider>
    );
};