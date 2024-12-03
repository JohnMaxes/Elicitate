import { React, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import CustomInput from '../components/customInput';
import axios from 'axios';

const SignUpScreen = ({ togglePage, handleLogin }) => {
    const [registUsername, setRUsername] = useState(''); // Initialize as empty string
    const [registEmail, setREmail] = useState(''); // Initialize as empty string
    const [registPassword, setRPassword] = useState(''); // Initialize as empty string
    const [registConfirm, setRConfirm] = useState(''); // Initialize as empty string

    const processRequest = async () => {
        if (!registUsername || !registEmail || !registPassword || !registConfirm) {
            alert('Please fill out all fields.');
            return;
        }
        if (registPassword !== registConfirm) {
            alert('Passwords do not match.');
            return;
        }
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        let a = registUsername;
        let b = registEmail;
        let c = registPassword;
        axios.post(
            'https://f8b7-116-109-144-43.ngrok-free.app/register',
            {
                username: a,
                email: b,
                password: c,
            },
            config
        )
        .then(response => {
            if (response.status === 201) {
              alert('Account created!');
              handleLogin();
            }
            else alert('Existent username');
        })
        .catch(error => {
            alert(error);
            togglePage();
        });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Image
                    style={styles.logo}
                    source={{ uri: 'https://i.ibb.co/HxXVqfS/image-removebg-preview.png' }}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Sign Up</Text>
                    <Text style={styles.subtitle}>Your journey starts here!</Text>
                </View>
            </View>
            <CustomInput
                placeholder="Username"
                placeholderTextColor="grey"
                required
                iconUri="https://img.icons8.com/?id=23264&format=png"
                onChangeText={setRUsername}
                value={registUsername}
            />
            <CustomInput
                placeholder="Email"
                placeholderTextColor="grey"
                required
                iconUri="https://img.icons8.com/?id=63&format=png"
                onChangeText={setREmail}
                value={registEmail}
            />
            <CustomInput
                placeholder="Password"
                placeholderTextColor="grey"
                secureTextEntry
                required
                iconUri="https://img.icons8.com/?id=94&format=png"
                onChangeText={setRPassword}
                value={registPassword}
            />
            <CustomInput
                placeholder="Confirm Password"
                placeholderTextColor="grey"
                secureTextEntry
                required
                iconUri="https://img.icons8.com/?id=94&format=png"
                onChangeText={setRConfirm}
                value={registConfirm}
            />
            <TouchableOpacity style={styles.button} onPress={processRequest}>
                <Text style={styles.buttonText}>SIGN UP</Text>
            </TouchableOpacity>
            <View style={styles.signupContainer}>
                <Text style={{fontSize: 16, fontStyle: 'italic'}}>Already have an account? </Text>
                <TouchableOpacity onPress={togglePage}>
                    <Text style={[styles.signupText, {fontSize: 16}]}>Log in</Text>
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
      margin: 30,
      alignContent: 'center',
    },
    textContainer: {
      width: '100%',
      alignItems: 'flex-start',
      marginLeft: -15,
    },
    title: {
      fontSize: 40,
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
      marginTop: 20,
      marginBottom: 50,
    },
    signupText: {
      color: '#007BFF',
      fontWeight: 'bold',
    },
});

export default SignUpScreen;
