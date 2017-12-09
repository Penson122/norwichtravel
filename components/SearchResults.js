import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import SearchResult from './SearchResult';

const styles = StyleSheet.create({
  item: {
    // height: '10%',
    // marginBottom: '5%',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: '2%'
  },
  text: {
    marginBottom: '1.5%',
    textAlign: 'left',
    position: 'relative',
    fontSize: 16
  }
});

class SearchResults extends Component {
  render () {
    return (
      <View style={this.props.style} >
        { this.props.results.map((r, i) =>
          <SearchResult
            viewStyle={styles.item}
            textStyle={styles.text}
            key={i}
            type={this.props.type}
            line={r[this.props.lineKey]}
            destination={r[this.props.destinationKey]}
            time={r.aimed_departure_time}
          />)}
      </View>
    );
  }
}

SearchResults.propTypes = {
  results: PropTypes.array.isRequired,
  style: PropTypes.object,
  lineKey: PropTypes.string.isRequired,
  destinationKey: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
};

export default SearchResults;
