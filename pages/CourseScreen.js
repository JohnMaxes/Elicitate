import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomSearchBar from '../components/customSearchBar';
import CourseCard from '../components/courseCard';
import { queryCourseToDatabase } from '../components/Database';
import * as Progress from 'react-native-progress';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const CourseStack = createNativeStackNavigator();

function CourseScreen() {
  return (
    <CourseStack.Navigator>
      <CourseStack.Screen 
        name="CourseSearchScreen" 
        component={CourseSearchScreen}
        options={{ headerShown: false }} 
      />
      <CourseStack.Screen 
        name="CourseViewScreen" 
        component={CourseViewScreen}
        options={({ navigation }) => ({
          headerTransparent: true,
          headerTitle: '',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name='arrow-back-outline' size={35} color='#3A94E7' />
            </TouchableOpacity>
          ),
        })} 
      />
    </CourseStack.Navigator>
  );
}

const CourseSearchScreen = ({ navigation }) =>
{
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState([]);
  const handleSearch = async (query) => {
    setSearchQuery(query);
    let result = await queryCourseToDatabase(query);
    setCourses(result);
  };

  useEffect(() => {
    handleSearch('');
  }, [])

  const renderItem = ({ item }) => (
    <CourseCard
      title={item.title}
      subtitle={item.description}
      level={item.level}
      navigation={navigation}
      /*
      enrolledCount={item.enrolledCount}
      level={item.level}
      imageSource={item.imageSource}
      onPress={item.onPress}
      */
    />
  );

  return (
    <View style={styles.container}>
      <CustomSearchBar
        placeholder="Find courses..."
        iconUri="https://img.icons8.com/ios-filled/50/000000/search.png"
        onChangeText={handleSearch}
      />
      <Text style={[styles.heading, {marginTop:-20}]}>My courses</Text>
      <FlatList
        data={courses}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contentScroll}
        style={{marginBottom: 150}}
      />
    </View>
  );
}

const CourseViewScreen = ({route}) => {
  const {title, subtitle, level} = route.params;
  const [progressValue, setProgressValue] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressValue(0.7);
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  return(
    <View style={styles.courseViewScreen}>
      <View style={styles.courseViewContainer}>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <Progress.Circle showsText={true} size={100} progress={progressValue} color={'#3A94E7'} unfilledColor={'#D0EFFF'} borderWidth={0} 
          thickness={10} direction={'counter-clockwise'} strokeCap={'round'} textStyle={{fontWeight:'bold', fontSize: 20}}/>
          <View style={{justifyContent:'center', paddingLeft: 10}}>
            <Text style={{fontFamily:'Poppins-Regular', fontSize: 15, marginBottom: -5}}>Course</Text>
            <Text style={{fontFamily:'Poppins-Bold', fontSize: 20, maxWidth: "90%"}}>{title}</Text>
            <Text style={{fontFamily:'Poppins-Bold', marginTop: -5,fontSize: 15, color: level == 'Beginner' ? 'green' : level == 'Intermediate' ? '#FFD700' : 'red'}}>{level}</Text>
          </View>
        </View>

        <View style={{marginTop: 10}}>
          <Text style={{fontFamily:'Poppins-Bold', fontSize: 20}}>Course Details</Text>
          <Text style={{fontFamily:'Poppins-Regular', fontSize: 15}}>{subtitle}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  contentScroll: {
    paddingHorizontal: 25,
    paddingBottom: 200,
    marginBottom: 115,
  },
  heading: {
    fontSize: 25,
    textAlign: 'flex-start',
    paddingLeft: 25,
    fontWeight: "bold",
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#CCE6FA",
  },
  courseViewScreen: {
    flex: 1,
    paddingTop: Dimensions.get('window').height*0.1,
    alignItems: 'center',
    backgroundColor: '#CCE6FA',
  },
  courseViewContainer: {
    width:'85%', 
    height:'50%', 
    backgroundColor: "white", 
    borderRadius: 25, 
    padding: 20
  }
});

export default CourseScreen;
