import React, { useEffect } from 'react';
import { TextInput, View, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';

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

            // If the current input is empty, focus on the previous input
            if (newInputs[index] === '' && index > 0) {
                reference.current[index - 1].focus();
            } else {
                // Otherwise, delete the character in the current input
                newInputs[index] = '';
                inputSetter(newInputs);

                // Move focus to the previous input if the current one was cleared
                if (index > 0) {
                    reference.current[index - 1].focus();
                }
            }
        }
    };

    const handleSubmitEditing = () => {
        Keyboard.dismiss();
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.pinContainer}>
                {inputField.map((input, index) => (
                    <View style={styles.innerShadow} key={index}>
                        <TextInput
                            style={styles.input}
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