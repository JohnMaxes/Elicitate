import {React, useState}from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, Image} from 'react-native';
import styles from "../stylesheet";
import CustomInput from '../components/customInput';

const LoginForm = ({ togglePage, handleLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const onLoginPress = () => {
      if (!email || !password) {
        Alert.alert('Incorrect email or password');
        return;
      }
      handleLogin();
    };
  
    return (
      <ScrollView>
        <View style={styles.header}>
          <Image style={styles.headerImg} source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlt-TGjHVh4qzymsShj8a9dkNKBG7rfq2wTg&s" }} />
          <Text style={styles.heading}>Welcome</Text>
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
        <View style={styles.toogleTextContainer}>
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
  