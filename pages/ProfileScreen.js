import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { GlobalContext } from '../components/context';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ setIsLoggedIn }) => {
  const navigation = useNavigation();
  const { contextUsername, streakCount, timeSpent, pfp, removeContext, isDarkMode, setIsDarkMode } = useContext(GlobalContext);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    const getNotificationSettings = async () => {
      const enabled = await AsyncStorage.getItem('notificationsEnabled');
      setNotificationsEnabled(enabled === 'true');
    };
    getNotificationSettings();
  }, []);

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access notifications was denied');
      }
    };
    requestPermissions();
  }, []);

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: true,
      }),
    });
  }, []);

  const handleLogout = async () => {
    setIsLoggedIn(false);
    console.log('logging out');
    await removeContext();
    await removeJWT();
  };

  const toggleDarkMode = async () => {
    const newDarkModeState = !isDarkMode;
    setIsDarkMode(newDarkModeState);
    console.log(`Dark mode ${newDarkModeState ? 'enabled' : 'disabled'}`);

    if (notificationsEnabled) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Elicitate",
          body: `Dark mode ${newDarkModeState ? 'enabled' : 'disabled'}!`,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          sound: 'default',
        },
        trigger: {
          seconds: 1,
        },
      });
    }
  };

  const toggleNotifications = async () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    await AsyncStorage.setItem('notificationsEnabled', newValue.toString());
    console.log(`Notifications ${newValue ? 'enabled' : 'disabled'}`);

    if (newValue) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access notifications was denied');
        setNotificationsEnabled(false);
        await AsyncStorage.setItem('notificationsEnabled', 'false');
      } else {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Elicitate",
            body: "Notifications enabled!",
            priority: Notifications.AndroidNotificationPriority.HIGH,
            sound: 'default',
          },
          trigger: {
            seconds: 1,
          },
        });
      }
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
  };

  const styles = getStyles(isDarkMode);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Screen</Text>
      <TouchableOpacity style={styles.profileCard} onPress={() => navigation.navigate('ProfileDetails')}>
        {pfp ? (
          <Image
            source={{ uri: pfp }} // Use Base64 string
            style={styles.avatar}
          />
        ) : (
          <Image source={require('../assets/default-pfp.png')} style={styles.avatar} />
        )}
        <View>
          <Text style={styles.name}>{contextUsername}</Text>
          <Text style={styles.username}>{contextUsername}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.metrics}>
        <View style={styles.metricBox}>
          <Text style={styles.metricValue}>{
            (timeSpent / 3600 >= 1) ? (Math.floor(timeSpent / 3600) + 'h' + Math.floor(timeSpent / 60) + 'm') : (Math.floor(timeSpent / 60) + 'm')
          }</Text>
          <Text style={styles.metricLabel}>Time spent</Text>
          <View style={{ height: 10 }} />
          <Text style={styles.metricValue}>{69}</Text>
          <Text style={styles.metricLabel}>Words learned</Text>
        </View>
        <View style={[styles.metricBox, styles.circleBox]}>
          <View style={styles.circle}>
            <Text style={styles.circleNumberText}>{23}</Text>
            <Text style={styles.circleDayText}>Days</Text>
          </View>
        </View>
      </View>

      <View style={styles.settings}>
        <TouchableOpacity style={styles.settingRow}>
          <View style={styles.settingIcon}>
            <Ionicons name='notifications-outline' size={30} color={'black'} />
          </View>
          <Text style={styles.settingText}>Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            style={styles.switch}
          />
        </TouchableOpacity>
        <View style={styles.settingRow}>
          <View style={styles.settingIcon}>
            <Ionicons name='contrast-outline' size={30} color={'black'} />
          </View>
          <Text style={styles.settingText}>Dark mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleDarkMode}
            style={styles.switch}
          />
        </View>
        <TouchableOpacity style={styles.settingRow} onPress={handleLogout}>
          <View style={styles.settingIcon}>
            <Ionicons name='log-out-outline' size={30} color={'black'} />
          </View>
          <Text style={styles.settingText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getStyles = (isDarkMode) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    backgroundColor: isDarkMode ? '#1c294a' : '#CCE6FA',
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 30,
    textAlign: 'center',
    color: isDarkMode ? 'white' : '#03174c',
    marginTop: 20,
    marginBottom: 10,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: isDarkMode ? '#4f54b3' : '#3b94e7',
    borderRadius: 25,
    marginBottom: 20,
    height: Dimensions.get('window').height * 0.2
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#ccc',
    marginRight: 15,
  },
  name: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  username: {
    color: 'white',
    fontSize: 14,
  },
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricBox: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 5,
    backgroundColor: isDarkMode ? '#8199b0' : '#fff',
    borderRadius: 25,
    elevation: 3,
  },
  circleBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 5,
    borderColor: isDarkMode ? 'green' : '#FFA500',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleNumberText: {
    fontSize: 45,
    fontWeight: 'bold',
    color: isDarkMode ? 'green' : '#ff9600',
    marginBottom: -10,
  },
  circleDayText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDarkMode ? 'green' : '#ff9600',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDarkMode ? '#191970' : '#036bfc',
  },
  metricLabel: {
    fontSize: 14,
    color: isDarkMode ? '#483d61' : '#555',
    fontWeight: 'bold',
  },
  settings: {
    marginTop: 10,
    backgroundColor: isDarkMode ? '#8f92cf' : '#fff',
    borderRadius: 10,
    elevation: 2,
    paddingTop: 10, paddingBottom: 10,
    paddingLeft: 20, paddingRight: 20,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  settingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'black',
    flex: 1,
  },
  settingIcon: {
    width: 30,
    height: 30,
    borderRadius: 25,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switch: {
    marginLeft: 'auto',
  },
  fireIconContainer: {
    marginLeft: 8,
  },
  fireIcon: {
    fontSize: 20,
  },
});

export default ProfileScreen;