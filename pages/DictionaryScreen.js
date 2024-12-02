import React from 'react';
import { View, Text, StyleSheet} from 'react-native';

function DictionaryScreen() {
    return (
      <View style={styles.screen}>
        <Text>Dictionary Screen</Text>
      </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
    }
)

export default DictionaryScreen;
