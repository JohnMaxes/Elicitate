import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
function ProfileScreen({ handleLogout }) {
    return (
      <View style={styles.screen}>
        <Text style={{paddingBottom: 10}}>Profile Screen</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={{padding: 10, backgroundColor: '#2096f0', color: 'white'}}>LOG OUT</Text>
        </TouchableOpacity>
      </View>
    );
  }

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#CCE6FA',
      },
    }
)
 
export default ProfileScreen;