import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, Platform, Text } from 'react-native';

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
      results: [],
      originText: '',
      originTime: datetime[1],
      originDate: datetime[0],
      hasSelected: false,
      stops: [],
      noResults: false,
      placeholder: {
        origin: 'Please enter your road'
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
        this.setState({ placeholder: { origin: 'Please enter your road' } });
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
        <View
          accessibilityLabel='Live Bus Timetable. Please enter your road in the textbox below. Then select your stop in the list. Finally press the select button. Your bus times will be below.'
          accessibilityTraits='text'
          accessibilityComponentType='none'
          importantForAccessibility='yes'
        >
          <Text style={{ alignSelf: 'center', fontSize: 20 }}>Live Bus Timetable</Text>
        </View>
        <View
          accessibilityLabel='Search Button. Select to generate your Bus Timetable.'
          accessibilityComponentType='button'
          accessibilityTraits='button'
          // onMagicTap={Search.submitHandler}
        >
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
          />
        </View>
        {
          this.state.noResults
            ? <View accessibilityComponentType='none' accessibilityLabel='No Bus times found' accessibilityTraits='text'><Text style={styles.results}>No Bus times found</Text></View>
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
