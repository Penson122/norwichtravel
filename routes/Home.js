import React from 'react';
import { View, Text, StyleSheet, Platform, FlatList } from 'react-native';
/* import { Pack } from '../../../../../../../AppData/Local/Microsoft/TypeScript/2.6/node_modules/@types/tar'; */

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? '5%' : 0, // fix for padding in expo apps on android
    marginRight: '1%',
    marginLeft: '1%',
    backgroundColor: '#3ea01b'
  },
  welcomeTextBox: {
    alignSelf: 'center'
  },
  welcome: {
    fontSize: 25,
    color: '#221e1f'
  },
  welcomeInfo: {
    fontSize: 25,
    color: '#221e1f'
  }
});

const Home = () => {
  return (
    <View style={styles.container}>
      <View style={styles.welcomeTextBox}>
        <Text style={styles.welcome}>Welcome to Norwich Travel!</Text>
        <Text style={styles.welcomeInfo}>Please use the navigation bar down the bottom of your screen for:</Text>
        <FlatList
          data={[ { key: 'Bus Times' }, { key: 'Train Times' }, { key: 'Taxi Numbers' }, { key: 'FLight Times' } ]}
          renderItem={({ item }) => <Text>{item.key}</Text>}
        />
      </View>
    </View>
  );
};

export default Home;
