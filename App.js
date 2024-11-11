import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Icon from 'react-native-vector-icons/Ionicons';
import FavouritesScreen from "./pages/FavouritesScreen";
import HomeScreen from "./pages/HomeScreen";
import CategoriesScreen from "./pages/CategoriesScreen";
import ProfileScreen from "./pages/ProfileScreen";
import RegisterForm from "./pages/SignUpScreen";
import LoginForm from "./pages/LoginScreen";
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
            } else if (route.name === 'Categories') {
              iconName = 'grid';
            } else if (route.name === 'Favourites') {
              iconName = 'heart';
            } else if (route.name === 'Profile') {
              iconName = 'person';
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#2096f0',
          tabBarInactiveTintColor: 'black',
          tabBarStyle: { margin: 0, padding: 0, height: 60 },
          tabBarLabelStyle: { paddingBottom: 4, fontSize: 12 },
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Categories" component={CategoriesScreen} />
        <Tab.Screen name="Favourites" component={FavouritesScreen}
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
    <View style={styles.container}>
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