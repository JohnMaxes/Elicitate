import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, Dimensions, TouchableOpacity, Image } from 'react-native';
import { ScrollView, TapGestureHandler } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';

import * as Font from 'expo-font';
import * as Progress from 'react-native-progress';

import VocabReviewScreen from './VocabReviewScreen';

import { queryCourseToDatabase, getLearnedWordNumber, getLearnedCourseNumber } from '../components/Database';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { GlobalContext } from '../components/context';

const loadFonts = async () => {
  await Font.loadAsync({
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Inter-Bold': require('../assets/fonts/Inter Bold 700.otf'),
    'Inter-Regular': require('../assets/fonts/Inter Regular 400.otf'),
  });
};

const HomeStack = createNativeStackNavigator();
const Home = () => {
  return(
    <HomeStack.Navigator initialRouteName='HomeScreen'>
      <HomeStack.Screen
        name='HomeScreen'
        component={HomeScreen}
        options={{
          headerShown:false,
        }}
      />
      <HomeStack.Screen
        name='VocabReviewScreen'
        component={VocabReviewScreen}
        options={({ navigation }) => ({
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
          )
        })} 
      />
    </HomeStack.Navigator>
  )
}


function HomeScreen({ navigation }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [staticCourses, setStaticCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const {
    streakCount, setStreakCount,
    wordCount, setWordCount,
    courseCount, setCourseCount, 
    currentCourse, setCurrentCourse
  } = useContext(GlobalContext);

  const CourseCard = ({ item }) => (
    <View style={{ backgroundColor: 'white', height: 296, width: 208, borderRadius: 20, paddingTop: 12, paddingLeft: 16, paddingRight: 16, paddingBottom: 12, marginRight: 12 }}>
      <View style={{ height: 192 }}>
        <Image
          style={{ borderRadius: 8, width: '100%', height: '100%' }}
          source={{ uri: 'https://media.istockphoto.com/id/1162167657/photo/hand-painted-background-with-mixed-liquid-blue-and-golden-paints-abstract-fluid-acrylic.jpg?s=612x612&w=0&k=20&c=DiYltrxEBUFjhhltHriX4WVPRxiPqgQhTBC5R7_C6Ik=' }}
        />
      </View>
      <View style={{ height: 40 }}>
        <Text style={{ fontFamily: 'Inter-Bold', fontSize: 14.4 }}>{item.title}</Text>
        <Text style={{
          fontFamily: 'Poppins-Bold',
          marginTop: -4,
          fontSize: 12,
          color: item.level === 'Beginner' ? 'green' : item.level === 'Intermediate' ? '#FFD700' : 'red'
        }}>
          {item.level}
        </Text>
      </View>
      <TouchableOpacity
        style={{
          height: 40,
          borderWidth: 1.6,
          borderColor: '#3A94E7',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 12
        }}
        onPress={() => {
          navigation.navigate('Course', {
            screen: 'CourseViewScreen',
            params: {
              title: item.title,
              subtitle: item.description,
              level: item.level
            }
          });
        }}>
        <Text style={{ fontFamily: 'Poppins-Bold', color: '#3A94E7' }}>View</Text>
      </TouchableOpacity>
    </View>
  );

  useEffect(() => {
    async function initialize() {
      try {
        const courses = await queryCourseToDatabase('');
        setStaticCourses(courses);
        await loadFonts();
        setFontsLoaded(true);

        try {
          let result = await getLearnedWordNumber();
          setWordCount(result.total_words);
          setStreakCount(15);

          result = await getLearnedCourseNumber();
          setCourseCount(result.total_courses);
        }
        catch (error) {
          console.log('Error setting up context!');
          console.log(error);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error initializing:', error);
      }
    }
    initialize();
  }, []);


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
    <ScrollView contentContainerStyle={{alignItems:'center'}} style={{flex: 1, paddingTop: 50, backgroundColor: '#CCE6FA',}}>
      <View name='StatusBar' style={{ flexDirection: 'row' }}>
        <View style={{ width: Dimensions.get('window').width / 3 }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: Dimensions.get('window').width / 3 }}>
          <View><Icon name={'flame'} size={24} color={'red'}></Icon></View>
          <View style={{ justifyContent: 'center' }}><Text style={{ fontSize: 16, fontFamily:'Inter-Bold' }}>{streakCount}</Text></View>
        </View>
        <View style={{ alignItems: 'flex-end', width: Dimensions.get('window').width / 3, paddingRight: 25 }}>
        </View>
      </View>

      <View style={{ width: '100%', paddingLeft: 20, paddingTop: 20, paddingRight: 20 }}>
        <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 25, textAlign: 'center', color: '#047cfc' }}>Current Course</Text>
        <View style={{ backgroundColor: 'white', borderRadius: 32, height: Dimensions.get('window').height * 0.25, width: Dimensions.get('window').width*0.9, padding: 20, marginTop: 7 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', height: 120 }}>
              {
                currentCourse? (
                <>
                  <View>
                    <Progress.Circle
                      showsText={true}
                      size={'90%'}
                      progress={progressValue}
                      color={'#3A94E7'}
                      unfilledColor={'#D0EFFF'}
                      borderWidth={0}
                      thickness={12}
                      direction={'counter-clockwise'}
                      strokeCap={'round'}
                      textStyle={{ fontWeight: 'bold', fontSize: 20 }}
                    />
                  </View>
                  <View style={{ paddingLeft: 10 }}>
                    <Text style={{ fontSize: 15, fontFamily: 'Poppins-Regular', color: '#4D4D4F' }}>Chapter 2</Text>
                    <Text style={{ fontSize: 20, fontFamily: 'Poppins-Bold' }}>Something</Text>
                    <Text style={{ fontSize: 15, fontFamily: 'Poppins-Regular', color: '#4D4D4F' }}>Continue your journey!</Text>   
                  </View> 
                </>
                ) : (<View style={{height: 120, justifyContent:'center', alignItems:'center'}}><Text style={{ fontSize: 30, fontFamily: 'Poppins-Bold' }}>No current Course!</Text></View>)
              }
          </View>
          <TouchableOpacity
            style={{
              marginTop: 5,
              backgroundColor: '#3A94E7',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 25,
            }}
            onPress={() => 
              { 
                if(currentCourse)
                  navigation.navigate('Course', {
                    screen: 'CourseLearnScreen',
                    params: {
                      id: currentCourse.id,
                    }
                  })
                if(currentCourse == null)
                  navigation.navigate('Course', {
                    screen: 'CourseScreen'
                  })  
              }
            }
          >
            <Text style={{ color: 'white', fontFamily: 'Poppins-Bold', fontSize: 17 }}>Continue Studying</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 25, textAlign: 'center', color: '#047cfc', marginTop: 7}}>Statistics</Text>
      <View style={{ backgroundColor: 'white', borderRadius: 32, height: Dimensions.get('window').height * 0.25, width: Dimensions.get('window').width*0.9, padding: 20, marginTop: 7}}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent:'center', height: 120 }}>
          <View style={{flex:1.75, backgroundColor: '#047cfc', alignItems:'center', justifyContent:'center', marginRight: 5, borderRadius: 30, height: '90%'}}>
            <Text style={{fontSize: 45, fontFamily:'Poppins-Bold', color:'white'}}>{wordCount}</Text>
            <Text style={{fontFamily:'Poppins-Bold', color:'white'}}>Words</Text>
          </View>
          <View style={{flex:1, backgroundColor: '#047cfc', alignItems:'center', justifyContent:'center', borderRadius: 30, height: '90%'}}>
            <Text style={{fontSize: 50, fontFamily:'Poppins-Bold', color:'white'}}>{courseCount}</Text>
            <Text style={{fontFamily:'Poppins-Bold', color:'white'}}>Courses</Text>
          </View>
        </View>
        <TouchableOpacity
          style={{
            marginTop: 5,
            backgroundColor: '#3A94E7',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 25
          }}
          onPress={() => navigation.navigate('VocabReviewScreen')}r
        >
          <Text style={{ color: 'white', fontFamily: 'Poppins-Bold', fontSize: 17 }}>Review</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', marginTop: '10%', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flex: 1, paddingLeft: 20 }}>
          <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 20, color: '#333' }}>Other Courses</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: 20 }}>
          <TouchableOpacity onPress={() => navigation.navigate('Course')}>
            <Text style={{ color: '#3A94E7', fontSize: 16, fontFamily: 'Poppins-Bold' }}>View All</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        style={{paddingBottom: 110}}
        data={staticCourses}
        renderItem={CourseCard}
        keyExtractor={item => item.id.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
      />
    </ScrollView>
  );
}

export default Home;