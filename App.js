import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

const CustomInput = ({ placeholder, placeholderTextColor, secureTextEntry, iconUri, onChangeText }) => {
  return (
    <View style={styles.inputContainer}>
      <Image style={styles.inputIcon} source={{ uri: iconUri }} />
      <TextInput
        style={{ flex: 1 }}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
      />
    </View>
  );
};

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
      <CustomInput placeholder="Email" placeholderTextColor="grey" iconUri="https://img.icons8.com/?id=63&format=png" />
      <CustomInput placeholder="Password" placeholderTextColor="grey" secureTextEntry iconUri="https://img.icons8.com/?id=94&format=png" />
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

const RegisterForm = ({ togglePage }) => {
  return (
    <ScrollView>
      <View style={styles.header}>
        <Image
          style={styles.headerImg}
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlt-TGjHVh4qzymsShj8a9dkNKBG7rfq2wTg&s",
          }}
        />
        <Text style={styles.heading}>Create New Account</Text>
      </View>
      <CustomInput
        placeholder="Enter Username"
        placeholderTextColor="grey"
        iconUri="https://img.icons8.com/?id=23264&format=png"
      />
      <CustomInput
        placeholder="Enter Email"
        placeholderTextColor="grey"
        iconUri="https://img.icons8.com/?id=63&format=png"
      />
      <CustomInput
        placeholder="Enter Password"
        placeholderTextColor="grey"
        secureTextEntry
        iconUri="https://img.icons8.com/?id=94&format=png"
      />
      <CustomInput
        placeholder="Confirm Password"
        placeholderTextColor="grey"
        secureTextEntry
        iconUri="https://img.icons8.com/?id=94&format=png"
      />
      <TouchableOpacity style={styles.button} onPress={togglePage}>
        <Text style={styles.buttonText}>CREATE</Text>
      </TouchableOpacity>
      <View style={styles.toogleTextContainer}>
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

function HomeScreen() {
  return (
    <View style={styles.screen}>
      <Text>Home Screen</Text>
    </View>
  );
}

function CategoriesScreen() {
  return (
    <View style={styles.screen}>
      <Text>Categories Screen</Text>
    </View>
  );
}

function FavouritesScreen() {
  return (
    <View style={styles.screen}>
      <Text>Favourites Screen</Text>
    </View>
  );
}

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

const Tab = createBottomTabNavigator();

const Home = ({ handleLogout }) => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Categories') {
              iconName = 'grid';
            } else if (route.name === 'Favourites') {
              iconName = 'heart';
            } else if (route.name === 'Profile') {
              iconName = 'person';
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#2096f0',
          tabBarInactiveTintColor: 'black',
          tabBarStyle: { margin: 0, padding: 0, height: 60 },
          tabBarLabelStyle: { paddingBottom: 4, fontSize: 12 },
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Categories" component={CategoriesScreen} />
        <Tab.Screen name="Favourites" component={FavouritesScreen}
          options={{
            tabBarBadge: 3,
          }}
        />
        <Tab.Screen name="Profile"
          children={() => <ProfileScreen handleLogout={handleLogout} />}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  const [isMember, setIsMember] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const togglePage = () => setIsMember(!isMember);
  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <View style={styles.container}>
      {isLoggedIn ? (
        <Home handleLogout={handleLogout} />
      ) : isMember ? (
        <LoginForm handleLogin={handleLogin} togglePage={togglePage} />
      ) : (
        <RegisterForm togglePage={togglePage} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginTop: 40,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  headerImg: {
    borderRadius: 75,
    width: 100,
    height: 100,
  },
  socialImg: {
    width: 70,
    height: 70,
    paddingHorizontal: 10,
  },
  heading: {
    fontSize: 30,
    textAlign: "center",
    padding: 20,
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "black",
    height: 60,
    borderRadius: 15,
    marginHorizontal: "5%",
    marginVertical: 10,
  },
  inputIcon: {
    padding: 10,
    marginLeft: 10,
    marginRight: 5,
    height: 40,
    width: 40,
    resizeMode: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#e87404",
    padding: 10,
    borderRadius: 15,
    width: "90%",
    alignSelf: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    paddingVertical: 5,
    textAlign: "center",
  },
  toogleTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  toggleText: {
    color: "blue",
    textAlign: "center",
    marginTop: 20,
    fontWeight: "bold",
    fontSize: 17,
  },
  forgetContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: "10%",
  },
  loginWith: {
    textAlign: "center",
    marginTop: 30,
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  loggedInContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 20,
  },
});
