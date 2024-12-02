import React, { useState } from 'react';
import { View, Text, StyleSheetm, ScrollView } from 'react-native';
import CustomSearchBar from '../components/customSearchBar'; // Adjust the path as needed
import styles from '../stylesheet';

function DictionaryScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Add logic to handle the search query, e.g., filter Dictionarys
  };

  return (
    <View style={styles.container}>
      <CustomSearchBar
        placeholder="Search for words..."
        iconUri="https://img.icons8.com/ios-filled/50/000000/search.png"
        onChangeText={handleSearch}
      />
      <ScrollView contentContainerStyle={styles.contentScroll}>
          {/* Add logic to display filtered Dictionarys based on searchQuery */}
      </ScrollView>
    </View>
  );
}

export default DictionaryScreen;
