import { Text, View, StyleSheet, Dimensions, TouchableOpacity, Keyboard } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { useEffect, useState, useRef } from "react";
import { getQuestionToReviewVocab } from "../components/Database";
import * as Progress from 'react-native-progress';
import { Pressable, TapGestureHandler } from "react-native-gesture-handler";
import WordInput from "../components/WordInput";
import { addWordToLearned } from "../components/Database";


const VocabReviewScreen = () => {
    const [wordList, setWordList] = useState([]);
    const [currentWord, setWord] = useState({});
    const [index, setIndex] = useState(0);

    const [loading, setLoading] = useState(true);
    const [checked, setChecked] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const [inputs, setInputs] = useState([]);
    const [finalInput, setFinalInput] = useState('');
    const inputRefs = useRef([]);

    const [empty, setEmpty] = useState(false);

    const updateInput = (input) => {
        setFinalInput(input);
    }

    const handleButton = () => {
        if (index < wordList.length) {
            setChecked(true);
            if (finalInput == currentWord.word) {
                setIsCorrect(true);
            } else setIsCorrect(false);
        }

        if (checked == true && isCorrect == true) {
            setLoading(true);
            setFinalInput('');
            setInputs([]);
            setChecked(false);
            setIsCorrect(false)
            inputRefs.current = [];
            setIndex(index + 1);
            setLoading(false);
        }
        console.log(checked);
    }

    useEffect(() => {
        async function fetchVocabReview() {
            setLoading(true);
            const words = await getQuestionToReviewVocab();
            setWordList(words);
            console.log(words.length);
            if (words.length > 0) {
                setEmpty(false);
                setWord(words[0]);
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
                color="#3A94E7"
                size={30}
            />
        </View>
    )

    if (empty == true)
    return(
        <View style={styles.vocabScreen}>
            <View style={{alignItems:'center', height: Dimensions.get('window').height * 0.6}}>
                <Text style={{ textAlign: 'center', fontFamily: 'Poppins-Bold', fontSize: 30, paddingLeft: 30, paddingRight:30 }}>You've not learned anything yet!</Text>
            </View>
        </View>
    )

    return(
        <>
            <Pressable style={styles.vocabScreen} onPress={Keyboard.dismiss}>
                <View style={{alignItems:'center', height: Dimensions.get('window').height * 0.6}}>
                    <Text style={{ textAlign: 'center', fontFamily: 'Poppins-Bold', fontSize: 30, paddingLeft: 30, paddingRight:30 }}>{currentWord.definition}</Text>

                    <View style={styles.typeContainer}>
                        <Text style={{ fontFamily: 'Inter-Bold', fontSize: 20, color: 'white' }}>{currentWord.type}</Text>
                    </View>

                    <View style={{ paddingLeft: 30, paddingRight: 30 }}>
                        <Text style={{ textAlign: 'center', marginTop: 10, fontFamily: 'Inter-Regular', fontSize: 20 }}>
                            What's the word?
                        </Text>
                    </View>
                    <WordInput value={currentWord.word} inputField={inputs} inputSetter={setInputs} reference={inputRefs} Function={updateInput}/>                    
                </View>

                <View style={{height: Dimensions.get('window').height * 0.25, justifyContent:'flex-end'}}>
                    {checked ? 
                    (<View style={{alignItems:'center'}}>
                        <Text style={{fontFamily:'Inter-Bold', fontSize: 20,}}>Answer: {currentWord.word}</Text>
                    </View>) 
                    : 
                    (null)}
                    <TapGestureHandler 
                    onActivated={handleButton}>
                        <TouchableOpacity>
                            <View
                            style={{
                                width: Dimensions.get('window').width * 0.9,
                                height: Dimensions.get('window').height * 0.1,
                                backgroundColor: checked? (isCorrect ? 'green' : 'red') : '#3A94E7',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 45,
                                marginBottom: 100,
                            }}>
                                <Text style={{color:'white', fontFamily:'Inter-Bold', fontSize: 20}}>{checked ? isCorrect ? 'Go to next word!' : 'Enter again!' : 'Check answers'}</Text>
                            </View>
                        </TouchableOpacity>
                    </TapGestureHandler>
                </View>
            </Pressable>
        </>
    )
}

const styles = StyleSheet.create({
    vocabScreen: {
        paddingTop: Dimensions.get('window').height * 0.15,
        flex:1,
        alignItems: 'center',
        backgroundColor: '#CCE6FA',
    },
    typeContainer: {
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#7949FF',
        borderRadius: 15,
    },
});

// <WordInput value={currentWord.word} inputField={inputs} inputSetter={setInputs} reference={inputRefs} Function={updateInput}/>

export default VocabReviewScreen;