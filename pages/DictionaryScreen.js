import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, Dimensions } from 'react-native';
import CustomSearchBar from '../components/customSearchBar';
import VocabCard from '../components/vocabCard';
import { queryVocabToDatabase } from '../components/Database';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const VocabStack = createNativeStackNavigator();

function DictionaryScreen() {
  return (
    <VocabStack.Navigator>
      <VocabStack.Screen name="DictionarySearchScreen" component={DictionarySearchScreen}
      options={{headerShown:false}}/>
      <VocabStack.Screen name="DictionaryVocabScreen" component={DictionaryVocabScreen}
      options={{
        headerTransparent: true,
        headerTitle: '',
      }}/>
    </VocabStack.Navigator>
  );
}

const DictionarySearchScreen = ({ navigation }) => { // phải truyền prop navigation vào dictionarySearchScreen này
  const [searchQuery, setSearchQuery] = useState('');
  const [vocab, setVocab] = useState([]);
  const handleSearch = async (query) => {
    setSearchQuery(query);
    let result = await queryVocabToDatabase(query);
    console.log(result);
    setVocab(result);
    console.log(vocab);
  };
  return (
    <View style={styles.container}>
      <CustomSearchBar
        placeholder="Search for words..."
        iconUri="https://img.icons8.com/ios-filled/50/000000/search.png"
        onChangeText={handleSearch}
      />
      <FlatList
        data={vocab}
        renderItem={({item}) => {
          return (<VocabCard word={item.word} type={item.type} definition={item.definition} navigation={navigation}></VocabCard>)
        }}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contentScroll}
        style={{marginBottom: 115}}
        />
    </View>
  );
}

const DictionaryVocabScreen = ({route}) => {
  const { word, type, definition } = route.params;
  return (
    <View style={styles.vocabScreen}>
        <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 55 }}>{word}</Text>

        <View style={styles.typeContainer}>
          <Text style={{ fontFamily: 'Inter-Bold', fontSize: 20, color:'white' }}>{type}</Text>
        </View>

        <View style = {{paddingLeft:30, paddingRight: 30}}>
          <Text style={{textAlign:'center', marginTop: 10, fontFamily: 'Inter-Regular', fontSize: 20}}>{definition}</Text>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#CCE6FA",
  },
  vocabScreen: {
    flex: 1,
    paddingTop: Dimensions.get('window').height*0.1,
    alignItems: 'center',
    backgroundColor: '#CCE6FA',
  },
  contentScroll: {
    paddingHorizontal: 25,
    paddingBottom: 200,
    marginBottom: 115,
  },
  typeContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor:'#7949FF',
    borderRadius: 15,
  },
});

export default DictionaryScreen;
