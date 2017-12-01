import React, { Component } from 'react';
import { ScrollView, StyleSheet, Platform } from 'react-native';

import Search from '../components/Search';
import SearchResults from '../components/SearchResults';

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
      placeholder: {
        origin: 'Search for road...'
      },
      options: {
        destination: false
      }
    };
    this.getFromAPI = this.getFromAPI.bind(this);
    this.getTimeTable = this.getTimeTable.bind(this);
    this.nearHandler = this.nearHandler.bind(this);
    this.searchHandler = this.searchHandler.bind(this);
  }

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

  nearHandler (lat, lng) {
    const url = NORWICH_API + '/bus/near/' + lat + '/' + lng;
    return this.getFromAPI(url);
  };

  searchHandler (origin) {
    if (origin !== undefined) {
      console.log(origin.atcocode);
      this.getTimeTable(origin.atcocode).then(response => {
        this.setState({ results: response });
      });
    }
  };
  render () {
    return (
      <ScrollView style={styles.container}>
        <Search
          submitHandler={this.searchHandler}
          nearHandler={this.nearHandler}
          options={this.state.options}
          placeholder={this.state.placeholder}
          defaults={{}}
        />
        <SearchResults results={this.state.results} style={{ paddingTop: '3%' }} />
      </ScrollView>
    );
  };
};

export default Bus;
