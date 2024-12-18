import { Text, View, StyleSheet, Dimensions, TouchableOpacity, Keyboard } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState, useRef, useContext } from "react";
import { getQuestionToReviewVocab } from "../components/Database";
import * as Progress from 'react-native-progress';
import { Pressable, TapGestureHandler } from "react-native-gesture-handler";
import WordInput from "../components/WordInput";
import { addWordToLearned } from "../components/Database";
import { GlobalContext } from "../components/context";

const VocabReviewScreen = ({ navigation }) => {
    const [wordList, setWordList] = useState([]);
    const [currentWord, setWord] = useState({});
    const [index, setIndex] = useState(0);

    const [loading, setLoading] = useState(true);
    const [checked, setChecked] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [finished, setFinished] = useState(false);

    const [inputs, setInputs] = useState([]);
    const [finalInput, setFinalInput] = useState('');
    const inputRefs = useRef([]);

    const [empty, setEmpty] = useState(false);

    const [seconds, setSeconds] = useState(0);
    const { saveTimeSpent, isDarkMode, setStreakToBackend} = useContext(GlobalContext);
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
                } else {
                    setIsCorrect(false);
                }
            }
        }
        console.log(checked);
    }

    useEffect(() => {
        async function fetchVocabReview() {
            setLoading(true);
            const words = await getQuestionToReviewVocab();
            setWordList(words);
            if (words.length > 0) {
                setEmpty(false);
                setWord(words[0]);
                await setStreakToBackend();
            }
            else setEmpty(true);
            setLoading(false);
        }
        fetchVocabReview();
    }, []);

    useEffect(() => { // changes the currentWord when index is updated via a function
        if (wordList.length > 0) {
            setWord(wordList[index]);
        }
    }, [index]);

    if (loading)
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <Progress.Circle
                    indeterminate={true}
                    color={isDarkMode ? '#70b6bb' : '#3A94E7'}
                    size={30}
                />
            </View>
        )

    if (empty == true)
        return (
            <View style={styles.vocabScreen}>
                <View style={{ alignItems: 'center', height: Dimensions.get('window').height * 0.6 }}>
                    <Text style={{ textAlign: 'center', fontFamily: 'Poppins-Bold', fontSize: 30, paddingLeft: 30, paddingRight: 30, color: isDarkMode ? 'white' : 'black' }}>You've not learned anything yet!</Text>
                </View>
            </View>
        )

    if (finished)
        return (
            <View style={styles.vocabScreen}>
                <View style={{ alignItems: 'center', height: Dimensions.get('window').height * 0.6 }}>
                    <Text style={{ textAlign: 'center', fontFamily: 'Poppins-Bold', fontSize: 30, paddingLeft: 30, paddingRight: 30, color: isDarkMode ? 'white' : 'black' }}>
                        You're finished here! Hooray!
                    </Text>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <View
                            style={{
                                width: Dimensions.get('window').width * 0.5,
                                height: Dimensions.get('window').height * 0.07,
                                backgroundColor: 'green',
                                marginTop: Dimensions.get('window').width * 0.1,
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
            </View>
        )

    return (
        <>
            <Pressable style={styles.vocabScreen} onPress={Keyboard.dismiss}>
                <View style={{ alignItems: 'center', minHeight: Dimensions.get('window').height * 0.3 }}>
                    <Text style={{ textAlign: 'center', fontFamily: 'Poppins-Bold', fontSize: 30, paddingLeft: 30, paddingRight: 30, color: isDarkMode ? 'white' : 'black' }}>{currentWord.definition}</Text>

                    <View style={styles.typeContainer}>
                        <Text style={{ fontFamily: 'Inter-Bold', fontSize: 20, color: 'white' }}>{currentWord.type}</Text>
                    </View>

                    <View style={{ paddingLeft: 30, paddingRight: 30 }}>
                        <Text style={{ textAlign: 'center', marginTop: 10, fontFamily: 'Inter-Regular', fontSize: 20, color: isDarkMode ? 'white' : 'black' }}>
                            What's the word?
                        </Text>
                    </View>
                    <WordInput value={currentWord.word} inputField={inputs} inputSetter={setInputs} reference={inputRefs} Function={updateInput} />
                </View>

                <View style={{ justifyContent: 'flex-end' }}>
                    {checked ?
                        (<View style={{ alignItems: 'center' }}>
                            <Text style={{ fontFamily: 'Inter-Bold', fontSize: 20, color: isDarkMode ? 'white' : 'black' }}>Answer: {currentWord.word}</Text>
                        </View>)
                        :
                        (null)}
                    <TapGestureHandler
                        onActivated={handleButton}>
                        <TouchableOpacity>
                            <View
                                style={{
                                    width: Dimensions.get('window').width * 0.5,
                                    minHeight: Dimensions.get('window').height * 0.08,
                                    backgroundColor: checked ? (isCorrect ? 'green' : 'red') : (isDarkMode ? '#70b6bb' : '#3A94E7'),
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 45,
                                    margin: Dimensions.get('window').height * 0.1,
                                }}>
                                <Text style={{ color: 'white', fontFamily: 'Inter-Bold', fontSize: 20 }}>{checked ? isCorrect ? 'Go to next word!' : 'Enter again!' : 'Check answers'}</Text>
                            </View>
                        </TouchableOpacity>
                    </TapGestureHandler>
                </View>
            </Pressable>
        </>
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
});

export default VocabReviewScreen;