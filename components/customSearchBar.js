// CustomSearchBar.js
import React, { useState } from 'react';
import { View, Image, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

const CustomSearchBar = ({ placeholder, placeholderTextColor, iconUri, onChangeText }) => {
  const [searchText, setSearchText] = useState('');

  const handleClear = () => {
    setSearchText('');
    onChangeText('');
  };

  return (
    <View style={styles.inputContainer}>
      <Image style={styles.inputIcon} source={{ uri: iconUri }} />
      <TextInput
        style={{ flex: 1 }}
        placeholder={placeholder}
        placeholderTextColor= '#9494a9'
        color= 'black'
        value={searchText}
        onChangeText={(text) => {
          setSearchText(text);
          onChangeText(text);
        }}
      />
      {searchText ? (
        <TouchableOpacity onPress={handleClear}>
          <Image
            style={styles.clearIcon}
            source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/delete-sign.png' }}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f9",
    height: 50,
    borderRadius: 60,
    marginHorizontal: "5%",
    marginVertical: "10%",
    paddingHorizontal: 10,
  },
  inputIcon: {
    height: 40,
    width: 40,
    resizeMode: "center",
    marginRight: 10,
  },
  clearIcon: {
    height: 20,
    width: 20,
    resizeMode: "center",
  },
});

export default CustomSearchBar;
