import { React, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import CustomInput from '../components/customInput';
import axios from 'axios';
import qs from 'qs';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ togglePage, handleLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const onLoginPress = () => {
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    if (!username || !password) {
      alert('Please fill out all fields.');
      return;
    }
    else {
      AsyncStorage.setItem('loggedIn', 'true');
      handleLogin();
      /*
      axios.post(
        'https://f2a2-2001-ee0-4fcc-7570-d940-f7a-58e9-dd77.ngrok-free.app/login',
        qs.stringify({
          usernameOrEmail: username,
          password: password
        }),
        config
      )
        .then(response => {
          if (response.status == 200) handleLogin();
          else alert('Wrong credentials!');
        })
        .catch(error => {
          alert('Server error!');
        }) 
      */
    }
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        style={styles.logo}
        source={{ uri: 'https://i.ibb.co/HxXVqfS/image-removebg-preview.png' }}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Welcome back.</Text>
      </View>
      <CustomInput
        placeholder="Username"
        placeholderTextColor="grey"
        iconUri="https://img.icons8.com/?id=23264&format=png"
        onChangeText={setUsername}
        value={username}
      />
      <CustomInput
        placeholder="Password"
        placeholderTextColor="grey"
        secureTextEntry
        iconUri="https://img.icons8.com/?id=94&format=png"
        onChangeText={setPassword}
        value={password}
      />

      <TouchableOpacity style={styles.button} onPress={onLoginPress}>
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>
      <View style={styles.signupContainer}>
        <Text style={{ fontSize: 16, fontStyle: 'italic' }}>Don't have an account? </Text>
        <TouchableOpacity onPress={togglePage}>
          <Text style={[styles.signupText, { fontSize: 16 }]}>Sign up here!</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f4ff',
  },
  logo: {
    width: 250,
    height: 250,
    margin: '5%',
    alignContent: 'center',
  },
  textContainer: {
    width: '100%',
    alignItems: 'flex-start',
    marginLeft: 40,
  },
  title: {
    fontSize: 45,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2a4dbf',
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: "#2a4dbf",
    padding: 10,
    borderRadius: 15,
    width: "50%",
    alignSelf: "flex-end",
    marginTop: 20,
    marginRight: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    paddingVertical: 5,
    textAlign: "center",
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 100,
    marginBottom: 20,
  },
  signupText: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
