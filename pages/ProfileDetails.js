import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import CustomInput from '../components/customInput';
import { launchImageLibrary } from 'react-native-image-picker';


const ProfileDetails = ({ navigation }) => {
  const handleSave = () => {
    // Handle save action
    console.log('Profile saved!');
    navigation.goBack();
  };



  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity 
          onPress={handleSave}
          style={styles.saveButton}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.profileImageContainer}>
        <Image source={require('../assets/default-pfp.png')} style={styles.profileImage} />
        <Text style={styles.profileName}>Thinh dep trai vai</Text>
        <Text style={styles.profileEmail}>@thinhtucuto</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>doi ten?</Text>
        <CustomInput
          placeholder="thinh cu bu"
          placeholderTextColor="grey"
          iconUri="https://img.icons8.com/name"
        />

        <Text style={styles.label}>doi sdt?</Text>
        <CustomInput
          placeholder="0123456789"
          placeholderTextColor="grey"
          iconUri="https://img.icons8.com/phone"
          keyboardType="phone-pad"
          maxLength={15}
        />

        <Text style={styles.label}>Gender</Text>
        <View style={styles.pickerContainer}>
          <Picker style={styles.picker}>
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="gay = bao dang" value="gay" />
          </Picker>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cce6fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 40,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    fontSize: 16,
    color: 'blue',
    fontWeight: '600',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ffd6d6',
  },
  profileName: {
    fontSize: 18,
    marginTop: 12,
    fontFamily:'Poppins-Bold',
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontFamily:'Poppins-Bold',
  },
  formContainer: {
    padding: 16,
  },
  label: {
    fontFamily:'Inter-Bold',
    fontSize: 14,
    color: '#333',
    marginLeft: '5%',
  },
  pickerContainer: {
    width: '90%',
    marginVertical: 8,
    padding: 5,
    alignSelf: 'center',
    borderWidth: 1.5,
    borderColor: 'grey',
    borderRadius: 15,
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default ProfileDetails;
