import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, Dimensions, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import * as Font from 'expo-font';
import * as Progress from 'react-native-progress';
import { queryCourseToDatabase, getLearnedWordNumber, getLearnedCourseNumber } from '../components/Database';

import { GlobalContext } from '../components/context';

const loadFonts = async () => {
  await Font.loadAsync({
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Inter-Bold': require('../assets/fonts/Inter Bold 700.otf'),
    'Inter-Regular': require('../assets/fonts/Inter Regular 400.otf'),
  });
};

function HomeScreen({ navigation }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [staticCourses, setStaticCourses] = useState([]);
  const {
    isDarkMode,
    streakCount,
    wordCount,
    courseCount,
    currentCourse,
    setUpContext,
    setCurrentCourse,
    timeSpent,
    setWordCount,
    setCourseCount
  } = useContext(GlobalContext);

  const styles = getStyles(isDarkMode);

  const CourseCard = ({ item }) => (
    <View style={ styles.courseCard }>
      <View style={styles.courseImageContainer}>
        <Image
          style={styles.courseImage}
          source={{ uri: 'https://media.istockphoto.com/id/1162167657/photo/hand-painted-background-with-mixed-liquid-blue-and-golden-paints-abstract-fluid-acrylic.jpg?s=612x612&w=0&k=20&c=DiYltrxEBUFjhhltHriX4WVPRxiPqgQhTBC5R7_C6Ik=' }}
        />
      </View>
      <View style={styles.courseTextContainer}>
        <Text style={ styles.courseTitle }>{item.title}</Text>
        <Text style={[styles.courseLevel, { color: item.level === 'Beginner' ? 'green' : item.level === 'Intermediate' ? '#FFD700' : 'red' }]}>{item.level}</Text>
      </View>
      <TouchableOpacity
        style={ styles.courseButton }
        onPress={() => {
          setCurrentCourse(item);
          navigation.navigate('Course', {
            screen: 'CourseViewScreen',
            initial: false,
            params: {
              title: item.title,
              subtitle: item.description,
              level: item.level,
              id: item.id,
            }
          });
        }}>
        <Text style={ styles.courseButtonText }>View</Text>
      </TouchableOpacity>
    </View>
  );

  useFocusEffect(
    React.useCallback(() => {
      async function updateCounts() {
        try {
          const wordResult = await getLearnedWordNumber();
          setWordCount(wordResult.total_words);
          const courseResult = await getLearnedCourseNumber();
          setCourseCount(courseResult.total_courses);
        } catch (error) {
          console.error('Error updating counts:', error);
        }
      }
      updateCounts();
    }, [])
  );

  useEffect(() => {
    async function initialize() {
      try {
        const courses = await queryCourseToDatabase('');
        setStaticCourses(courses);
        await loadFonts();
        setFontsLoaded(true);
        await setUpContext();
        setLoading(false);
      } catch (error) {
        console.error('Error initializing:', error);
      }
    }
    initialize();
  }, []);

  if (loading)
    return (
      <View style={ styles.loadingContainer }>
        <Progress.Circle indeterminate={true} color={isDarkMode ? '#3A94E7' : '#4f54b4'} size={30} />
      </View>
    );

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent} style={ styles.scrollView }>
      <View style={styles.statusBar} />
      <View style={styles.statusBarContent}>
        <View><Icon name={'flame'} size={24} color={'red'} /></View>
        <View style={styles.statusBarTextContainer}>
          <Text style={ styles.statusBarText }>{streakCount + ' ' + timeSpent}</Text>
        </View>
      </View>

      {currentCourse ? (
        <View style={styles.currentCourseContainer}>
          <Text style={ styles.currentCourseTitle }>Current Course</Text>
          <View style={styles.currentCourseCard}>
            <View style={styles.currentCourseProgressContainer}>
              <Progress.Circle
                showsText={true}
                size={Dimensions.get('window').width * 0.3}
                progress={0} // Update this with actual progress value
                color={ isDarkMode ? '#1B2A41' : '#03174c'}
                unfilledColor={'#D0EFFF'}
                borderWidth={0}
                thickness={12}
                direction={'counter-clockwise'}
                strokeCap={'round'}
                textStyle={{ fontWeight: 'bold', fontSize: 40 }}
              />
              <View style={styles.currentCourseTextContainer}>
                <Text style={ styles.currentCourseChapter }>Chapter 2</Text>
                <Text style={ styles.currentCourseName }>{currentCourse.title}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.currentCourseButton}
              onPress={() => {
                navigation.navigate('Course', {
                  screen: 'CourseLearnScreen',
                  params: { id: currentCourse.id }
                });
              }}>
              <Text style={styles.currentCourseButtonText}>Continue Studying</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.welcomeContainer}>
          <Text style={ styles.welcomeTitle }>Welcome to Elicitate!</Text>
          <TouchableOpacity
            style={styles.welcomeButton}
            onPress={() => {
              navigation.navigate('Course', { screen: 'CourseScreen' });
            }}>
            <Text style={styles.welcomeButtonText}>Start Studying</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.statisticsContainer}>
        <Text style={styles.statisticsTitle}>Statistics</Text>
        <View style={styles.statisticsContent}>
          <View style={styles.statisticsItem}>
            <Text style={styles.statisticsNumber}>{wordCount}</Text>
            <Text style={styles.statisticsLabel}>Words</Text>
          </View>
          <View style={styles.statisticsItem}>
            <Text style={styles.statisticsNumber}>{courseCount}</Text>
            <Text style={styles.statisticsLabel}>Courses</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.statisticsButton}
          onPress={() => navigation.navigate('VocabReviewScreen')}>
          <Text style={styles.statisticsButtonText}>Review</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.otherCoursesContainer}>
        <View style={styles.otherCoursesTitleContainer}>
          <Text style={ styles.otherCoursesTitle }>Other Courses</Text>
        </View>
        <View style={styles.otherCoursesButtonContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('CourseScreen')}>
            <Text style={ styles.otherCoursesButtonText }>View All</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        style={styles.courseList}
        data={staticCourses}
        renderItem={CourseCard}
        keyExtractor={item => item.id.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.courseListContent}
      />
    </ScrollView>
  );
}

