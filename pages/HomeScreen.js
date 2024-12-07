import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, Dimensions, TouchableOpacity, Image} from 'react-native';
import styles from '../stylesheet';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Font from 'expo-font';
import * as Progress from 'react-native-progress';
import { queryCourseToDatabase } from '../components/Database';

const loadFonts = async () => {
  await Font.loadAsync({
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Inter-Bold': require('../assets/fonts/Inter Bold 700.otf'),
    'Inter-Regular': require('../assets/fonts/Inter Regular 400.otf'),
  });
};

const streak_count = 0;
function HomeScreen({navigation}) {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [staticCourses, setStaticCourses] = useState([]);

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
      onPress={() => navigation.navigate('Course', {
        screen: 'CourseViewScreen',
        params: {
          title: item.title,
          subtitle: item.description,
          level: item.level
        }
      })}>
      <Text style={{ fontFamily: 'Poppins-Bold', color: '#3A94E7' }}>View</Text>
    </TouchableOpacity>
  </View>  
);
  

  useEffect(() => {
    async function init() 
    {
      setStaticCourses(await queryCourseToDatabase(''));
      loadFonts().then(() => {
        const timer = setTimeout(() => {
          setProgressValue(0.7);
        }, 100);
        setFontsLoaded(true)
        return () => clearTimeout(timer);
      });
    };
    init();
  },[]);

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

      <View style={{width:'100%', paddingLeft: 20, paddingTop: 20, paddingRight: 20}}>
      
        <Text style={{fontFamily: 'Poppins-Bold', fontSize: 20,}}>Current Course</Text>
        <View style={{backgroundColor: 'white', borderRadius: 32, height: Dimensions.get('window').height*0.23, padding: 20, marginTop: 7}}>
          <View style={{flexDirection: 'row', alignItems:'center'}}>
            <View>
              <Progress.Circle showsText={true} size={100} progress={progressValue} color={'#3A94E7'} unfilledColor={'#D0EFFF'} borderWidth={0} thickness={12} direction={'counter-clockwise'} strokeCap={'round'}
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


        <View style={{flexDirection: 'row', marginTop: 10, alignItems: 'center'}}>
          <View style={{alignItems: 'center', flex: 5, alignItems: 'flex-start'}}>
            <Text style={{fontFamily: 'Poppins-Regular', fontSize: 20,marginBottom: 10}}>Other Courses</Text>
          </View>
          <TouchableOpacity style={{alignItems: 'flex-end', flex: 1}} onPress={() => navigation.navigate('Course')}>
            <Text style={{color: '#3A94E7'}}>View All</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={staticCourses}
        renderItem={CourseCard}
        keyExtractor={item => item.id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingLeft:20, paddingRight:10}}
        />
    </View>
  );
}

export default HomeScreen;