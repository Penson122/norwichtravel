import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? '5%' : 0, // fix for padding in expo apps on android
    marginRight: '1%',
    marginLeft: '1%'
  },
});

const Taxi = () => {
  return (
    <View style={styles.container}>
      <Text>This is the Taxi page</Text>
    </View>
  );
};

export default Taxi;
