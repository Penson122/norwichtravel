import React from 'react';
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

class Train extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      results: [],
      originText: '',
      destinationText: 'Norwich',
      hasSelected: false,
      stations: [],
      placeholder: { origin: 'Search for city' },
      originAutoComplete: [],
      destinationAutoComplete: [],
      defaults: { destination: false, origin: true }
    };
    this.onOriginChange = this.onOriginChange.bind(this);
    this.onDestinationChange = this.onDestinationChange.bind(this);
    this.onOriginSelect = this.onOriginSelect.bind(this);
    this.onDestinationSelect = this.onDestinationSelect.bind(this);
    this.getFromAPI = this.getFromAPI.bind(this);
    this.searchHandler = this.searchHandler.bind(this);
    this.switchOriginDestination = this.switchOriginDestination.bind(this);
  };

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
        this.getFromAPI(url).then(response => {
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
      this.setState({ hasSelected: false });
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
        this.getFromAPI(url).then(response => {
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
      this.setState({ hasSelected: false });
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
      const originStation = this.state.stations.find(s => s.name === origin);
      if (originStation === undefined) {
        // hax
        getLatLng(`${origin}, UK`).then(geocode => {
          const url = NORWICH_API + '/train/near/' + geocode.lat + '/' + geocode.lng;
          this.getFromAPI(url).then(response => {
            const originStation = response.stations.find(s => s.name.includes(origin));
            this.getTimeTable(originStation.station_code).then(response => {
              const results = response.filter(e => e.destination_name.includes(this.state.destinationText));
              this.setState({ results });
            });
          });
        });
      } else {
        this.getTimeTable(originStation.station_code).then(response => {
          const results = response.filter(e => e.destination_name.includes(this.state.destinationText));
          this.setState({ results });
        });
      }
    } else {
      console.log('no search criteria');
      this.setState({ placeholder: { origin: 'Must enter origin to search' } });
    }
  };

  getTimeTable (stop) {
    const url = NORWICH_API + '/train/' + stop;
    return this.getFromAPI(url);
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

  render () {
    return (
      <ScrollView style={styles.container}>
        <Search
          placeholder={this.state.placeholder}
          options={{ destination: true }}
          submitHandler={this.searchHandler}
          originText={this.state.originText}
          destinationText={this.state.destinationText}
          originAutoComplete={this.state.originAutoComplete}
          destinationAutoComplete={this.state.destinationAutoComplete}
          onOriginChange={this.onOriginChange}
          onDestinationChange={this.onDestinationChange}
          onOriginSelect={this.onOriginSelect}
          onDestinationSelect={this.onDestinationSelect}
          defaults={this.state.defaults}
          switch={this.switchOriginDestination}
        />
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
