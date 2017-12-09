import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

const styles = StyleSheet.create({
  item: {
    width: '100%',
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  text : {
    marginVertical: '1%',
    paddingLeft: '2%',
    fontSize: 16
  }
});

const TaxiResults = ({ taxis, handler }) => {
  return (
    <View>
      {taxis.map((t, i) =>
        <TaxiResult key={i} name={t.name} rating={t.rating} number={t.number} buttonHandler={handler} />)}
    </View>
  );
};

const TaxiResult = ({ name, rating, number, buttonHandler }) => (
  <View style={styles.item} onMagicTap={() => buttonHandler(number)}>
    <Text style={styles.text}>{name}</Text>
    { rating ? <Rating rating={rating} /> : null }
    <CallButton handler={() => buttonHandler(number)} />
  </View>
);

const CallButton = ({ handler }) => (
  <View>
    <TouchableOpacity
      style={{ paddingRight: '5%' }}
      onPress={handler}
      accessibilityLabel='Call Taxi'
      accessibilityTraits='button'>
      <Ionicons name='ios-call' color='green' size={40} />
    </TouchableOpacity>
  </View>
);

const Rating = ({ rating }) => (
  <Text style={[{ right: 0, position: 'absolute', marginRight: '10%' }, styles.text]}>
    <Ionicons name='ios-star' size={28} color='gold' /> {rating.toFixed(1)}
  </Text>
);

TaxiResults.propTypes = {
  taxis: PropTypes.array.isRequired,
  handler: PropTypes.func.isRequired
};

TaxiResult.propTypes = {
  name: PropTypes.string.isRequired,
  rating: PropTypes.number,
  number: PropTypes.string.isRequired,
  buttonHandler: PropTypes.func.isRequired
};

CallButton.propTypes = {
  handler: PropTypes.func.isRequired
};

Rating.propTypes = {
  rating: PropTypes.number.isRequired
};

export default TaxiResults;
