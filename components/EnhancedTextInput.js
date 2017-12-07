import React from 'react';
import PropTypes from 'prop-types';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%'
  },
  input: {
    width: '90%',
    fontSize: 20
  }
});

const EnhancedTextInput = ({ children, buttonHandler, value, onChangeText, placeholder, editable = true, }) => {
  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={onChangeText}
        placeholder={placeholder}
        editable={editable}
        style={styles.input}
        value={value}
        underlineColorAndroid='transparent'
      />
      <TouchableOpacity onPress={buttonHandler}>
        {children}
      </TouchableOpacity>
    </View>
  );
};

EnhancedTextInput.propTypes = {
  buttonHandler: PropTypes.func,
  value: PropTypes.string,
  onChangeText: PropTypes.func,
  children: PropTypes.node,
  placeholder: PropTypes.string,
  editable: PropTypes.bool
};

export default EnhancedTextInput;
