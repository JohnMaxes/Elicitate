// CourseCard.js (Reusable component)
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CourseCard = ({ 
  title, 
  subtitle,
  level,
  navigation
  /* 
  enrolledCount, 
  level, 
  imageSource,
  onPress 
  */
}) => {
    return (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("CourseViewScreen", {title, subtitle, level})}>
            <View style={styles.contentContainer}>
              <Image source={{ uri: 'https://media.istockphoto.com/id/1162167657/photo/hand-painted-background-with-mixed-liquid-blue-and-golden-paints-abstract-fluid-acrylic.jpg?s=612x612&w=0&k=20&c=DiYltrxEBUFjhhltHriX4WVPRxiPqgQhTBC5R7_C6Ik='}} style={styles.image} />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
              </View>
            </View>
            <View style={{ height: 2, backgroundColor: '#ccc', marginVertical: 10 }} />
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Ionicons name="people-outline" size={16} color="#666" />
                <Text style={styles.infoText}>Some number Enrolled</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="location-outline" size={16} color="#666" />
                <Text style={styles.infoText}>{level}</Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      };

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f7f6fa',
    borderRadius: 20,
    padding: 16,
    marginVertical: 10,
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#0066FF',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
});

export default CourseCard;
