import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import CustomSearchBar from '../components/customSearchBar';
import styles from '../stylesheet';
import CourseCard from '../components/courseCard';

function CourseScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Add logic to handle the search query, e.g., filter courses
  };

  // Test data
  const testCourses = [
    {
      title: "Introduction to React Native",
      subtitle: "Learn the basics of React Native",
      enrolledCount: 350,
      level: "Beginner",
      imageSource: { uri: "https://via.placeholder.com/50" },
      onPress: () => alert("Course clicked!")
    },
    {
      title: "Mastering JavaScript",
      subtitle: "Deep dive into JavaScript",
      enrolledCount: 1200,
      level: "Intermediate",
      imageSource: { uri: "https://via.placeholder.com/50" },
      onPress: () => alert("Course clicked!")
    },
    {
      title: "Advanced React Patterns",
      subtitle: "Master advanced React techniques",
      enrolledCount: 520,
      level: "Advanced",
      imageSource: { uri: "https://via.placeholder.com/50" },
      onPress: () => alert("Course clicked!")
    },
    {
      title: "Introduction to React Native",
      subtitle: "Learn the basics of React Native",
      enrolledCount: 350,
      level: "Beginner",
      imageSource: { uri: "https://via.placeholder.com/50" },
      onPress: () => alert("Course clicked!")
    },
    {
      title: "Mastering JavaScript",
      subtitle: "Deep dive into JavaScript",
      enrolledCount: 1200,
      level: "Intermediate",
      imageSource: { uri: "https://via.placeholder.com/50" },
      onPress: () => alert("Course clicked!")
    },
    {
      title: "Advanced React Patterns",
      subtitle: "Master advanced React techniques",
      enrolledCount: 520,
      level: "Advanced",
      imageSource: { uri: "https://via.placeholder.com/50" },
      onPress: () => alert("Course clicked!")
    }
  ];

  const renderItem = ({ item }) => (
    <CourseCard
      title={item.title}
      subtitle={item.subtitle}
      enrolledCount={item.enrolledCount}
      level={item.level}
      imageSource={item.imageSource}
      onPress={item.onPress}
    />
  );

  return (
    <View style={styles.container}>
      <CustomSearchBar
        placeholder="Find courses..."
        iconUri="https://img.icons8.com/ios-filled/50/000000/search.png"
        onChangeText={handleSearch}
        
      />
      <Text style={[styles.heading,
              {
                textAlign: 'flex-start',
                fontSize: 20,
                marginLeft: 5,
                marginTop: -20,
              },
            ]}
      >My courses</Text>
      <FlatList
        data={testCourses}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ padding: 16, paddingBottom: 200 }}
      />
    </View>
  );
}

export default CourseScreen;
