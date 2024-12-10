import React, { useState, useRef, useEffect } from 'react';
import { TextInput, View, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';

const WordInput = ({ value, onComplete }) => {
    const [inputs, setInputs] = useState([]);
    const inputRefs = useRef([]);

    // Set the inputs based on the length of the provided value
    useEffect(() => {
        setInputs(Array(value.length).fill(''));
    }, [value]);

    const handleChange = (text, index) => {
        const newInputs = [...inputs];
        newInputs[index] = text;
        setInputs(newInputs);

        if (text && index < newInputs.length - 1) {
            setTimeout(() => {
                inputRefs.current[index + 1].focus();
            }, 0);
        }

        if (newInputs.every(input => input.length > 0)) {
            onComplete(newInputs.join(''));
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && inputs[index] === '') {
            if (index > 0) {
                inputRefs.current[index - 1].focus();
            }
        }
    };

    const handleSubmitEditing = () => {
        // Dismiss the keyboard when the user presses "Done"
        Keyboard.dismiss();
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.pinContainer}>
                {inputs.map((input, index) => (
                    <View style={styles.innerShadow} key={index}>
                        <TextInput
                            style={styles.input}
                            value={input}
                            onChangeText={text => handleChange(text, index)}
                            onKeyPress={(e) => handleKeyPress(e, index)}
                            maxLength={1}
                            ref={el => inputRefs.current[index] = el}
                            keyboardType="ascii-capable"
                            textAlign="center"
                            autoCapitalize="none"
                            returnKeyType={index === inputs.length - 1 ? "done" : "next"} // Set "Done" for the last input
                            onSubmitEditing={handleSubmitEditing} // Handle "Done" press
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
        justifyContent: 'space-between',
        marginTop: 20,
    },
    input: {
        backgroundColor: 'white',
        width: 40,
        height: 40,
        textAlign: 'center',
        fontSize: 24,
        borderRadius: 5,
    },
    innerShadow: {
        marginLeft: 5,
        marginRight: 5,
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