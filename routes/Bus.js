import React, { Component } from 'react';
import { ScrollView, StyleSheet, Platform } from 'react-native';

import Search from '../components/Search';
import SearchResults from '../components/SearchResults';

import { getAutoCompleteList, getLatLng } from '../util';

import { NORWICH_API } from '../constants.js';

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? '5%' : 0, // fix for padding in expo apps on android
    marginRight: '1%',
    marginLeft: '1%'
  },
});

class Bus extends Component {
  constructor (props) {
    super(props);
    this.state = {
      results: [],
      originText: '',
      hasSelected: false,
      stops: [],
      placeholder: {
        origin: 'Search for road...'
      },
      originAutoComplete: [],
      options: {
        destination: false
      }
    };
    this.getFromAPI = this.getFromAPI.bind(this);
    this.getTimeTable = this.getTimeTable.bind(this);
    this.searchHandler = this.searchHandler.bind(this);
    this.originChange = this.originChange.bind(this);
    this.onOriginSelect = this.onOriginSelect.bind(this);
  }

  originChange (text) {
    this.setState({ originText: text });
    if (text.length > 3) {
      const url = NORWICH_API + '/autocomplete/bus/' + text;
      getAutoCompleteList(url).then(response => {
        const descriptions = response.map((r, i) => ({ description: r.description, key: i }));
        this.setState({ originAutoComplete: descriptions });
      });
    }
  };

  onOriginSelect (text) {
    this.setState({ originText: text, originAutoComplete: [] });
    if (!this.state.hasSelected) {
      getLatLng(text).then(geocode => {
        const url = NORWICH_API + '/bus/near/' + geocode.lat + '/' + geocode.lng;
        this.getFromAPI(url).then(response => {
          const stops = response.stops.map((s, i) => ({ description: s.name, key: i }));
          this.setState({
            originAutoComplete: stops,
            stops: response.stops,
            hasSelected: true
          });
        });
      });
    }
    if (this.state.hasSelected) {
      this.setState({ hasSelected: false });
    }
  };

  getFromAPI (url) {
    return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .catch((error) => {
        // create warning service is down
        console.error(error);
      });
  };

  getTimeTable (stop) {
    const url = NORWICH_API + '/bus/' + stop;
    return this.getFromAPI(url);
  };

  searchHandler (origin) {
    if (origin !== undefined) {
      const originStop = this.state.stops.find(s => s.name === origin);
      this.getTimeTable(originStop.atcocode).then(response => {
        this.setState({ results: response });
      });
    }
  };
  render () {
    return (
      <ScrollView style={styles.container}>
        <Search
          submitHandler={this.searchHandler}
          originText={this.state.originText}
          onOriginChange={this.originChange}
          originAutoComplete={this.state.originAutoComplete}
          onOriginSelect={this.onOriginSelect}
          options={this.state.options}
          placeholder={this.state.placeholder}
          defaults={{ origin: true }}
        />
        <SearchResults
          results={this.state.results}
          type='bus'
          lineKey='line'
          destinationKey='direction'
        />
      </ScrollView>
    );
  };
};

export default Bus;
