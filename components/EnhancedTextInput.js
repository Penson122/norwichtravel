import React from 'react';
import PropTypes from 'prop-types';
import { View, TextInput, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%'
  },
  input: {
    width: '85%',
    fontSize: 20
  }
});

const EnhancedTextInput = ({ children, value, onChangeText, placeholder, editable = true, }) => {
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
      {children}
    </View>
  );
};

EnhancedTextInput.propTypes = {
  value: PropTypes.string,
  onChangeText: PropTypes.func,
  children: PropTypes.node,
  placeholder: PropTypes.string,
  editable: PropTypes.bool
};

export default EnhancedTextInput;
