import React from 'react';
import { Text, ScrollView, StyleSheet, Platform } from 'react-native';
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

class Train extends React.Component {
  constructor (props) {
    super(props);
    const datetime = getDateTime();
    this.state = {
      results: [],
      noResults: false,
      originText: 'Norwich',
      destinationText: '',
      originTime: datetime[1],
      originDate: datetime[0],
      hasSelected: false,
      canSearch: true,
      stations: [],
      placeholder: { origin: 'Origin', destination: 'Search for city' },
      originAutoComplete: [],
      destinationAutoComplete: [],
      defaults: { destination: true, origin: false }
    };
    this.onOriginChange = this.onOriginChange.bind(this);
    this.onDestinationChange = this.onDestinationChange.bind(this);
    this.onOriginSelect = this.onOriginSelect.bind(this);
    this.onDestinationSelect = this.onDestinationSelect.bind(this);
    this.searchHandler = this.searchHandler.bind(this);
    this.switchOriginDestination = this.switchOriginDestination.bind(this);
    this.onOriginDateChange = this.onOriginDateChange.bind(this);
    this.onOriginTimeChange = this.onOriginTimeChange.bind(this);
    this.clearOriginText = this.clearOriginText.bind(this);
    this.clearDestinationText = this.clearDestinationText.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.getPermission = this.getPermission.bind(this);
  };

  componentWillMount () {
    this.getPermission();
  }

