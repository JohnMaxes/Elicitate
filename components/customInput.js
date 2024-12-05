import React from 'react';
import { View, Image, TextInput, StyleSheet, useState} from 'react-native';
import styles from '../stylesheet';

const CustomInput = ({ placeholder, placeholderTextColor, secureTextEntry, iconUri, onChangeText, value, keyboardType, minLength, maxLength }) => {
  return (
    <View style={styles.inputContainer}>
      <Image style={styles.inputIcon} source={{ uri: iconUri }} />
      <TextInput
        style={{ flex: 1 }}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
        value={value}
        keyboardType={keyboardType}
        maxLength={maxLength}
      />
    </View>
  );
};

export default CustomInput;