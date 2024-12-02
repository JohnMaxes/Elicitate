import React, { useState } from "react";
import { View } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Icon from 'react-native-vector-icons/Ionicons';

import DictionaryScreen from "./pages/DictionaryScreen";
import HomeScreen from "./pages/HomeScreen";
import CourseScreen from "./pages/CourseScreen";
import ProfileScreen from "./pages/ProfileScreen";
import SignUpScreen from "./pages/SignUpScreen";
import LoginScreen from "./pages/LoginScreen";
import styles from "./stylesheet";

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
              iconName = 'grid';
            } else if (route.name === 'Dictionary') {
              iconName = 'heart';
            } else if (route.name === 'Profile') {
              iconName = 'person';
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'blue',
          tabBarInactiveTintColor: 'black',
          tabBarStyle: {margin: 20, height: 80, width: '90%', alignSelf:'center', borderRadius: 30, position:'absolute'},
          tabBarShowLabel: false,
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Course" component={CourseScreen} />
        <Tab.Screen name="Dictionary" component={DictionaryScreen}
          options={{
            tabBarBadge: 3,
          }}
        />
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

  const togglePage = () => setIsMember(!isMember);
  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <View style={[styles.container, {padding: 0, margin: 0}]}>
      {isLoggedIn ? (
        <Home handleLogout={handleLogout} />
      ) : isMember ? (
        <LoginForm handleLogin={handleLogin} togglePage={togglePage} />
      ) : (
        <RegisterForm togglePage={togglePage} handleLogin={handleLogin} />
      )}
    </View>
  );
}
