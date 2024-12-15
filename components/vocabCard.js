import React, { useContext } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { GlobalContext } from './context';

const VocabCard = ({ id, word, type, definition, learned, navigation }) => {
  const { isDarkMode } = useContext(GlobalContext);
  const styles = getStyles(isDarkMode);

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={() => { navigation.navigate("DictionaryVocabScreen", { id, word, type, definition, learned }) }}>
      <Text style={ styles.wordText }>{word}</Text>
      <View style={[styles.typeContainer, { backgroundColor: learned ? '#4CAF50' : '#7949FF' }]}>
        <Text style={styles.typeText}>{type}</Text>
      </View>
      <View style={{ marginTop: 5 }}>
        <Text style={[styles.definitionText, { color: isDarkMode ? '#2c3c5c' : 'black' }]}>{definition}</Text>
      </View>
    </TouchableOpacity>
  );
};

const getStyles = (isDarkMode) => StyleSheet.create({
  cardContainer: {
    backgroundColor: isDarkMode ? '#8199b0' : 'white',
    borderRadius: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 15,
    marginBottom: 20,
  },
  wordText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 30,
    color: isDarkMode ? '#2c3c5c' : 'black'
  },
  typeContainer: {
    fontSize: 20,
    borderRadius: 10,
    width: Dimensions.get('window').width * 0.25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeText: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'Inter-Bold',
  },
  definitionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 17,
  },
});

export default VocabCard;