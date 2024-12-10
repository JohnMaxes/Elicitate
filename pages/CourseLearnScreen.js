import { Text, View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { getQuestionToLearn } from "../components/Database";
import * as Progress from 'react-native-progress';
import { TapGestureHandler } from "react-native-gesture-handler";

const CourseLearnScreen = ({ route }) => {
    const { id } = route.params;
    const [wordList, setWordList] = useState([]);
    const [currentWord, setWord] = useState({});
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCourseWords() {
            setLoading(true);
            const words = await getQuestionToLearn(id);
            setWordList(words);
            if (words.length > 0) {
                setWord(words[0]);
            }
            setLoading(false);
        }
        fetchCourseWords();
    }, [id]);

    useEffect(() => {
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
    
    return (
        <>
            <View style={styles.vocabScreen}>
                <View style={{alignItems:'center', height: Dimensions.get('window').height * 0.6}}>
                    <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 55 }}>{currentWord.word}</Text>

                    <View style={styles.typeContainer}>
                        <Text style={{ fontFamily: 'Inter-Bold', fontSize: 20, color: 'white' }}>{currentWord.type}</Text>
                    </View>

                    <View style={{ paddingLeft: 30, paddingRight: 30 }}>
                        <Text style={{ textAlign: 'center', marginTop: 10, fontFamily: 'Inter-Regular', fontSize: 20 }}>
                            {currentWord.definition}
                        </Text>
                        <Text style={{ textAlign: 'center', marginTop: 10, fontFamily: 'Inter-Regular', fontSize: 20 }}>
                            {id}
                        </Text>
                    </View>
                </View>

                <View style={{height: Dimensions.get('window').height * 0.25, justifyContent:'flex-end'}}>
                    <TapGestureHandler 
                    onActivated={() => {
                        if (index < wordList.length - 1) {
                            setIndex(index + 1);
                        } else console.log("Reached the end of the list.");
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
                                <Text style={{color:'white', fontFamily:'Inter-Bold', fontSize: 20}}>Next!</Text>
                            </View>
                        </TouchableOpacity>
                    </TapGestureHandler>
                </View>
            </View>
        </>
    );
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

export default CourseLearnScreen;