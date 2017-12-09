import React, { Component } from 'react';
import { ScrollView, StyleSheet, Platform, Text } from 'react-native';
import { Location, Permissions } from 'expo';

import Search from '../components/Search';
import SearchResults from '../components/SearchResults';

import { getAutoCompleteList, getLatLng, getDateTime, getFromAPI } from '../util';
import { NORWICH_API } from '../constants.js';

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? '5%' : 0, // fix for padding in expo apps on android
    marginRight: '1%',
    marginLeft: '1%'
  },
  results: {
    fontSize: 28,
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: '15%'
  }
});

class Bus extends Component {
  constructor (props) {
    super(props);
    const datetime = getDateTime();
    this.state = {
      location: {},
      results: [],
      originText: '',
      originTime: datetime[1],
      originDate: datetime[0],
      hasSelected: false,
      stops: [],
      noResults: false,
      placeholder: {
        origin: 'Search for road...'
      },
      originAutoComplete: [],
      options: {
        destination: false
      }
    };
    this.getTimeTable = this.getTimeTable.bind(this);
    this.searchHandler = this.searchHandler.bind(this);
    this.originChange = this.originChange.bind(this);
    this.onOriginSelect = this.onOriginSelect.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.onTimeChange = this.onTimeChange.bind(this);
    this.clearOriginText = this.clearOriginText.bind(this);
    this.getPermission = this.getPermission.bind(this);
    this.getLocation = this.getLocation.bind(this);
  }

  componentWillMount () {
    this.getPermission();
  }

  getPermission = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    this.setState({ permission: status });
  };

  getLocation = async () => {
    if (this.state.permission === 'granted') {
      let location = await Location.getCurrentPositionAsync({});
      const url = NORWICH_API + '/bus/near/' + location.coords.latitude + '/' + location.coords.longitude;
      getFromAPI(url).then(response => {
        const stops = response.stops.map((s, i) => ({ description: s.name, key: i }));
        this.setState({
          originAutoComplete: stops,
          stops: response.stops,
          hasSelected: true
        });
      });
    }
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
        getFromAPI(url).then(response => {
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

  getTimeTable (stop, date, time) {
    const url = `${NORWICH_API}/bus/${stop}/${date}/${time}`;
    return getFromAPI(url);
  };

  searchHandler (origin) {
    if (origin !== undefined) {
      const originStop = this.state.stops.find(s => s.name === origin);
      if (originStop !== undefined) {
        this.getTimeTable(originStop.atcocode, this.state.originDate, this.state.originTime).then(response => {
          this.setState({ results: response });
          if (response.length === 0) {
            this.setState({ noResults: true });
          }
        });
      } else {
        this.setState({ placeholder: { origin: 'Please enter road' } });
      }
    }
  };

  onDateChange (date) {
    date = getDateTime(date)[0];
    this.setState({ originDate: date });
  }

  onTimeChange (time) {
    time = getDateTime(time)[1];
    this.setState({ originTime: time });
  }

  clearOriginText () {
    this.setState({ originText: '', originAutoComplete: [] });
  }

  render () {
    return (
      <ScrollView style={styles.container} accessibile>
        <Text style={{ alignSelf: 'center', fontSize: 20 }}>Live Upadates</Text>
        <Search
          submitHandler={this.searchHandler}
          clearOriginText={this.clearOriginText}
          originText={this.state.originText}
          originTime={this.state.originTime}
          originDate={this.state.originDate}
          onOriginChange={this.originChange}
          onOriginDateChange={this.onDateChange}
          onOriginTimeChange={this.onTimeChange}
          originAutoComplete={this.state.originAutoComplete}
          onOriginSelect={this.onOriginSelect}
          options={this.state.options}
          placeholder={this.state.placeholder}
          defaults={{ origin: true }}
          getLocation={this.getLocation}
        />
        {
          this.state.noResults
            ? <Text style={styles.results}>No Results Found</Text>
            : null
        }
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
