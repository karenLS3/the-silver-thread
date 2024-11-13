import React, {useState, useRef, useCallback} from 'react';
import {TextInput, Animated, Pressable, StyleSheet} from 'react-native';

function FloatingLabelInput({label, value, onChangeText, keyboardType}) {
  const [isFocused, setIsFocused] = useState(false);
  const [inputLayout, setInputLayout] = useState(null); // Remove type
  const [labelLayout, setLabelLayout] = useState(null); // Remove type
  const inputRef = useRef(null);
  const animationValue = useRef(new Animated.Value(0)).current;

  const animation = toValue => {
    Animated.timing(animationValue, {
      toValue,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const fontSizeAnimation = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [15, 12],
  });

  const fontColorAnimation = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['gray', 'purple'],
  });

  const translateY = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [
      (inputLayout?.height ?? 0) / 2 - (labelLayout?.height ?? 0) / 2,
      -(labelLayout?.height ?? 0),
    ],
  });

  const onTextInputFocus = () => {
    setIsFocused(true);
    animation(1);
  };

  const onTextInputBlur = () => {
    if (!value) {
      setIsFocused(false);
      animation(0);
    }
  };

  const onTextInputLayoutChange = useCallback(e => {
    setInputLayout(e.nativeEvent.layout);
  }, []);

  const onLabelLayoutChange = useCallback(e => {
    setLabelLayout(e.nativeEvent.layout);
  }, []);

  const labelDynamicStyles = {
    fontSize: fontSizeAnimation,
    color: fontColorAnimation,
    transform: [{translateY}],
  };

  return (
    <Pressable
      style={styles.inputBlock}
      onPress={() => inputRef.current.focus()}>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        style={[styles.input, {borderColor: isFocused ? 'purple' : 'gray'}]}
        keyboardType={keyboardType}
        onFocus={onTextInputFocus}
        onBlur={onTextInputBlur}
        onLayout={onTextInputLayoutChange}
      />
      <Animated.Text
        onLayout={onLabelLayoutChange}
        style={[styles.label, labelDynamicStyles]}>
        {label}
      </Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  inputBlock: {
    position: 'relative',
    width: '80%',
    marginVertical: 10,
  },
  input: {
    borderBottomWidth: 1,
    padding: 10,
    fontSize: 15,
    color: '#154444',
    backgroundColor: '#FAEEEE',
  },
  label: {
    position: 'absolute',
    left: 10,
    top: 0,
    color: 'gray',
  },
});

export default FloatingLabelInput;
