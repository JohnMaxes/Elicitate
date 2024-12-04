import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Image } from 'react-native';

const ProfileScreen = ({ handleLogout }) => {
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
      
      <View style={styles.profileCard}>
        <Image source={{ uri: 'https://scontent.fsgn5-14.fna.fbcdn.net/v/t39.30808-6/416318714_3478120982442872_833039280433233648_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeGeZz5n0X4YJNG9z10vFLzpxOEqWgQf_gTE4SpaBB_-BPymO5lmMUJjoFaQpHfUpqaGzj0TSAEOi_kb8XJlPq-n&_nc_ohc=GTaI0W_q73kQ7kNvgHvR2Bx&_nc_zt=23&_nc_ht=scontent.fsgn5-14.fna&_nc_gid=AVbKqsYpfdQNzofEMP9ucMr&oh=00_AYD24X4fsHI076DFj3GVxE0AHrVogR9ot3E8oBCJJqjFUg&oe=6756650E' }} style={styles.avatar} />
        <View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.username}>{user.username}</Text>
        </View>
      </View>

      
      <View style={styles.metrics}>
        <View style={styles.metricBox}>
          <Text style={styles.metricValue}>{user.timeSpent}</Text>
          <Text style={styles.metricLabel}>Time spent</Text>
          <View style={{ height: "10" }} />
          <Text style={styles.metricValue}>{user.wordsLearned}</Text>
          <Text style={styles.metricLabel}>Words learned</Text>
        </View>
        <View style={[styles.metricBox, styles.circleBox]}>
          <View style={styles.circle}>
            <Text style={styles.circleNumberText}>{user.streakDays}</Text>
            <Text style={styles.circleDayText}> Days</Text>
          </View>
        </View>
      </View>

      
      <View style={styles.settings}>
        <TouchableOpacity style={styles.settingRow}>
          <View style={styles.settingIcon} />
          <Text style={styles.settingText}>My Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingRow}>
          <View style={styles.settingIcon} />
          <Text style={styles.settingText}>deo biet</Text>
        </TouchableOpacity>
        <View style={styles.settingRow}>
          <View style={styles.settingIcon} />
          <Text style={styles.settingText}>Dark mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleDarkMode}
            style={styles.switch}
          />
        </View>
        <TouchableOpacity style={styles.settingRow} onPress={handleLogout}>
          <View style={styles.settingIcon} />
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
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ccc',
    marginRight: 15,
  },
  name: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  username: {
    color: '#d1d1d1',
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
    marginLeft: -5,
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
    padding: 10,
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
    color: '#333',
    flex: 1,
  },
  settingIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ccc',
    marginRight: 15,
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
