import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import CustomInput from '../components/customInput';
import * as ImagePicker from 'expo-image-picker';
import { GlobalContext } from '../components/context';
import * as Progress from 'react-native-progress';
import * as ImageManipulator from 'expo-image-manipulator';


const ProfileDetails = ({ navigation }) => {
  const {pfp, resetPfp, contextUsername, contextEmail, setContextUsername, setContextEmail, editUsernameEmail} = useContext(GlobalContext);
  const [profilePicture, setProfilePicture] = useState(pfp);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      if(profilePicture !== pfp) await resetPfp(profilePicture);
      if(newUsername !== '' || newEmail !== '') await editUsernameEmail(newUsername,newEmail);
      if(newUsername !== '') setContextUsername(newUsername);
      if(newEmail !== '') setContextEmail(newEmail);
      setNewUsername(''); setNewEmail('');
      setLoading(false);
      alert('Profile saved!');
    }
    catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const selectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      quality: 0,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    } else {
      console.log('User cancelled image picker');
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => {
              navigation.goBack();
            }
          }
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity 
          onPress={handleSave}
          style={styles.saveButton}
        >
          {loading ? (
            <Progress.Circle
              indeterminate={true}
              color="blue"
              size={20}
            />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.profileImageContainer}>
        <TouchableOpacity style={{alignItems:'center', justifyContent:'center'}} onPress={selectImage}>
          { profilePicture? (
            <Image
              source={{ uri: profilePicture }}
              style={styles.profileImage}
            />
          ) : (
            <Image source={require('../assets/default-pfp.png')} style={styles.profileImage} />
          )}
        </TouchableOpacity>
        <Text style={styles.profileName}>{contextUsername}</Text>
        <Text style={styles.profileEmail}>{contextEmail}</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Edit Username</Text>
        <CustomInput
          placeholder={contextUsername}
          placeholderTextColor="grey"
          iconUri="https://img.icons8.com/name"
          onChangeText={setNewUsername}
          value={newUsername}
        />

        <Text style={styles.label}>Edit Email</Text>
        <CustomInput
          placeholder={contextEmail}
          placeholderTextColor="grey"
          iconUri="https://img.icons8.com/mail"
          keyboardType="email-address"
          maxLength={15}
          onChangeText={setNewEmail}
          value={newEmail}
        />
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
