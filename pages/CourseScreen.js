import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomSearchBar from '../components/customSearchBar';
import CourseCard from '../components/courseCard';
import { queryCourseToDatabase } from '../components/Database';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TapGestureHandler } from 'react-native-gesture-handler';
import CourseLearnScreen from './CourseLearnScreen';
import CourseReviewScreen from './CourseReviewScreen';
import CourseViewScreen from './CourseViewScreen';
import { GlobalContext } from '../components/context';

const CourseStack = createNativeStackNavigator();

function CourseScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState([]);
  const { isDarkMode } = useContext(GlobalContext);

  const styles = getStyles(isDarkMode);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    let result = await queryCourseToDatabase(query);
    setCourses(result);
  };

  useEffect(() => {
    handleSearch('');
  }, []);

  const renderItem = ({ item }) => (
    <CourseCard
      title={item.title}
      subtitle={item.description}
      level={item.level}
      navigation={navigation}
      id={item.id}
    />
  );

  return (
    <View style={styles.container}>
      <CustomSearchBar
        placeholder="Find courses..."
        iconUri="https://img.icons8.com/ios-filled/50/000000/search.png"
        onChangeText={handleSearch}
      />
      <Text style={[styles.heading, { marginTop: -20 }]}>My courses</Text>
      <FlatList
        data={courses}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.contentScroll}
        style={{ marginBottom: 150 }}
      />
    </View>
  );
}

function CourseStackScreen() {
  return (
    <CourseStack.Navigator initialRouteName="CourseScreen">
      <CourseStack.Screen 
        name="CourseScreen" 
        component={CourseScreen}
        options={{ headerShown: false }} 
      />
      <CourseStack.Screen 
        name="CourseViewScreen" 
        component={CourseViewScreen}
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
      <CourseStack.Screen
        name="CourseLearnScreen"
        component={CourseLearnScreen}
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
      <CourseStack.Screen
        name="CourseReviewScreen"
        component={CourseReviewScreen}
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
    </CourseStack.Navigator>
  );
}

const getStyles = (isDarkMode) => StyleSheet.create({
  contentScroll: {
    paddingHorizontal: 25,
    paddingBottom: 40,
    marginBottom: 115,
  },
  heading: {
    fontSize: 25,
    textAlign: 'flex-start',
    paddingLeft: 25,
    fontWeight: "bold",
    color: isDarkMode ? 'white' : 'black',
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: isDarkMode ? '#1c294a' : '#CCE6FA',
  },
});

export default CourseStackScreen;