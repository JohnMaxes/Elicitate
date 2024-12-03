import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, Dimensions, TouchableOpacity} from 'react-native';
import styles from '../stylesheet';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Font from 'expo-font';
import * as Progress from 'react-native-progress';

const loadFonts = async () => {
  await Font.loadAsync({
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Inter-Bold': require('../assets/fonts/Inter Bold 700.otf'),
    'Inter-Regular': require('../assets/fonts/Inter Regular 400.otf'),
  });
};

const courses = [
  {
    id: 1,
    title: 'Economics Vocabulary',
    image: 'https://example.com/image1.png',
  },
  {
    id: 2,
    title: 'Sentence Completion',
    image: 'https://example.com/image2.png',
  },
  {
    id: 3,
    title: 'Math Fundamentals',
    image: 'https://example.com/image3.png',
  },
  {
    id: 4,
    title: 'Math Fundamentals Difference',
    image: 'https://example.com/image3.png',
  },
];

const CourseCard = ({ item }) => (
  <View style={{backgroundColor:'white', width: 260, height: 260, marginRight: 20, borderRadius: 20, padding: 15}}>
    <View style={{flex: 4}}>
      <Text>{item.title}</Text>
    </View>
    <TouchableOpacity style={{flex: 1, borderWidth: 2, borderColor: '#3A94E7', justifyContent: 'center', alignItems: 'center', borderRadius: 15}}>
      <Text style={{fontFamily:'Poppins-Bold', color:'#3A94E7'}}>Start</Text>
    </TouchableOpacity>
  </View>
);

const streak_count = 0;
function HomeScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.screen}>

      <View name='StatusBar' style={{flexDirection:'row'}}>
        <View style={{width: Dimensions.get('window').width/3}}/>
        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center', width: Dimensions.get('window').width/3}}>
          <View><Icon name={'flame'} size={24} color={'red'}></Icon></View>
          <View style={{justifyContent:'center'}}><Text style={{fontSize: 16}}>{streak_count}</Text></View>
        </View>
        <View style={{alignItems:'flex-end', width: Dimensions.get('window').width/3, paddingRight: 25}}>
          <Icon name={'notifications-outline'} size={24} color={'#3A94E7'}/>
        </View>
      </View>

      <View style={{width:'100%', marginTop: 10, paddingLeft: 20, paddingTop:20, paddingRight: 20}}>
      
        <Text style={{fontFamily: 'Poppins-Bold', fontSize: 20,}}>Current Course</Text>
        <View style={{backgroundColor: 'white', borderRadius: 32, height: Dimensions.get('window').height*0.23, padding: 20, marginTop: 7}}>
          <View style={{flexDirection: 'row', alignItems:'center'}}>
            <View>
              <Progress.Circle showsText={true} size={100} progress={0.7} color={'#3A94E7'} unfilledColor={'#D0EFFF'} borderWidth={0} thickness={12} direction={'counter-clockwise'} strokeCap={'round'}
              textStyle={{fontWeight:'bold', fontSize: 20}}/>
            </View>
            <View style={{paddingLeft: 10}}>
              <Text style={{fontSize: 15, fontFamily: 'Poppins-Regular', color:'#4D4D4F'}}>Chapter 2</Text>
              <Text style={{fontSize: 20, fontFamily: 'Poppins-Bold'}}>Discovering English</Text>
              <Text style={{fontSize: 15, fontFamily: 'Poppins-Regular', color:'#4D4D4F'}}>Continue your journey!</Text>
            </View>
          </View>
          <TouchableOpacity style={{marginTop:15, backgroundColor:'#3A94E7', flex:1, justifyContent: 'center',
          alignItems: 'center',borderRadius: 25}}>
            <Text style={{color:'white', fontFamily:'Poppins-Bold', fontSize: 17}}>Continue Studying</Text>
          </TouchableOpacity>
        </View>


        <View style={{flexDirection: 'row', marginTop: 50, alignItems: 'center'}}>
          <View style={{alignItems: 'center', flex: 5, alignItems: 'flex-start'}}>
            <Text style={{fontFamily: 'Poppins-Regular', fontSize: 20,}}>Other Courses</Text>
          </View>
          <TouchableOpacity style={{alignItems: 'flex-end', flex: 1}}>
            <Text style={{color: '#3A94E7'}}>View All</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={courses}
        renderItem={CourseCard}
        keyExtractor={item => item.id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{paddingLeft:20}}
        />
    </View>
  );
}

export default HomeScreen;