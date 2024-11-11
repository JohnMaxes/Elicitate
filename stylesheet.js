import React from 'react'
import { StyleSheet } from 'react-native'

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

export default styles;