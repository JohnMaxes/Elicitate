import { Text, View, StyleSheet, Dimensions, TouchableOpacity, Keyboard } from "react-native";
import React, { useEffect, useState, useRef, useContext } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { getQuestionToReviewCourse } from "../components/Database";
import * as Progress from 'react-native-progress';
import { Pressable, TapGestureHandler } from "react-native-gesture-handler";
import WordInput from "../components/WordInput";
import { addWordToLearned } from "../components/Database";
import { GlobalContext } from "../components/context";

const CourseReviewScreen = ({ route, navigation }) => {
    const { id } = route.params;
    const [wordList, setWordList] = useState([]);
    const [currentWord, setWord] = useState(null);
    const [index, setIndex] = useState(0);

    const [loading, setLoading] = useState(true);
    const [isReading, setIsReading] = useState(true);
    const [checked, setChecked] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [empty, setEmpty] = useState(false);
    const [finished, setFinished] = useState(false);

    const [inputs, setInputs] = useState([]);
    const [finalInput, setFinalInput] = useState('');
    const inputRefs = useRef([]);

    const [seconds, setSeconds] = useState(0);
    const { saveTimeSpent, isDarkMode, setStreakToBackend } = useContext(GlobalContext);
    const secondsRef = useRef(seconds);

    const styles = getStyles(isDarkMode);

    useFocusEffect(
        React.useCallback(() => {
            const intervalId = setInterval(() => {
                setSeconds(prevSeconds => {
                    secondsRef.current = prevSeconds + 1;
                    return secondsRef.current;
                });
            }, 1000);

            return () => {
                const currentSeconds = secondsRef.current; // Use the ref to get the latest seconds
                saveTimeSpent(currentSeconds); // Call saveTimeSpent
                setSeconds(0); // Reset seconds
                clearInterval(intervalId); // Clear the interval
            };
        }, [])
    );

    const updateInput = (input) => {
        setFinalInput(input);
    }

    const handleButton = () => {
        if (index < wordList.length) {
            if (checked) {
                if (isCorrect) {
                    if (index === wordList.length - 1) {
                        // If the current word is the last one and is correct, finish the review
                        setFinished(true);
                    } else {
                        setLoading(true);
                        setIsReading(true);
                        setFinalInput('');
                        setInputs([]);
                        setChecked(false);
                        setIsCorrect(false);
                        inputRefs.current = [];
                        setIndex(index + 1);
                        setLoading(false);
                    }
                } else {
                    setChecked(false);
                    setInputs(Array(currentWord.word.length).fill(''));
                    setFinalInput('');
                    inputRefs.current.forEach(ref => ref && ref.clear());
                    if (inputRefs.current[0]) {
                        inputRefs.current[0].focus();
                    }
                }
            } else {
                setChecked(true);
                if (finalInput === currentWord.word) {
                    setIsCorrect(true);
                    addWordToLearned(currentWord.id);
                } else {
                    setIsCorrect(false);
                }
            }
        } else {
            setFinished(true);
        }
    }

    useEffect(() => {
        async function fetchCourseWords() {
            setLoading(true);
            const words = await getQuestionToReviewCourse(id);
            console.log(words);
            setWordList(words);
            if (words.length > 0) {
                setWord(words[0]);
                await setStreakToBackend();
            } else {
                setEmpty(true);
            }
            setLoading(false);
        }
        fetchCourseWords();
    }, [id]);

    useEffect(() => { // changes the currentWord when index is updated via a function
        if (wordList.length > 0 && index < wordList.length) {
            setWord(wordList[index]);
        }
    }, [index, wordList]);

    // loading screen: without the loading screen, the screen will load so quickly that 
    // getting wordList is slower than the page rendering, resulting in an error
    if ((loading || !currentWord) && !empty)
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <Progress.Circle
                    indeterminate={true}
                    color={isDarkMode ? '#70b6bb' : '#3A94E7'}
                    size={30}
                />
            </View>
        )

    if (finished)
        return (
            <View style={styles.vocabScreen}>
                <View style={{ alignItems: 'center', height: Dimensions.get('window').height * 0.3 }}>
                    <Text style={{ textAlign: 'center', fontFamily: 'Poppins-Bold', fontSize: 30, paddingLeft: 30, paddingRight: 30, color: isDarkMode ? 'white' : 'black' }}>You're finished here! Hooray!</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <View
                        style={{
                            width: Dimensions.get('window').width * 0.5,
                            height: Dimensions.get('window').height * 0.07,
                            backgroundColor: 'green',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 45,
                        }}>
                        <Text style={{ color: 'white', fontFamily: 'Inter-Bold', fontSize: 20 }}>
                            Complete
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        )

    if (empty)
        return (
            <View style={styles.vocabScreen}>
                <View style={{ alignItems: 'center', height: Dimensions.get('window').height * 0.6 }}>
                    <Text style={{ textAlign: 'center', fontFamily: 'Poppins-Bold', fontSize: 30, paddingLeft: 30, paddingRight: 30, color: isDarkMode ? 'white' : 'black' }}>You've not learned anything yet!</Text>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <View
                            style={{
                                width: Dimensions.get('window').width * 0.5,
                                height: Dimensions.get('window').height * 0.07,
                                backgroundColor: isDarkMode ? '#4f55b4' : '#047cfc',
                                marginTop: Dimensions.get('window').width * 0.1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 45,
                            }}>
                            <Text style={{ color: 'white', fontFamily: 'Inter-Bold', fontSize: 20 }}>
                                Return
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )

    // isReading: meaning that the user is reading the definitions of this one word
    if (isReading)
        return (
            <Pressable style={styles.vocabScreen} onPress={Keyboard.dismiss}>
                <View style={{ alignItems: 'center', height: Dimensions.get('window').height * 0.6 }}>
                    <Text style={styles.wordText}>{currentWord.word}</Text>

                    <View style={styles.typeContainer}>
                        <Text style={styles.typeText}>{currentWord.type}</Text>
                    </View>

                    <View style={{ padding: 10 }}>
                        <Text style={styles.definitionText}>
                            {currentWord.definition}
                        </Text>
                    </View>
                </View>

                <View style={styles.nextButtonContainer}>

                    <TouchableOpacity>
                        <TapGestureHandler
                            onActivated={() => {
                                setIsReading(false);
                            }}>
                            <View style={styles.nextButton}>
                                <Text style={styles.nextButtonText}>Next</Text>
                            </View>

                        </TapGestureHandler>
                    </TouchableOpacity>
                </View>
            </Pressable>
        );

    // isReading is false when the user presses "Next!" and proceeds with the Course
    // this page will make the user validate the word again by making them enter the word
    if (isReading === false)
        return (
            <Pressable style={styles.vocabScreen} onPress={Keyboard.dismiss}>
                <View style={{ alignItems: 'center', height: Dimensions.get('window').height * 0.6 }}>
                    <Text style={styles.definitionText}>{currentWord.definition}</Text>

                    <View style={styles.typeContainer}>
                        <Text style={styles.typeText}>{currentWord.type}</Text>
                    </View>

                    <View style={{ paddingLeft: 30, paddingRight: 30 }}>
                        <Text style={styles.questionText}>What's the word?</Text>
                    </View>
                    <WordInput value={currentWord.word} inputField={inputs} inputSetter={setInputs} reference={inputRefs} Function={updateInput} />

                </View>

                <View style={styles.checkButtonContainer}>
                    <TouchableOpacity>
                        <TapGestureHandler
                            onActivated={handleButton}>
                            <View style={[styles.checkButton, { backgroundColor: checked ? (isCorrect ? 'green' : 'red') : (isDarkMode ? '#70b6bb' : '#3A94E7') }]}>
                                <Text style={styles.checkButtonText}>{checked ? isCorrect ? 'Go to next word!' : 'Enter again!' : 'Check answers'}</Text>
                            </View>
                        </TapGestureHandler>
                    </TouchableOpacity>
                </View>
            </Pressable>
        )
}

