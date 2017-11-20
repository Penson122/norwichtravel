import React from 'react';
import { View, Text } from 'react-native';

import Search from '../components/Search';

const Bus = () => {
  let searchTerms = {};
  const searchHandler = (fields) => { searchTerms = { ...fields }; };
  return (
    <View>
      <Search submitHandler={searchHandler} />
      <Text>This is the Bus Page</Text>
    </View>
  );
};

export default Bus;