const getStyles = (isDarkMode) => StyleSheet.create({
  scrollViewContent: {
    alignItems: 'center'
  },
  scrollView: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: isDarkMode ? '#1c294a' : '#CCE6FA',
  },
  courseCard: {
    height: 300,
    width: 250,
    borderRadius: 20,
    padding: 15,
    marginRight: 20,
    backgroundColor: isDarkMode ? '#829ab1' : 'white',
  },
  courseImageContainer: {
    height: 190
  },
  courseImage: {
    borderRadius: 15,
    width: '100%',
    height: '100%'
  },
  courseTextContainer: {
    height: 40
  },
  courseTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 15,
    color: isDarkMode ? '#F9F9F9' : 'black',
  },
  courseLevel: {
    fontFamily: 'Poppins-Bold',
    fontSize: 15,
  },
  courseButton: {
    height: 40,
    borderColor: isDarkMode ? '#191970' : '#4f54b4',
    marginTop: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12
  },
  courseButtonText: {
    fontFamily: 'Poppins-Bold',
    color: isDarkMode ? '#191970' : '#4f54b4',
  },
  loadingContainer: {
    backgroundColor: isDarkMode ? '#1E1E1E' : '#CCE6FA',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  statusBar: {
    width: Dimensions.get('window').width / 3
  },
  statusBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width / 3
  },
  statusBarTextContainer: {
    justifyContent: 'center'
  },
  statusBarText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: isDarkMode ? 'white' : 'black',
  },
  currentCourseContainer: {
    width: '100%',
    padding: 20
  },
  currentCourseTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 30,
    textAlign: 'center',
    color: isDarkMode ? 'white' : 'black',
  },
  currentCourseCard: {
    borderRadius: 32,
    height: Dimensions.get('window').height * 0.28,
    backgroundColor: isDarkMode ? '#58B09C' : '#a2e0c1',
    padding: 30,
    marginTop: 7,
    marginHorizontal: 10,
  },
  currentCourseProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 120
  },
  currentCourseTextContainer: {
    paddingLeft: 10,
    alignItems: 'center'
  },
  currentCourseChapter: {
    alignSelf: 'left',
    paddingLeft: 12,
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
    color: isDarkMode ? 'white' : 'black',
  },
  currentCourseName: {
    alignSelf: 'left',
    paddingLeft: 12,
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    maxWidth: '90%',
    color: isDarkMode ? 'white' : 'black',
  },
  currentCourseButton: {
    margin: 25,
    paddingVertical: 10,
    backgroundColor: '#4f54b4',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    borderWidth: 3,
    borderColor: 'transparent'
  },
  currentCourseButtonText: {
    color: 'white',
    fontFamily: 'Poppins-Bold',
    fontSize: 17
  },
  welcomeContainer: {
    width: '100%',
    paddingLeft: 20,
    paddingTop: 20,
    paddingRight: 20
  },
  welcomeTitle: {
    fontWeight: 'bold',
    fontSize: 40,
    textAlign: 'center',
    color: isDarkMode ? 'white' : '#024991',
  },
  welcomeButton: {
    margin: 20,
    marginHorizontal: 50,
    paddingVertical: 8,
    backgroundColor: isDarkMode ? '#99ccff' : '#024991',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    borderWidth: 3,
    borderColor: 'transparent'
  },
  welcomeButtonText: {
    color: isDarkMode ? 'black' : 'white',
    fontFamily: 'Poppins-Bold',
    fontSize: 20
  },
  statisticsContainer: {
    backgroundColor: isDarkMode ? '#4f54b4' : '#0E79B2',
    borderRadius: 32,
    height: Dimensions.get('window').height * 0.31,
    width: Dimensions.get('window').width * 0.85,
    paddingHorizontal: 20
  },
  statisticsTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 25,
    textAlign: 'center',
    color: 'white',
    paddingTop: 15
  },
  statisticsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 120
  },
  statisticsItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  statisticsNumber: {
    fontSize: 50,
    fontFamily: 'Poppins-Bold',
    color: 'white'
  },
  statisticsLabel: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: 'white'
  },
  statisticsButton: {
    margin: 25,
    paddingVertical: 10,
    backgroundColor: isDarkMode ? '#58B09C' : '#959df1',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25
  },
  statisticsButtonText: {
    color: 'white',
    fontFamily: 'Poppins-Bold',
    fontSize: 17
  },
  otherCoursesContainer: {
    flexDirection: 'row',
    marginTop: '10%',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  otherCoursesTitleContainer: {
    flex: 1,
    paddingLeft: 20
  },
  otherCoursesTitle: {
    fontFamily: 'Poppins-Bold',
    color: isDarkMode ? 'white' : 'black',
    fontSize: 20,
  },
  otherCoursesButtonContainer: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 20
  },
  otherCoursesButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: isDarkMode ? '#3A94E7' : '#4f54b4',
  },
  courseList: {
    paddingBottom: Dimensions.get('window').height * 0.2,
  },
  courseListContent: {
    paddingLeft: 20,
  }
});

export default HomeScreen;