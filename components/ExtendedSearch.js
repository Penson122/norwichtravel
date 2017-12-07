import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, TextInput } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';

import { Ionicons } from '@expo/vector-icons';

class ExtendedSearch extends Component {
  constructor (props) {
    super(props);
    this.state = {
      dateVisible: false,
      timeVisible: false
    };
  }
  render () {
    return (
      <View style={{ paddingBottom: '1%' }}>
        <View style={{ paddingBottom: '2%', flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => this.setState({ timeVisible: true })}>
            <Ionicons name='ios-clock-outline' size={22} />
          </TouchableOpacity>
          <TextInput
            placeholder='Time'
            value={this.props.time}
            style={{ width: '40%' }}
            editable={false}
            underlineColorAndroid='transparent'
          />
          <TouchableOpacity onPress={() => this.setState({ dateVisible: true })}>
            <Ionicons name='ios-calendar-outline' size={22} />
          </TouchableOpacity>
          <TextInput
            placeholder='Date'
            value={this.props.date}
            style={{ width: '40%' }}
            editable={false}
            underlineColorAndroid='transparent'
          />
        </View>
        <DateTimePicker
          isVisible={this.state.dateVisible}
          mode={'date'}
          onConfirm={(date) => { this.setState({ dateVisible: false }); this.props.handleDateSelect(date); }}
          onCancel={() => this.setState({ dateVisible: false })}
          minimumDate={new Date()}
        />
        <DateTimePicker
          isVisible={this.state.timeVisible}
          mode={'time'}
          onConfirm={(time) => { this.setState({ timeVisible: false }); this.props.handleTimeSelect(time); }}
          onCancel={() => this.setState({ timeVisible: false })}
        />
      </View>
    );
  }
}

ExtendedSearch.propTypes = {
  handleTimeSelect: PropTypes.func.isRequired,
  handleDateSelect: PropTypes.func.isRequired,
  time: PropTypes.string,
  date: PropTypes.string
};

export default ExtendedSearch;
