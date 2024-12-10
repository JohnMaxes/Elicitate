import React, { useState, useEffect } from "react";
import { View, Dimensions, Platform } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import DictionaryScreen from "./pages/DictionaryScreen";
import HomeScreen from "./pages/HomeScreen";
import CourseScreen from "./pages/CourseScreen";
import ProfileScreen from "./pages/ProfileScreen";
import ProfileDetails from './pages/ProfileDetails';
import SignUpScreen from "./pages/SignUpScreen";
import LoginScreen from "./pages/LoginScreen";
import * as Notifications from 'expo-notifications';
import * as Progress from 'react-native-progress';
import { initDatabase } from "./components/Database.js";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const BottomTab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ProfileStack = ({ handleLogout }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileScreen">
        {props => <ProfileScreen {...props} handleLogout={handleLogout} />}
      </Stack.Screen>
      <Stack.Screen 
        name="ProfileDetails" 
        component={ProfileDetails} 
        options={{ 
          headerShown: false,
          headerTitle: 'Profile Details',
          tabBarStyle: { display: 'none' } 
        }} 
      />
    </Stack.Navigator>
  );
};

const Home = ({ handleLogout }) => {
  return (
    <NavigationContainer>
      <BottomTab.Navigator
        initialRouteName='Home'
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
            return <Icon name={iconName} size={35} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'black',
          tabBarStyle: {
            elevation: 0,
            shadowOpacity: 0,
            marginLeft: Dimensions.get('window').width / 20,
            height: 80,
            marginBottom: 20,
            width: '90%',
            alignSelf: 'center',
            borderRadius: 45,
            position: 'absolute',
            paddingBottom: 0,
          },
          tabBarShowLabel: false,
          headerShown: false,
        })}
      >
        <BottomTab.Screen name="Home" component={HomeScreen} />
        <BottomTab.Screen name="Course" component={CourseScreen} />
        <BottomTab.Screen name="Dictionary" component={DictionaryScreen} />
        <BottomTab.Screen name="Profile">
          {props => <ProfileStack {...props} handleLogout={handleLogout} />}
        </BottomTab.Screen>
      </BottomTab.Navigator>
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
        await AsyncStorage.removeItem('init');
        const init = await AsyncStorage.getItem('init');
        if (init === null) {
          await initDatabase();
          await AsyncStorage.setItem('init', 'true');
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
  
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
  
          if (finalStatus === 'granted') {
            Notifications.setNotificationHandler({
              handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true, // Ensure sound is played
                shouldSetBadge: true,
              }),
            });
  
            await Notifications.scheduleNotificationAsync({
              content: {
                title: "A word",
                body: "Its subtitle",
                // Add more options for visibility if necessary
                priority: Notifications.AndroidNotificationPriority.HIGH, // This is key
                sound: 'default', // Ensure a sound is played
              },
              trigger: {
                seconds: 10,
              },
            });
          } else {
            alert('No notifications will be sent, you can toggle this in the settings!');
          }
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

  if (isLoading) {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <Progress.Circle
          indeterminate={true}
          color="#3A94E7"
          size={30}
        />
      </View>
    )
  }

  return (
  <GestureHandlerRootView>
    <View style={[{ flex: 1, justifyContent: 'center' }]}>
      {isLoggedIn ? (
        <Home handleLogout={handleLogout} />
      ) : isMember ? (
        <LoginScreen handleLogin={handleLogin} togglePage={togglePage} />
      ) : (
        <SignUpScreen togglePage={togglePage} handleLogin={handleLogin} />
      )}
    </View>
  </GestureHandlerRootView>
  );
}