import { React, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import CustomInput from '../components/customInput';
import axios from 'axios';

const LoginScreen = ({ togglePage, handleLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onLoginPress = () => {
    const config = {
      headers: {
          'Content-Type': 'application/json'
      }
  };
  if (!email || !password) {
    alert('Please fill out all fields.');
    return;
  }
  else 
  {
    handleLogin();
  };
  /*
  const onLoginPress = () => {
      const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    if (!email || !password) {
      alert('Please fill out all fields.');
      return;
    }
    else 
    {
      handleLogin();
    /* enabling API enquiry to backend
        axios.post(
          'https://f8b7-116-109-144-43.ngrok-free.app/login',
          {
            usernameOrEmail: email,
            password: password
          },
          config
        )
        .then(response => {
          if(response.status == 200) handleLogin();
          else alert('Wrong credentials!');
        })
        .catch(error => {
          alert(error);
        })
      }
    */
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
        <CustomInput placeholder="Email" placeholderTextColor="grey" iconUri="https://img.icons8.com/?id=63&format=png" onChangeText={setEmail} />
        <CustomInput placeholder="Password" placeholderTextColor="grey" secureTextEntry iconUri="https://img.icons8.com/?id=94&format=png" onChangeText={setPassword} />
        
        <TouchableOpacity style={styles.button} onPress={onLoginPress}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>
        <View style={styles.signupContainer}>
          <Text style={{fontSize: 16, fontStyle: 'italic'}}>Don't have an account? </Text>
          <TouchableOpacity onPress={togglePage}>
            <Text style={[styles.signupText, {fontSize: 16}]}>Sign up here!</Text>
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
    margin: 50,
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
