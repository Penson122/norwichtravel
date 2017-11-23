import React, { Component } from 'react';
import { ScrollView } from 'react-native';

import Search from '../components/Search';
import SearchResults from '../components/SearchResults';

import { NORWICH_API } from '../constants.js';

class Bus extends Component {
  constructor (props) {
    super(props);
    this.state = {
      results: [],
      defaults: {
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
      <ScrollView>
        <Search
          submitHandler={this.searchHandler}
          nearHandler={this.nearHandler}
          options={this.state.options}
          defaults={this.state.defaults}
        />
        <SearchResults results={this.state.results} />
      </ScrollView>
    );
  };
};

export default Bus;
