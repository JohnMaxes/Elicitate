import { React, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';
import { storeJWT } from '../components/jwt';
import CustomInput from '../components/customInput';
import axios from 'axios';
import qs from 'qs';

const SignUpScreen = ({ togglePage, handleLogin }) => {
    const [registUsername, setRUsername] = useState('');
    const [registEmail, setREmail] = useState('');
    const [registPassword, setRPassword] = useState('');
    const [registConfirm, setRConfirm] = useState('');
    const [loading, setLoading] = useState(false);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };
    const processRequest = async () => {
        if (!registUsername || !registEmail || !registPassword || !registConfirm) {
            alert('Please fill out all fields.');
            return;
        }
        if (registPassword !== registConfirm) {
            alert('Passwords do not match.');
            return;
        }
        if (!validateEmail(registEmail)) {
            alert('Invalid Email.');
            return;
        }
        setLoading('true');
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        let a = registUsername;
        let b = registEmail;
        let c = registPassword;
        try {
            const response = await axios.post(
                'https://90fa-14-161-6-190.ngrok-free.app/register',
                qs.stringify({
                    username: a,
                    email: b,
                    password: c
                }),
                config
            );
            if (response.status === 201) {
                console.log(response.data);
                const token = response.data.token;
                console.log(token);
                await storeJWT(token);
                setLoading(false);
                handleLogin();
                togglePage();
            } else {
                setLoading(false);
                alert('Existent username');
            }
        } catch (error) {
            setLoading(false);
            alert(error);
            togglePage();
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image
                style={styles.logo}
                source={{ uri: 'https://i.ibb.co/HxXVqfS/image-removebg-preview.png' }}
            />
            <View style={styles.textContainer}>
                <Text style={styles.title}>Sign Up</Text>
                <Text style={styles.subtitle}>Your journey starts here!</Text>
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
                {!loading ? (<Text style={styles.buttonText}>SIGN UP</Text>)
                    : (
                        <Progress.Circle
                            indeterminate={true}
                            color="white"
                            size={20}
                        />)}
            </TouchableOpacity>
            <View style={styles.signupContainer}>
                <Text style={{ fontSize: 16, fontStyle: 'italic' }}>Already have an account? </Text>
                <TouchableOpacity onPress={togglePage}>
                    <Text style={[styles.signupText, { fontSize: 16 }]}>Log in</Text>
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
        marginTop: '15%',
        alignContent: 'center',
    },
    textContainer: {
        width: '100%',
        alignItems: 'flex-start',
        marginLeft: 40,
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
        alignItems: 'center',
        justifyContent: 'center',
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
