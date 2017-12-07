import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View, ViewPropTypes } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

const getIcon = (type) => {
  switch (type) {
    case 'bus':
      return <Ionicons name='md-bus' size={22} color='green' />;
    case 'flight':
      return <Ionicons name='md-plane' size={22} color='green' />;
    case 'train':
      return <Ionicons name='md-train' size={22} color='green' />;
    case 'taxi':
      return <Ionicons name='md-car' size={22} color='green' />;
  }
};

class SearchResult extends Component {
  constructor (props) {
    super(props);
    this.state = {
      icon: getIcon(this.props.type)
    };
  }
  render () {
    return (
      <View style={this.props.viewStyle}>
        <Text style={
          [{ paddingLeft: 10 }, this.props.textStyle]
        }>{this.state.icon}  {this.props.line} {this.props.destination} </Text><Text
          style={[{ textAlign: 'right' }, this.props.textStyle]}>{this.props.time}</Text>
      </View>
    );
  }
}

SearchResult.propTypes = {
  viewStyle: ViewPropTypes.style,
  textStyle: Text.propTypes.style,
  type: PropTypes.string.isRequired,
  line: PropTypes.string.isRequired,
  destination: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired
};

export default SearchResult;
