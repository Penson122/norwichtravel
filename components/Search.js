import React, { Component } from 'react';
import { View, Button, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

import AutoComplete from './AutoComplete';
import ExtendedSearch from './ExtendedSearch';
import EnhancedTextInput from './EnhancedTextInput';
import LocationButton from './LocationButton';
const styles = StyleSheet.create({
  input: {
    width: '90%',
    marginVertical: '2%',
    marginHorizontal: '2%'
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
      expanded: false,
      expandedIcon: 'ios-arrow-down'
    };
    this.onExpandedSelect = this.onExpandedSelect.bind(this);
  }
  onExpandedSelect () {
    this.setState({
      expanded: !this.state.expanded,
      expandedIcon: !this.state.expanded ? 'ios-arrow-up' : 'ios-arrow-down'
    });
  };
  render () {
    return (
      <View style={styles.container}>
        <View>
          <View style={styles.input}>
            <EnhancedTextInput
              placeholder={this.props.placeholder.origin}
              onChangeText={this.props.onOriginChange}
              value={this.props.originText}
              editable={this.props.defaults.origin}
            >
              { this.props.originText.length > 3
                ? <TouchableOpacity onPress={this.props.clearOriginText}>
                  <Ionicons name='ios-close' size={40} style={{ paddingRight: '5%' }} />
                </TouchableOpacity>
                : null }
              <LocationButton
                handler={() => this.props.getLocation(this.props.originText.length === 0 ? 'origin' : 'destination')}
                color='deepskyblue'
              />
            </EnhancedTextInput>
          </View>
          {this.props.options.destination
            ? <MaterialCommunityIcons
              style={{
                alignSelf: 'flex-end',
                top: 50,
                position: 'absolute',
                right: 5
              }}
              name='swap-vertical'
              size={40}
              color='black'
              onPress={this.props.onSwitch}
            />
            : null}
          {
            this.state.expanded
              ? <ExtendedSearch
                handleTimeSelect={this.props.onOriginTimeChange}
                handleDateSelect={this.props.onOriginDateChange}
                time={this.props.originTime}
                date={this.props.originDate}
              />
              : null
          }
          <AutoComplete
            selectionHandler={this.props.onOriginSelect}
            style={styles.autocomplete}
            listItems={this.props.originAutoComplete}
          />
        </View>
        { this.props.options.destination
          ? <View>
            <View style={styles.input}>
              <EnhancedTextInput
                placeholder={this.props.placeholder.destination}
                buttonHandler={this.props.clearDestinationText}
                onChangeText={this.props.onDestinationChange}
                value={this.props.destinationText}
                editable={(this.props.defaults.destination)}
              >
                { this.props.destinationText.length > 3 && !this.props.defaults.destination
                  ? <TouchableOpacity onPress={this.props.clearDestinationText}>
                    <Ionicons name='ios-close' size={40} style={{ paddingRight: '5%' }} />
                  </TouchableOpacity>
                  : null }
              </EnhancedTextInput>
            </View>
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
          color='#00A1FF'
          accessibilityLabel='Submit search terms'
          disabled={this.props.canSearch}
          style={{ width: 100 }}
        />
        <Ionicons
          accessibilityTraits='button'
          name={this.state.expandedIcon}
          size={40}
          style={{ alignSelf: 'center' }}
          onPress={this.onExpandedSelect}
        />
      </View>
    );
  }
}

Search.propTypes = {
  placeholder: PropTypes.shape({
    origin: PropTypes.string.isRequired,
    destination: PropTypes.string,
  }).isRequired,
  defaults: PropTypes.shape({
    origin: PropTypes.boolean,
    destination: PropTypes.boolean,
    arrivalTime: PropTypes.boolean,
    departureTime: PropTypes.boolean,
    arrivalDate: PropTypes.boolean,
    departureDate: PropTypes.boolean,
  }),
  options: PropTypes.shape({
    destination: PropTypes.boolean,
    depTime: PropTypes.boolean,
    arrivTime: PropTypes.boolean,
    depDate: PropTypes.boolean,
    arrivDate: PropTypes.boolean
  }).isRequired,
  clearOriginText: PropTypes.func,
  clearDestinationText: PropTypes.func,
  submitHandler: PropTypes.func.isRequired,
  onOriginChange: PropTypes.func.isRequired,
  onDestinationChange: PropTypes.func,
  onOriginDateChange: PropTypes.func.isRequired,
  onOriginTimeChange: PropTypes.func.isRequired,
  onOriginSelect: PropTypes.func.isRequired,
  onDestinationSelect: PropTypes.func,
  originAutoComplete: PropTypes.array.isRequired,
  destinationAutoComplete: PropTypes.array,
  originText: PropTypes.string.isRequired,
  destinationText: PropTypes.string,
  originTime: PropTypes.string,
  originDate: PropTypes.string,
  canSearch: PropTypes.bool.isRequired,
  onSwitch: PropTypes.func,
  getLocation: PropTypes.func.isRequired,
};

export default Search;
