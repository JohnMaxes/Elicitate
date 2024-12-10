import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import * as Progress from 'react-native-progress';

const CourseViewScreen = ({ route, navigation }) => {
  const { title, subtitle, level } = route.params;
  const [progressValue, setProgressValue] = useState(0);

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
            color={'#3A94E7'}
            unfilledColor={'#D0EFFF'}
            borderWidth={0}
            thickness={10}
            direction={'counter-clockwise'}
            strokeCap={'round'}
            textStyle={{ fontWeight: 'bold', fontSize: 20 }}
          />
          <View style={{ justifyContent: 'center', paddingLeft: 10 }}>
            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 15, marginBottom: -5 }}>Course</Text>
            <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 20, maxWidth: '90%' }} ellipsizeMode="tail">{title}</Text>
            <Text style={{ fontFamily: 'Poppins-Bold', marginTop: -5, fontSize: 15, color: level === 'Beginner' ? 'green' : level === 'Intermediate' ? '#FFD700' : 'red' }} numberOfLines={1} ellipsizeMode="tail">{level}</Text>
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 20 }}>Course Details</Text>
          <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 15 }} numberOfLines={3} ellipsizeMode="tail">{subtitle}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  courseViewScreen: {
    flex: 1,
    paddingTop: Dimensions.get('window').height * 0.125,
    alignItems: 'center',
    backgroundColor: '#CCE6FA',
  },
  courseViewContainer: {
    width: '85%',
    height: '50%',
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 20,
  },
});

export default CourseViewScreen;