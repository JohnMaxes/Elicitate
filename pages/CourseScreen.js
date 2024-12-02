// CourseScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheetm, ScrollView } from 'react-native';
import CustomSearchBar from '../components/customSearchBar'; // Adjust the path as needed
import styles from '../stylesheet';

function CourseScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Add logic to handle the search query, e.g., filter courses
  };

  return (
    <View style={styles.container}>
      <CustomSearchBar
        placeholder="Find courses..."
        iconUri="https://img.icons8.com/ios-filled/50/000000/search.png"
        onChangeText={handleSearch}
      />
      <ScrollView contentContainerStyle={styles.contentScroll}>
        <Text
          style={[
            styles.heading,
            {
              textAlign:'flex-start',
              fontSize: 20,
              marginLeft: -20,
              marginTop: -20
            }
          ]}>My courses
        </Text>
          {/* Add logic to display filtered courses based on searchQuery */}
      </ScrollView>
    </View>
  );
}

export default CourseScreen;
