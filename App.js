import React, { useState, useEffect } from "react";
import { View, Dimensions } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import DictionaryScreen from "./pages/DictionaryScreen";
import HomeScreen from "./pages/HomeScreen";
import CourseScreen from "./pages/CourseScreen";
import ProfileScreen from "./pages/ProfileScreen";
import SignUpScreen from "./pages/SignUpScreen";
import LoginScreen from "./pages/LoginScreen";
import * as Progress from 'react-native-progress';
import { initDatabase } from "./components/Database.js";

const Tab = createBottomTabNavigator();
const Home = ({ handleLogout }) => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Course') {
              iconName = 'book';
            } else if (route.name === 'Dictionary') {
              iconName = 'search';
            } else if (route.name === 'Profile') {
              iconName = 'person';
            }
            return <Icon name={iconName} size={35} color={color}/>;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'black',
          tabBarStyle: {elevation: 0, shadowOpacity: 0, marginLeft: Dimensions.get('window').width/20, height: 90, marginBottom: 25, width: '90%', alignSelf:'center', borderRadius: 45, position:'absolute'},
          tabBarShowLabel: false,
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Course" component={CourseScreen} />
        <Tab.Screen name="Dictionary" component={DictionaryScreen} />
        <Tab.Screen name="Profile"
          children={() => <ProfileScreen handleLogout={handleLogout} />}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  const [isMember, setIsMember] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const setup = async () => {
      try {
        await AsyncStorage.removeItem('init')
        const init = await AsyncStorage.getItem('init');
        if (init === null) {
          await initDatabase();
          await AsyncStorage.setItem('init', 'true');
        }
      } catch (error) {
        AsyncStorage.removeItem('init');
        console.error('Error during setup:', error);
      } finally {
        setLoading(false);
      }
    };
    setup();
  }, []);

  const togglePage = () => setIsMember(!isMember);
  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  if(isLoading){
    return(
      <View style={{justifyContent:'center', alignItems:'center', flex:1}}>
        <Progress.Circle
          indeterminate={true}
          color="#3A94E7"
          size={30}
        />
      </View>
    )
  }

  return (
    <View style={[{flex:1, justifyContent:'center'}]}>
      {isLoggedIn ? (
        <Home handleLogout={handleLogout} />
      ) : isMember ? (
        <LoginScreen handleLogin={handleLogin} togglePage={togglePage} />
      ) : (
        <SignUpScreen togglePage={togglePage} handleLogin={handleLogin} />
      )}
    </View>
  );
}
