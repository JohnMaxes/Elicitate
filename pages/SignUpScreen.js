import { React, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import CustomInput from '../components/customInput';
import styles from '../stylesheet';
import axios from 'axios';

const RegisterForm = ({ togglePage, handleLogin }) => {
    const [registUsername, setRUsername] = useState(''); // Initialize as empty string
    const [registEmail, setREmail] = useState(''); // Initialize as empty string
    const [registPassword, setRPassword] = useState(''); // Initialize as empty string

    const processRequest = async () => {
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
        <ScrollView style={{backgroundColor: '#CCE6FA',}}>
            <View style={styles.header}>
                <Image
                    style={styles.headerImg}
                    source={require('../assets/logoElicitate.png')}
                />
                <Text style={styles.heading}>Create New Account</Text>
            </View>
            <CustomInput
                placeholder="Enter Username"
                placeholderTextColor="grey"
                required
                iconUri="https://img.icons8.com/?id=23264&format=png"
                onChangeText={setRUsername}
                value={registUsername}
            />
            <CustomInput
                placeholder="Enter Email"
                placeholderTextColor="grey"
                required
                iconUri="https://img.icons8.com/?id=63&format=png"
                onChangeText={setREmail}
                value={registEmail}
            />
            <CustomInput
                placeholder="Enter Password"
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
            />
            <TouchableOpacity style={styles.button} onPress={processRequest}>
                <Text style={styles.buttonText}>CREATE</Text>
            </TouchableOpacity>
            <View style={[styles.toogleTextContainer, {marginTop: -10}]}>
                <Text style={[styles.toggleText, { fontWeight: "normal", color: "black" }]}>
                    Already have an account?{" "}
                </Text>
                <TouchableOpacity onPress={togglePage}>
                    <Text style={styles.toggleText}>Login now!</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default RegisterForm;