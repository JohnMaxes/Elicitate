import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, Dimensions, Pressable, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomSearchBar from '../components/customSearchBar';
import Icon from 'react-native-vector-icons/Ionicons';
import VocabCard from '../components/vocabCard';
import { queryVocabToDatabase, addWordToLearned } from '../components/Database';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TapGestureHandler } from 'react-native-gesture-handler';

const VocabStack = createNativeStackNavigator();

function DictionaryScreen() {
  return (
    <VocabStack.Navigator>
      <VocabStack.Screen name="DictionarySearchScreen" component={DictionarySearchScreen} options={{ headerShown: false }} />
      <VocabStack.Screen 
        name="DictionaryVocabScreen" 
        component={DictionaryVocabScreen}
        options={({ route, navigation }) => ({
          headerTransparent: true,
          headerTitle: '',
          headerLeft: () => (
            <TapGestureHandler onActivated={() => {
              navigation.goBack();
            }}>
              <TouchableOpacity style={{ padding: 15 }} activeOpacity={0.7}>
                <Icon name='arrow-back-outline' size={35} color='#3A94E7'/>
              </TouchableOpacity>
            </TapGestureHandler>
          ),
          headerRight: () => (
            <DictionaryVocabScreenAddButton id={route.params.id} learned={route.params.learned} />
          ),
        })}
      />
    </VocabStack.Navigator>
  );
}

const DictionaryVocabScreenAddButton = ({ id, learned }) => {
  const handleAddWord = async () => {
    console.log(learned);
    if (await addWordToLearned(id)) {
      alert('Word added successfully');
      // Consider managing learned state through props or state management
    } else {
      alert('Something has gone wrong');
    }
  };

  return (
    <TapGestureHandler onActivated={handleAddWord}>
      <TouchableOpacity style={{ marginRight: 15 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {learned ? (
            <Text style={{ fontSize: 20, color: '#3A94E7' }}>Learned!</Text>
          ) : (
            <Ionicons name="add" size={35} color="#3A94E7" />
          )}
        </View>
      </TouchableOpacity>
    </TapGestureHandler>
  );
};

const DictionarySearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [vocab, setVocab] = useState([]);
  const [learned, setLearned] = useState(0);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    await reSearch(query);
  };

  const reSearch = async (query) => {
    let result = await queryVocabToDatabase(query, learned);
    setVocab(result);
  };

  useEffect(() => {
    reSearch(searchQuery);
  }, [learned, searchQuery]);

  return (
    <View style={styles.container}>
      <CustomSearchBar
        placeholder="Search for words..."
        iconUri="https://img.icons8.com/ios-filled/50/000000/search.png"
        onChangeText={handleSearch}
      />
      <View style={{flexDirection: 'row', height: 40, marginHorizontal: 25, marginTop: -25}}>
        <Pressable
          style={{flex: 1, borderTopLeftRadius: 25, borderBottomLeftRadius: 25, alignItems: 'center', justifyContent: 'center', backgroundColor: !learned ? '#3A94E7' : '#5BB6FF'}}
          onPress={() => setLearned(0)}
        >
          <Text style={{color: 'white', fontSize: 20, fontFamily: !learned ? 'Inter-Bold' : 'Inter-Regular'}}>All</Text>
        </Pressable>
        <Pressable
          style={{flex: 1, borderTopRightRadius: 25, borderBottomRightRadius: 25, alignItems: 'center', justifyContent: 'center', backgroundColor: learned ? '#3A94E7' : '#5BB6FF'}}
          onPress={() => setLearned(1)}
        >
          <Text style={{color: 'white', fontSize: 20, fontFamily: learned ? 'Inter-Bold' : 'Inter-Regular'}}>Learned</Text>
        </Pressable>
      </View>
      
      <FlatList
        data={vocab}
        renderItem={({item}) => (
          <VocabCard id={item.id} word={item.word} type={item.type} definition={item.definition} learned={item.learned_at} navigation={navigation} />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.contentScroll}
        style={{marginBottom: 135, marginTop: 10}}
      />
    </View>
  );
};

const DictionaryVocabScreen = ({route}) => {
  const { id, word, type, definition, learned } = route.params;

  return (
    <View style={styles.vocabScreen}>
        <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 55 }}>{word}</Text>

        <View style={styles.typeContainer}>
          <Text style={{ fontFamily: 'Inter-Bold', fontSize: 20, color:'white' }}>{type}</Text>
        </View>

        <View style = {{paddingLeft:30, paddingRight: 30}}>
          <Text style={{textAlign:'center', marginTop: 10, fontFamily: 'Inter-Regular', fontSize: 20}}>{definition}</Text>
          <Text style={{textAlign:'center', marginTop: 10, fontFamily: 'Inter-Regular', fontSize: 20}}>{id}</Text>
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