const getStyles = (isDarkMode) => StyleSheet.create({
    vocabScreen: {
        paddingTop: Dimensions.get('window').height * 0.15,
        flex: 1,
        alignItems: 'center',
        backgroundColor: isDarkMode ? '#1c294a' : '#CCE6FA',
    },
    typeContainer: {
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#7949FF',
        borderRadius: 15,
    },
    wordText: {
        fontFamily: 'Poppins-Bold',
        fontSize: 55,
        color: isDarkMode ? 'white' : 'black',
    },
    typeText: {
        fontFamily: 'Inter-Bold',
        fontSize: 20,
        color: 'white',
    },
    definitionText: {
        textAlign: 'center',
        marginTop: 10,
        fontFamily: 'Inter-Bold',
        fontSize: 35,
        color: isDarkMode ? 'white' : 'black',
    },
    questionText: {
        textAlign: 'center',
        marginTop: 10,
        fontFamily: 'Inter-Regular',
        fontSize: 20,
        color: isDarkMode ? 'white' : 'black',
    },
    nextButtonContainer: {
        height: Dimensions.get('window').height * 0.25,
        justifyContent: 'flex-end',
    },
    nextButton: {
        width: Dimensions.get('window').width * 0.5,
        height: Dimensions.get('window').height * 0.07,
        marginBottom: Dimensions.get('window').height * 0.3,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 45,
        backgroundColor: '#3A94E7',
    },
    nextButtonText: {
        color: 'white',
        fontFamily: 'Inter-Bold',
        fontSize: 20,
    },
    checkButtonContainer: {
        height: Dimensions.get('window').height * 0.25,
        justifyContent: 'flex-end',
    },
    checkButton: {
        width: Dimensions.get('window').width * 0.5,
        height: Dimensions.get('window').height * 0.07,
        marginBottom: Dimensions.get('window').height * 0.3,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 45,
    },
    checkButtonText: {
        color: 'white',
        fontFamily: 'Inter-Bold',
        fontSize: 20,
    },
});

export default CourseReviewScreen;