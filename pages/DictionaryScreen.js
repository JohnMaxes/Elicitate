import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import CustomSearchBar from '../components/customSearchBar';

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

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#CCE6FA",
  },
  contentScroll: {
    paddingHorizontal: 25,
    paddingBottom: 200,
  },
});

export default DictionaryScreen;
