import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = ({ handleLogout }) => {
  const navigation = useNavigation();

  // Test data
  const user = {
    name: 'Thinh dep trai vai',
    username: '@thinhtucuto',
    timeSpent: 'De dit me may',
    wordsLearned: 69,
    streakDays: 23,
  };

  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const toggleDarkMode = () => setIsDarkMode((previousState) => !previousState);

  return (
    <View style={styles.container}>
      
      <TouchableOpacity style={styles.profileCard} onPress={() => navigation.navigate('ProfileDetails')}>
        <Image style={styles.avatar} source={{ uri: 'https://assets.manutd.com/AssetPicker/images/0/0/17/99/1139542/NPS_Landscape_091662019315265_medium.jpg' }}/>
        <View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.username}>{user.username}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.metrics}>
        <View style={styles.metricBox}>
          <Text style={styles.metricValue}>{user.timeSpent}</Text>
          <Text style={styles.metricLabel}>Time spent</Text>
          <View style={{ height: 10 }} />
          <Text style={styles.metricValue}>{user.wordsLearned}</Text>
          <Text style={styles.metricLabel}>Words learned</Text>
        </View>
        <View style={[styles.metricBox, styles.circleBox]}>
          <View style={styles.circle}>
            <Text style={styles.circleNumberText}>{user.streakDays}</Text>
            <Text style={styles.circleDayText}>Days</Text>
          </View>
        </View>
      </View>

      <View style={styles.settings}>
        <TouchableOpacity style={styles.settingRow}>
          <View style={styles.settingIcon}>
            <Ionicons name='settings-outline' size={30} color='black'/>
          </View>
          <Text style={styles.settingText}>Settings</Text>
        </TouchableOpacity>
        <View style={styles.settingRow}>
          <View style={styles.settingIcon}>
            <Ionicons name='contrast-outline' size={30} color='black'/>
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
            <Ionicons name='log-out-outline' size={30} colo='black'/>
          </View>
          <Text style={styles.settingText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#cce6fa',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#3b94e7',
    borderRadius: 10,
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
    backgroundColor: '#fff',
    borderRadius: 10,
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
    borderColor: '#FFA500',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  circleNumberText: {
    fontSize: 45,
    fontWeight: 'bold',
    color: '#ff9600',
    marginBottom: -10,
  },
  circleDayText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff9600',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#036bfc',
  },
  metricLabel: {
    fontSize: 14,
    color: '#555',
    fontWeight: 'bold',
  },
  settings: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
    paddingTop: 10, paddingBottom: 10,
    paddingLeft: 20, paddingRight: 20,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingText: {
    fontSize: 16,
    fontFamily:'Inter-Regular',
    color: '#333',
    flex: 1,
  },
  settingIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 15,
    justifyContent: 'center',
    alignItems:'center',
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