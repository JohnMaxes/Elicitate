import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import CustomSearchBar from '../components/customSearchBar';
import CourseCard from '../components/courseCard';
import { queryCourseToDatabase } from '../components/Database';
import * as Progress from 'react-native-progress';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const CourseStack = createNativeStackNavigator();

function CourseScreen() {
  return(
    <CourseStack.Navigator>
      <CourseStack.Screen name="CourseSearchScreen" component={CourseSearchScreen}
      options={{headerShown:false}}/>
      <CourseStack.Screen name="CourseViewScreen" component={CourseViewScreen}
      options={{
        headerTransparent: true,
        headerTitle: '',
      }}/>
    </CourseStack.Navigator>
  )
}

const CourseSearchScreen = ({ navigation }) =>
{
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState([]);
  const handleSearch = async (query) => {
    setSearchQuery(query);
    let result = await queryCourseToDatabase(query);
    console.log(result);
    setCourses(result);
  };

  useEffect(() => {
    handleSearch('');
  }, [])

  // Test data
  /*
  const testCourses = [
    {
      title: "Introduction to React Native",
      subtitle: "Learn the basics of React Native",
      enrolledCount: 350,
      level: "Beginner",
      imageSource: { uri: "https://via.placeholder.com/50" },
      onPress: () => alert("Course clicked!")
    },
    {
      title: "Mastering JavaScript",
      subtitle: "Deep dive into JavaScript",
      enrolledCount: 1200,
      level: "Intermediate",
      imageSource: { uri: "https://via.placeholder.com/50" },
      onPress: () => alert("Course clicked!")
    },
    {
      title: "Advanced React Patterns",
      subtitle: "Master advanced React techniques",
      enrolledCount: 520,
      level: "Advanced",
      imageSource: { uri: "https://via.placeholder.com/50" },
      onPress: () => alert("Course clicked!")
    },
    {
      title: "Introduction to React Native",
      subtitle: "Learn the basics of React Native",
      enrolledCount: 350,
      level: "Beginner",
      imageSource: { uri: "https://via.placeholder.com/50" },
      onPress: () => alert("Course clicked!")
    },
    {
      title: "Mastering JavaScript",
      subtitle: "Deep dive into JavaScript",
      enrolledCount: 1200,
      level: "Intermediate",
      imageSource: { uri: "https://via.placeholder.com/50" },
      onPress: () => alert("Course clicked!")
    },
    {
      title: "Advanced React Patterns",
      subtitle: "Master advanced React techniques",
      enrolledCount: 520,
      level: "Advanced",
      imageSource: { uri: "https://via.placeholder.com/50" },
      onPress: () => alert("Course clicked!")
    }
  ];
  */
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
      <Text style={styles.heading}>My courses</Text>
      <FlatList
        data={courses}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 200 }}
        style={{marginBottom: 115}}
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
            <Text style={{fontFamily:'Poppins-Bold', fontSize: 20}}>{title}</Text>
            <Text style={{fontFamily:'Poppins-Bold', marginTop: -5,fontSize: 15, color: level == 'Beginner' ? 'green' : level == 'Intermediate' ? 'yellow' : 'red'}}>{level}</Text>
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
  heading: {
    fontSize: 25,
    textAlign: 'flex-start',
    paddingLeft: 20,
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
