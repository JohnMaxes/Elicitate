import {React, useState}from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, Image} from 'react-native';
import axios from 'axios';
import styles from "../stylesheet";
import CustomInput from '../components/customInput';
const LoginForm = ({ togglePage, handleLogin }) => {
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
    };
  }
    return (
      <ScrollView style={{backgroundColor:'#CCE6FA', margin:0, padding:0}}>
        <View style={styles.header}>
          <Image style={styles.headerImg} source={require('../assets/logoElicitate.png')}/>
          <Text style={styles.heading}>Elicitate</Text>
        </View>
        <CustomInput placeholder="Email" placeholderTextColor="grey" iconUri="https://img.icons8.com/?id=63&format=png" value={email} onChangeText={setEmail}/>
        <CustomInput placeholder="Password" placeholderTextColor="grey" secureTextEntry iconUri="https://img.icons8.com/?id=94&format=png" value={password} onChangeText={setPassword} />
        <View style={styles.forgetContainer}>
          <TouchableOpacity>
            <Text style={{ color: "#d366a4" }}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={onLoginPress}>
          <Text style={styles.buttonText}>LOG IN</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.loginWith}>Or login with</Text>
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity>
            <Image style={styles.socialImg} source={{ uri: "https://img.icons8.com/color/512/facebook-new.png" }} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image style={[styles.socialImg, { width: 65, height: 68 }]} source={{ uri: "https://img.icons8.com/?size=512&id=17949&format=png" }} />
          </TouchableOpacity>
        </View>
        <View style={[styles.toogleTextContainer, {marginTop:-10}]}>
          <Text style={[styles.toggleText, { fontWeight: "normal", color: "black" }]}>
            Don't have an account?{" "}
          </Text>
          <TouchableOpacity onPress={togglePage}>
            <Text style={styles.toggleText}>Sign up here!</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };
export default LoginForm;
  