import { Text, View, StyleSheet, Dimensions, TouchableOpacity, Keyboard } from "react-native";
import { useEffect, useState, useRef } from "react";
import { getQuestionToReviewCourse } from "../components/Database";
import * as Progress from 'react-native-progress';
import { Pressable, TapGestureHandler } from "react-native-gesture-handler";
import WordInput from "../components/WordInput";
import { addWordToLearned } from "../components/Database";


const CourseReviewScreen = ({ route }) => {
    const { id } = route.params;
    const [wordList, setWordList] = useState([]);
    const [currentWord, setWord] = useState({});
    const [index, setIndex] = useState(0);

    const [loading, setLoading] = useState(true);
    const [isReading, setIsReading] = useState(true);
    const [checked, setChecked] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const [inputs, setInputs] = useState([]);
    const [finalInput, setFinalInput] = useState('');
    const inputRefs = useRef([]);

    const updateInput = (input) => {
        setFinalInput(input);
    }

    const handleButton = () => {
        if (index < wordList.length - 1) {
            setChecked(true);
            if (finalInput == currentWord.word) {
                setIsCorrect(true);
                addWordToLearned(currentWord.id);
            } else setIsCorrect(false);
        }

        if (checked == true && isCorrect == true) {
            setLoading(true);
            setIsReading(true);
            setFinalInput('');
            setInputs([]);
            setChecked(false);
            setIsCorrect(false)
            inputRefs.current = [];
            setIndex(index + 1);
            setLoading(false);
        }   
    }

    useEffect(() => { // starts when a new ID is passed into the route
        async function fetchCourseWords() {
            setLoading(true);
            const words = await getQuestionToReviewCourse(id);
            setWordList(words);
            if (words.length > 0) {
                setWord(words[0]);
            }
            setLoading(false);
        }
        fetchCourseWords();
    }, [id]);

    useEffect(() => { // changes the currentWord when index is updated via a function
        if (wordList.length > 0) {
            setWord(wordList[index]);
        }
    }, [index]);


    // loading screen: without the loading screen, the screen will load so quickly that 
    // getting wordList is slower than the page rendering, resulting in an error
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
    
    // isReading: meaning that the user is reading the definitions of this one word
    if(isReading)
    return (
        <>
            <Pressable style={styles.vocabScreen} onPress={Keyboard.dismiss}>
                <View style={{alignItems:'center', height: Dimensions.get('window').height * 0.6}}>
                    <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 55 }}>{currentWord.word}</Text>

                    <View style={styles.typeContainer}>
                        <Text style={{ fontFamily: 'Inter-Bold', fontSize: 20, color: 'white' }}>{currentWord.type}</Text>
                    </View>

                    <View style={{ paddingLeft: 30, paddingRight: 30 }}>
                        <Text style={{ textAlign: 'center', marginTop: 10, fontFamily: 'Inter-Regular', fontSize: 20 }}>
                            {currentWord.definition}
                        </Text>
                    </View>                    
                </View>

                <View style={{height: Dimensions.get('window').height * 0.25, justifyContent:'flex-end'}}>
                    <TapGestureHandler 
                    onActivated={() => {
                        setIsReading(false);
                        }}>
                        <TouchableOpacity>
                            <View
                            style={{
                                width: Dimensions.get('window').width * 0.9,
                                height: Dimensions.get('window').height * 0.1,
                                backgroundColor:'#3A94E7',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 45,
                                marginBottom: 100,
                            }}>
                                <Text style={{color:'white', fontFamily:'Inter-Bold', fontSize: 20}}>Next</Text>
                            </View>
                        </TouchableOpacity>
                    </TapGestureHandler>
                </View>
            </Pressable>
        </>
    );

    // isReading is false when the user presses "Next!" and proceeds with the Course
    // this page will make the user validate the word again by making them enter the word
    else if(isReading === false)
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

export default CourseReviewScreen;