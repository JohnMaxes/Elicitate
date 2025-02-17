import React, { useState, useEffect, useContext, createContext } from "react";
import { View, Dimensions, Platform, TouchableOpacity } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

import DictionaryScreen from "./pages/DictionaryScreen";
import HomeScreen from "./pages/Home.js";
import CourseScreen from "./pages/CourseScreen";
import ProfileScreen from "./pages/ProfileScreen";
import ProfileDetails from './pages/ProfileDetails';
import SignUpScreen from "./pages/SignUpScreen";
import LoginScreen from "./pages/LoginScreen";
import VocabReviewScreen from "./pages/VocabReviewScreen.js";
import { TapGestureHandler } from "react-native-gesture-handler";

import * as Notifications from 'expo-notifications';
import * as Progress from 'react-native-progress';

import { initDatabase } from "./components/Database.js";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Context } from "./components/context.js";


const BottomTab = createBottomTabNavigator();
const Stack = createStackNavigator();
const ReviewStack = createStackNavigator();

const HomeVocabReviewStack = () => {
  return (
    <ReviewStack.Navigator initialRouteName="HomeScreen">
      <ReviewStack.Screen name='HomeScreen' component={HomeScreen} options={{headerShown:false}}/>
      <ReviewStack.Screen name='VocabReviewScreen' component={VocabReviewScreen}
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
    </ReviewStack.Navigator>
  )
}

const ProfileStack = ({ setIsLoggedIn }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileScreen">
        {props => <ProfileScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
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

const HomeBottomTab = ({ setIsLoggedIn }) => {
  return (
    <NavigationContainer>
        <BottomTab.Navigator
          initialRouteName='Home'
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;
              if (route.name === 'HomeVocabReviewStack') {
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
          <BottomTab.Screen name="HomeVocabReviewStack" component={HomeVocabReviewStack} />
          <BottomTab.Screen name="Course" component={CourseScreen} />
          <BottomTab.Screen name="Dictionary" component={DictionaryScreen} />
          <BottomTab.Screen name="Profile">
            {props => <ProfileStack {...props} setIsLoggedIn={setIsLoggedIn} />}
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
                shouldPlaySound: false,
                shouldSetBadge: true,
              }),
            });

            await Notifications.scheduleNotificationAsync({
              content: {
                title: "Elicitate",
                body: "Welcome to Elicitate!",
                priority: Notifications.AndroidNotificationPriority.HIGH,
                sound: 'default',
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
        try {
          const token = await AsyncStorage.getItem('token');
          if (token !== null) {
            console.log(token);
            setIsLoggedIn(true);
          }
        } catch (error) {
          console.error('Error retrieving data:', error);
        }
        setLoading(false);
      }
    };
    setup();
  }, []);

  const togglePage = () => setIsMember(!isMember);
  const handleLogin = () => setIsLoggedIn(true);

  if (isLoading) {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <Progress.Circle indeterminate={true} color="#3A94E7" size={30} />
      </View>
    );
  }

  return (
  <Context>
    <GestureHandlerRootView>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        {isLoggedIn ? (
          <HomeBottomTab setIsLoggedIn={setIsLoggedIn} />
        ) : isMember ? (
          <LoginScreen handleLogin={handleLogin} togglePage={togglePage} />
        ) : (
          <SignUpScreen togglePage={togglePage} handleLogin={handleLogin} />
        )}
      </View>
    </GestureHandlerRootView>
  </Context>
  );
}