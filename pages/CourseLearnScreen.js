import { Text, View, FlatList, StyleSheet, Dimensions } from "react-native";
import { useEffect, useState } from "react";
import { getQuestionToLearn } from "../components/Database";

const CourseLearnScreen = ({ route }) => {
    const { id } = route.params;
    const [wordList, setWordList] = useState([]);
    const [currentWord, setWord] = useState({});

    useEffect(() => {
        async function fetchCourseWords() {
            const words = await getQuestionToLearn(id);
            setWordList(words);
            console.log(words);
            setWord(words[1]);
        }
        fetchCourseWords();
    }, [id]); // Add id to the dependency array

    
    return (
        <View style={styles.vocabScreen}>
            <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 55 }}>{currentWord.word}</Text>

            <View style={styles.typeContainer}>
            <Text style={{ fontFamily: 'Inter-Bold', fontSize: 20, color:'white' }}>{currentWord.type}</Text>
            </View>

            <View style = {{paddingLeft:30, paddingRight: 30}}>
            <Text style={{textAlign:'center', marginTop: 10, fontFamily: 'Inter-Regular', fontSize: 20}}>{currentWord.definition}</Text>
            <Text style={{textAlign:'center', marginTop: 10, fontFamily: 'Inter-Regular', fontSize: 20}}>{id}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    vocabScreen: {
        flex: 1,
        paddingTop: Dimensions.get('window').height*0.2,
        alignItems: 'center',
        backgroundColor: '#CCE6FA',
    },
    typeContainer: {
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor:'#7949FF',
        borderRadius: 15,
    },    
})

export default CourseLearnScreen;