import React from 'react';
import { View, Text, StyleSheet, Platform, FlatList } from 'react-native';
import { Pack } from '../../../../../../../AppData/Local/Microsoft/TypeScript/2.6/node_modules/@types/tar';

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? '5%' : 0, // fix for padding in expo apps on android
    marginRight: '1%',
    marginLeft: '1%',
    backgroundColor: '#3ea01b'
  },
  welcomeTextBox: {
    textAlign: 'centre',
    color: '#221e1f'
  },
  welcome: {
    fontSize: '25'
  },
  welcomeInfo: {
    fontSize: '15'
  }
});

const Home = () => {
  return (
    <View style={styles.container}>
      <View style={styles.welcomeTextBox}>
        <Text style={styles.welcome}>Welcome to Norwich Travel!</Text>
        <Text style={styles.welcomeInfo}>Please use the navigation bar down the bottom of your screen for:
          <FlatList
            data={[ { key: 'Bus Times' }, { key: 'Train Times' }, { key: 'Taxi Numbers' }, { key: 'FLight Times' } ]}
            renderItem={({ item }) => <Text>{item.key}</Text>}
          />
        </Text>
      </View>
    </View>
  );
};

export default Home;
