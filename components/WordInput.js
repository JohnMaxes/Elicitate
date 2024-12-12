import React, { useEffect } from 'react';
import { TextInput, View, StyleSheet, TouchableWithoutFeedback, Keyboard, Dimensions } from 'react-native';

const WordInput = ({ value, inputField, inputSetter, reference, Function }) => {
    useEffect(() => {
        inputSetter(Array(value.length).fill(''));
    }, [value, inputSetter]);

    const handleChange = (text, index) => {
        const newInputs = [...inputField];
        newInputs[index] = text;
        inputSetter(newInputs);

        // Focus the next input if available
        if (text && index < newInputs.length - 1) {
            reference.current[index + 1].focus();
        }

        Function(newInputs.join(''));
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace') {
            const newInputs = [...inputField];
    
            // Delete the character in the current input
            if (newInputs[index]) {
                newInputs[index] = '';
                inputSetter(newInputs);
            } else if (index > 0) {
                // If the current input is already empty, move focus to the previous field
                reference.current[index - 1].focus();
                newInputs[index - 1] = '';
                inputSetter(newInputs);
            }
        }
    };

    const handleSubmitEditing = () => {
        Keyboard.dismiss();
    };

    // Dynamic width
    const inputWidth = Math.min(50, Math.max(30, Dimensions.get('window').width / value.length - 10));
    const inputHeight = Math.min(50, Math.max(30, Dimensions.get('window').height / value.length - 10));

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.pinContainer}>
                {inputField.map((input, index) => (
                    <View style={[styles.innerShadow, { width: inputWidth }]} key={index}>
                        <TextInput
                            style={[styles.input, { width: inputWidth }]}
                            value={input}
                            onChangeText={text => handleChange(text, index)}
                            onKeyPress={(e) => handleKeyPress(e, index)}
                            maxLength={1}
                            ref={el => (reference.current[index] = el)}
                            keyboardType="ascii-capable"
                            textAlign="center"
                            autoCapitalize="none"
                            returnKeyType={index === inputField.length - 1 ? "done" : "next"}
                            onSubmitEditing={handleSubmitEditing}
                            selectTextOnFocus={true} 
                        />
                    </View>
                ))}
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    pinContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 20,
    },
    input: {
        backgroundColor: 'white',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        borderRadius: 5,
        margin: 5,
    },
    innerShadow: {
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
});

export default WordInput;