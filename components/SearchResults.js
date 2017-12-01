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
  },
  text: {
    textAlign: 'left',
    position: 'relative',
    // top: '50%'
  }
});

class SearchResults extends Component {
  render () {
    return (
      <View style={this.props.style} >
        { this.props.results.map((r, i) => <SearchResult
          viewStyle={styles.item}
          textStyle={styles.text}
          key={i}
          type='bus'
          line={r.line}
          destination={r.direction}
          time={r.aimed_departure_time}
        />)}
      </View>
    );
  }
}

SearchResults.propTypes = {
  results: PropTypes.array.isRequired,
  style: PropTypes.object
};

export default SearchResults;
