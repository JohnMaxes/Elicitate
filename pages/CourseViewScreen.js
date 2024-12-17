import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import * as Progress from 'react-native-progress';
import { GlobalContext } from '../components/context';
import { getCourseLearnedPercentage } from '../components/Database';

const CourseViewScreen = ({ route, navigation }) => {
  const { title, subtitle, level, id } = route.params;
  const [progressValue, setProgressValue] = useState(0);
  const { isDarkMode, setCurrentCourse } = useContext(GlobalContext);

  const styles = getStyles(isDarkMode);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const percentage = await getCourseLearnedPercentage(id);
        setProgressValue(percentage / 100);
      } catch (error) {
        console.error('Error fetching course progress:', error);
      }
    };
    fetchProgress();
  }, [id]);

  const handleNavigation = (screen) => {
    setCurrentCourse({ title, subtitle, level, id });
    navigation.navigate(screen, { id: id });
  };

  return (
    <View style={styles.courseViewScreen}>
      <View style={styles.courseViewContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Progress.Circle
            showsText={true}
            size={100}
            progress={progressValue}
            color={isDarkMode ? '#70b6bb' : '#3A94E7'}
            unfilledColor={'#D0EFFF'}
            borderWidth={0}
            thickness={10}
            direction={'counter-clockwise'}
            strokeCap={'round'}
            textStyle={{ fontWeight: 'bold', fontSize: 20 }}
          />
          <View style={{ justifyContent: 'center', paddingLeft: 10 }}>
            <Text style={[styles.text, { fontFamily: 'Poppins-Regular', fontSize: 15, marginBottom: -5 }]}>Course</Text>
            <Text style={[styles.text, { fontFamily: 'Poppins-Bold', fontSize: 25, maxWidth: '90%' }]} ellipsizeMode="tail">{title}</Text>
            <Text style={[styles.text, { fontFamily: 'Poppins-Bold', fontSize: 20, color: level === 'Beginner' ? '#58af9c' : level === 'Intermediate' ? '#ccae1b' : 'red' }]} numberOfLines={1} ellipsizeMode="tail">{level}</Text>
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <Text style={[styles.text, { fontFamily: 'Poppins-Bold', fontSize: 22 }]}>Course Details</Text>
          <Text style={[styles.text, { fontFamily: 'Poppins-Regular', fontSize: 18 }]} numberOfLines={3} ellipsizeMode="tail">{subtitle}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => handleNavigation('CourseLearnScreen')}>
          <Text style={styles.buttonText}>Learn Course</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => handleNavigation('CourseReviewScreen')}>
          <Text style={styles.buttonText}>Review Course</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getStyles = (isDarkMode) => StyleSheet.create({
  courseViewScreen: {
    flex: 1,
    paddingTop: Dimensions.get('window').height * 0.125,
    alignItems: 'center',
    backgroundColor: isDarkMode ? '#1c294a' : '#CCE6FA',
  },
  courseViewContainer: {
    width: '85%',
    backgroundColor: isDarkMode ? '#4f54b3' : '#f2f5f5',
    borderRadius: 25,
    padding: 20,
  },
  button: {
    backgroundColor: isDarkMode ? '#58af9c' : '#3A94E7',
    borderRadius: 35,
    height: 50,
    marginBottom: 10,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Inter-Bold',
    fontSize: 20,
  },
  text: {
    color: isDarkMode ? '#dbdfea' : 'black',
  },
});

export default CourseViewScreen;
