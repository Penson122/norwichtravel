import React, { Component } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import AutoComplete from './AutoComplete';

const styles = StyleSheet.create({
  input: {
  },
  autocomplete: {
    zIndex: 10
  },
  button: {
    width: 5
  }
});

class Search extends Component {
  constructor (props) {
    super(props);
    this.state = {
      expanded: props.expanded,
    };
  }
  render () {
    return (
      <View style={styles.container}>
        <View>
          <TextInput
            autoFocus
            placeholder={this.props.placeholder.origin}
            onChangeText={this.props.onOriginChange}
            value={this.props.originText}
            editable={this.props.defaults.origin}
            returnKeyType='next'
            style={{
              height: 40,
              marginBottom: '2%',
              width: this.props.options.destination ? '85%' : '100%' }}
          />
          {this.props.options.destination
            ? <MaterialCommunityIcons
              style={{
                alignSelf: 'flex-end',
                top: 25,
                position: 'absolute',
                right: 10,
              }}
              name='swap-vertical'
              size={40}
              color='black'
              onPress={this.props.switch}
            />
            : null}
          <AutoComplete
            selectionHandler={this.props.onOriginSelect}
            style={styles.autocomplete}
            listItems={this.props.originAutoComplete}
          />
        </View>
        { this.props.options.destination
          ? <View>
            <TextInput
              style={{ height: 40, marginBottom: '2%', width: '85%' }}
              onChangeText={this.props.onDestinationChange}
              value={this.props.destinationText}
              editable={(this.props.defaults.destination)}
              returnKeyType='next'
            />
            <AutoComplete
              selectionHandler={this.props.onDestinationSelect}
              style={styles.autocomplete}
              listItems={this.props.destinationAutoComplete}
            />
          </View>
          : null
        }
        <Button
          onPress={() => this.props.submitHandler(this.props.originText, this.props.destinationText)}
          title='Submit'
          color='#841584'
          accessibilityLabel='Submit search terms'
          style={{ width: 100 }}
        />
      </View>
    );
  }
}

Search.propTypes = {
  placeholder: PropTypes.shape({
    origin: PropTypes.string.isRequired,
    destination: PropTypes.string,
    arrivalTime: PropTypes.string,
    departureTime: PropTypes.string,
    arrivalDate: PropTypes.string,
    departureDate: PropTypes.string,
  }).isRequired,
  defaults: PropTypes.shape({
    origin: PropTypes.boolean,
    destination: PropTypes.boolean,
    arrivalTime: PropTypes.boolean,
    departureTime: PropTypes.boolean,
    arrivalDate: PropTypes.boolean,
    departureDate: PropTypes.boolean,
  }),
  expanded: PropTypes.bool,
  options: PropTypes.shape({
    destination: PropTypes.boolean,
    depTime: PropTypes.boolean,
    arrivTime: PropTypes.boolean,
    depDate: PropTypes.boolean,
    arrivDate: PropTypes.boolean
  }).isRequired,
  submitHandler: PropTypes.func.isRequired,
  onOriginChange: PropTypes.func.isRequired,
  onDestinationChange: PropTypes.func,
  onOriginSelect: PropTypes.func.isRequired,
  onDestinationSelect: PropTypes.func,
  originText: PropTypes.string.isRequired,
  destinationText: PropTypes.string,
  originAutoComplete: PropTypes.array.isRequired,
  destinationAutoComplete: PropTypes.array,
  switch: PropTypes.func,
};

export default Search;
