import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

import Search from '../components/Search';

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? '5%' : 0, // fix for padding in expo apps on android
    marginRight: '1%',
    marginLeft: '1%'
  },
});

const submit = () => { return undefined; };

const near = () => { return undefined; };

const Train = () => {
  return (
    <View style={styles.container}>
      <Search
        placeholder={{ origin: 'Search Station' }}
        options={{ destination: true }}
        submitHandler={submit}
        nearHandler={near}
        defaults={{ destination: 'NRW' }}
      />
    </View>
  );
};

export default Train;
