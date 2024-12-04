import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

const VocabCard = ({id, word, type, definition, navigation}) => {
    return (
        <TouchableOpacity style={styles.cardContainer} onPress={() => {navigation.navigate("DictionaryVocabScreen", {id, word, type, definition })}}>
            <Text style={{fontFamily:'Poppins-Bold', fontSize:30}}>{word}</Text>
            <View style={styles.typeContainer}>
                <Text style={{color: 'white', fontSize: 15, fontFamily:'Inter-Bold'}}>{type}</Text>
            </View>
            <View style={{marginTop: '5'}}>
                <Text style={{fontFamily:'Inter-Regular', fontSize: 17}}>{definition}</Text>
            </View>
            
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: 'white',
        borderRadius: 20,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 5,
        paddingBottom: 15,
        marginBottom: 20,
    },
    typeContainer: {
        fontSize: 20,
        borderRadius: 10,
        backgroundColor: '#7949FF',
        width: Dimensions.get('window').width*0.25,
        justifyContent: 'center',
        alignItems:'center',
    },
});

export default VocabCard;