  getPermission = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    this.setState({ permission: status });
  };

  getLocation = async (type) => {
    if (this.state.permission === 'granted') {
      let location = await Location.getCurrentPositionAsync({});
      const url = NORWICH_API + '/train/near/' + location.coords.latitude + '/' + location.coords.longitude;
      getFromAPI(url).then(response => {
        const stations = response.stations.map((s, i) => ({ description: s.name, key: i }));
        if (type === 'origin') {
          this.setState({
            originAutoComplete: stations,
            stations: response.stations,
            hasSelected: true
          });
        }
        if (type === 'destination') {
          this.setState({
            destinationAutoComplete: stations,
            hasSelected: true,
            stations: response.stations });
        }
      });
    }
  }

  onOriginChange (text) {
    this.setState({ originText: text });
    if (text.length > 3) {
      const url = NORWICH_API + '/autocomplete/train/' + text;
      getAutoCompleteList(url).then(response => {
        const descriptions = response.map((r, i) => ({ description: r.description, key: i }));
        this.setState({ originAutoComplete: descriptions });
      });
    }
  }

  onOriginSelect (text) {
    this.setState({ originText: text, originAutoComplete: [] });
    if (!this.state.hasSelected) {
      getLatLng(text).then(geocode => {
        const url = NORWICH_API + '/train/near/' + geocode.lat + '/' + geocode.lng;
        getFromAPI(url).then(response => {
          const stations = response.stations.map((s, i) => ({ description: s.name, key: i }));
          this.setState({
            originAutoComplete: stations,
            stations: response.stations,
            hasSelected: true
          });
        });
      });
    }
    if (this.state.hasSelected) {
      this.setState({ hasSelected: false, canSearch: true });
    }
  };

  onDestinationChange (text) {
    this.setState({ destinationText: text });
    if (text.length > 3) {
      const url = NORWICH_API + '/autocomplete/train/' + text;
      getAutoCompleteList(url).then(response => {
        const descriptions = response.map((r, i) => ({ description: r.description, key: i }));
        this.setState({ destinationAutoComplete: descriptions });
      });
    }
  };

  onDestinationSelect (text) {
    this.setState({ destinationText: text, destinationAutoComplete: [] });
    if (!this.state.hasSelected) {
      getLatLng(text).then(geocode => {
        const url = NORWICH_API + '/train/near/' + geocode.lat + '/' + geocode.lng;
        getFromAPI(url).then(response => {
          const stations = response.stations.map((s, i) => ({ description: s.name, key: i }));
          this.setState({
            destinationAutoComplete: stations,
            stations: response.stations,
            hasSelected: true
          });
        });
      });
    }
    if (this.state.hasSelected) {
      this.setState({ hasSelected: false, canSearch: true });
    }
  }

  switchOriginDestination () {
    const origin = this.state.originText;
    this.setState({
      originText: this.state.destinationText,
      destinationText: origin,
      defaults: { origin: !this.state.defaults.origin, destination: !this.state.defaults.destination }
    });
  }

  searchHandler (origin, destination) {
    if (origin.length > 0) {
      const originStation = this.state.stations.find(s => s.name.includes(origin));
      if (originStation === undefined) {
        // hax
        getLatLng(`${origin}, UK`).then(geocode => {
          const url = NORWICH_API + '/train/near/' + geocode.lat + '/' + geocode.lng;
          getFromAPI(url).then(response => {
            const originStation = response.stations.find(s => s.name.includes(origin));
            this.getTimeTable(originStation.station_code, this.state.originDate, this.state.originTime)
              .then(response => {
                let results = response.filter(e => e.destination_name.includes(this.state.destinationText));
                this.setState({ results });
                if (results.length === 0) {
                  this.setState({ noResults: true });
                } else {
                  this.setState({ noResults: false });
                }
              });
          });
        });
      } else {
        this.getTimeTable(originStation.station_code, this.state.originDate, this.state.originTime).then(response => {
          const results = response.filter(e => e.destination_name.includes(this.state.destinationText));
          this.setState({ results });
          if (results.length === 0) {
            this.setState({ noResults: true });
          } else {
            this.setState({ noResults: false });
          }
        });
      }
    } else {
      this.setState({ placeholder: { origin: 'Must enter origin to search' } });
    }
  };

  getTimeTable (stop, date, time) {
    const url = `${NORWICH_API}/train/${stop}/${date}/${time}`;
    return getFromAPI(url);
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

  onOriginDateChange (date) {
    date = getDateTime(date)[0];
    this.setState({ originDate: date });
  }

  onOriginTimeChange (time) {
    time = getDateTime(time)[1];
    this.setState({ originTime: time });
  }

  clearOriginText () {
    this.setState((prevState, props) => {
      return prevState.destinationText.length === 0
        ? ({ originText: '', originAutoComplete: [], canSearch: false })
        : ({ originText: '', originAutoComplete: [] });
    });
  }

  clearDestinationText () {
    this.setState((prevState, props) => {
      return prevState.originText.length === 0
        ? ({ destinationText: '', destinationAutoComplete: [], canSearch: false })
        : ({ destinationText: '', destinationAutoComplete: [] });
    });
  }

  render () {
    return (
      <ScrollView style={styles.container}>
        <Text style={{ alignSelf: 'center', fontSize: 20 }}>Where to?</Text>
        <Search
          placeholder={this.state.placeholder}
          options={{ destination: true }}
          submitHandler={this.searchHandler}
          clearOriginText={this.clearOriginText}
          clearDestinationText={this.clearDestinationText}
          originText={this.state.originText}
          destinationText={this.state.destinationText}
          originAutoComplete={this.state.originAutoComplete}
          destinationAutoComplete={this.state.destinationAutoComplete}
          onOriginChange={this.onOriginChange}
          onDestinationChange={this.onDestinationChange}
          originTime={this.state.originTime}
          originDate={this.state.originDate}
          onOriginDateChange={this.onOriginDateChange}
          onOriginTimeChange={this.onOriginTimeChange}
          onOriginSelect={this.onOriginSelect}
          onDestinationSelect={this.onDestinationSelect}
          defaults={this.state.defaults}
          canSearch={!this.state.canSearch}
          onSwitch={this.switchOriginDestination}
          getLocation={this.getLocation}
        />
        {
          this.state.noResults ? <Text style={styles.results}>No Results Found</Text> : null
        }
        <SearchResults
          results={this.state.results}
          type='train'
          lineKey='operator'
          destinationKey='destination_name'
        />
      </ScrollView>
    );
  }
}

export default Train;
