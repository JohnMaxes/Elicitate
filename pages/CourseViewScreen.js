import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { TapGestureHandler } from 'react-native-gesture-handler';
import * as Progress from 'react-native-progress';
import { GlobalContext } from '../components/context';

const CourseViewScreen = ({ route, navigation }) => {
  const { title, subtitle, level, id } = route.params;
  const [progressValue, setProgressValue] = useState(0);
  const { isDarkMode } = useContext(GlobalContext);

  const styles = getStyles(isDarkMode);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressValue(0.7);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.courseViewScreen}>
      <View style={styles.courseViewContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Progress.Circle
            showsText={true}
            size={100}
            progress={progressValue}
            color={isDarkMode ? '#4f54b4' : '#3A94E7'}
            unfilledColor={'#D0EFFF'}
            borderWidth={0}
            thickness={10}
            direction={'counter-clockwise'}
            strokeCap={'round'}
            textStyle={{ fontWeight: 'bold', fontSize: 20 }}
          />
          <View style={{ justifyContent: 'center', paddingLeft: 10 }}>
            <Text style={[styles.text, { fontFamily: 'Poppins-Regular', fontSize: 15, marginBottom: -5 }]}>Course</Text>
            <Text style={[styles.text, { fontFamily: 'Poppins-Bold', fontSize: 20, maxWidth: '90%' }]} ellipsizeMode="tail">{title}</Text>
            <Text style={[styles.text, { fontFamily: 'Poppins-Bold', fontSize: 15, color: level === 'Beginner' ? 'green' : level === 'Intermediate' ? '#ccae1b' : 'red' }]} numberOfLines={1} ellipsizeMode="tail">{level}</Text>
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <Text style={[styles.text, { fontFamily: 'Poppins-Bold', fontSize: 20 }]}>Course Details</Text>
          <Text style={[styles.text, { fontFamily: 'Poppins-Regular', fontSize: 15 }]} numberOfLines={3} ellipsizeMode="tail">{subtitle}</Text>
        </View>

        <TapGestureHandler onActivated={() => { navigation.navigate('CourseLearnScreen', { id: id }) }}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Learn Course</Text>
          </TouchableOpacity>
        </TapGestureHandler>

        <TapGestureHandler onActivated={() => { navigation.navigate('CourseReviewScreen', { id: id }) }}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Review Course</Text>
          </TouchableOpacity>
        </TapGestureHandler>
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
    height: '50%',
    backgroundColor: isDarkMode ? '#829ab1' : '#f2f5f5',
    borderRadius: 25,
    padding: 20,
  },
  button: {
    backgroundColor: isDarkMode ? '#05045c' : '#3A94E7',
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
    color: isDarkMode ? '#05045c' : 'black',
  },
});

export default CourseViewScreen;