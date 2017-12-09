import React, { Component } from 'react';
import { ScrollView, StyleSheet, Platform } from 'react-native';

import { phonecall } from 'react-native-communications';

import TaxiResults from '../components/TaxiResults';

import { getFromAPI } from '../util.js';
import { NORWICH_API } from '../constants.js';

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? '5%' : 0, // fix for padding in expo apps on android
    marginRight: '1%',
    marginLeft: '1%'
  },
});

class Taxi extends Component {
  constructor (props) {
    super(props);
    this.state = {
      taxis: []
    };
    this.getTaxis = this.getTaxis.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.getTaxis();
  }

  getTaxis () {
    const url = `${NORWICH_API}/taxis`;
    getFromAPI(url).then(res => {
      this.setState({ taxis: res });
    });
  }

  handleSelect (number) {
    phonecall(number, false);
  }

  render () {
    return (
      <ScrollView style={styles.container}>
        <TaxiResults taxis={this.state.taxis} handler={this.handleSelect} />
      </ScrollView>
    );
  }
};

export default Taxi;
