import React, { Component } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import AutoComplete from './AutoComplete';
import { NORWICH_API } from '../constants';

const styles = StyleSheet.create({
  input: {
  },
  autocomplete: {
    zIndex: 10
  },
  button: {
    width: 5
  }
});

function getAutoCompleteList (url) {
  return fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson.predictions;
    })
    .catch((error) => {
      console.error(error);
    });
}

function getLatLng (address) {
  const url = NORWICH_API + '/geocode/' + address;
  return fetch(url)
    .then(response => response.json())
    .then(responseJson => { return responseJson; })
    .catch((error) => {
      console.error(error);
    });
};

class Search extends Component {
  constructor (props) {
    super(props);
    console.log(props);
    this.state = {
      expanded: props.expanded,
      placeholder: { ...props.placeholder },
      defaults: { ...props.defaults },
      originText: '',
      destinationText: props.defaults.destination ? 'NRW' : '',
      destinationAutoComplete: [],
      originAutoComplete: [],
      stops: [],
      hasSelected: false,
      originHighlight: 'white',
      destinationHighlight: 'white'
    };
    this.submit = this.submit.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
    this.onOriginSelect = this.onOriginSelect.bind(this);
    this.onDestinationSelect = this.onDestinationSelect.bind(this);
  }

  componentWillMount () {
    this.setState({
      originSelector: this.onOriginSelect,
      destinationSelector: this.onDestinationSelect
    });
  }

  submit () {
    const originStop = this.state.stops.find(s => s.name === this.state.originText);
    const destinationStop = this.state.stops.find(s => s.name === this.state.destinationText);
    if (!originStop) {
      this.setState({ originHighlight: 'red' });
    } else if (!destinationStop) {
      this.setState({ destinationHighlight: 'red' });
    }
    this.props.submitHandler(originStop, destinationStop);
  }

  onOriginSelect (text) {
    this.setState({ originText: text, originAutoComplete: [] });
    if (!this.state.hasSelected) {
      getLatLng(text).then(geocode => {
        this.props.nearHandler(geocode.lat, geocode.lng).then(response => {
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

  onDestinationSelect (text) {
    this.setState({ destinationText: text, destinationAutoComplete: [] });
  }

  onTextChange (text, type) {
    if (type === 'origin') {
      this.setState({ originText: text });
    }
    if (type === 'dest') {
      this.setState({ destinationText: text });
    }
    if (text.length > 3) {
      const url = NORWICH_API + '/autocomplete/' + text;
      getAutoCompleteList(url).then(response => {
        const descriptions = response.map((r, i) => ({ description: r.description, key: i }));
        // eslint-disable-next-line chai-friendly/no-unused-expressions
        type === 'origin'
          ? this.setState({ originAutoComplete: descriptions })
          : this.setState({ destinationAutoComplete: descriptions });
      });
    }
  }

  render () {
    const swapIcon = <MaterialCommunityIcons name='swap-vertical' size={25} color='black' />;
    return (
      <View style={styles.container}>
        <View>
          <TextInput
            autoFocus
            placeholder={this.state.placeholder.origin}
            onChangeText={(text) => this.onTextChange(text, 'origin')}
            value={this.state.originText}
            editable={this.state.defaults.origin}
            defaultValue={this.state.defaults.origin ? this.state.defaults.origin : ''}
            returnKeyType='next'
            style={{ height: 40, marginBottom: '2%', backgroundColor: this.state.backgroundColor, width: '85%' }}
          />
          <AutoComplete
            selectionHandler={this.state.originSelector}
            style={styles.autocomplete}
            listItems={this.state.originAutoComplete}
          />
        </View>
        { this.props.options.destination
          ? <View>
            <TextInput
              style={{ height: 40, marginBottom: '2%', backgroundColor: this.state.backgroundColor, width: '85%' }}
              onChangeText={(text) => this.onTextChange(text, 'dest')}
              value={this.state.destinationText}
              // eslint-disable-next-line no-extra-boolean-cast
              editable={!(!!this.props.defaults.destination)}
              defaultValue={this.props.defaults.destination}
              returnKeyType='next'
            />
            {swapIcon}
            <AutoComplete
              selectionHandler={this.state.destinationSelector}
              style={styles.autocomplete}
              listItems={this.state.destinationAutoComplete}
            />
          </View>
          : null
        }
        <Button
          onPress={this.submit}
          title='Submit'
          color='#841584'
          accessibilityLabel='Submit search terms'
          style={{ width: 100 }}
        />
      </View>
    );
  }
}

Search.propTypes = {
  placeholder: PropTypes.shape({
    origin: PropTypes.string.isRequired,
    destination: PropTypes.string,
    arrivalTime: PropTypes.string,
    departureTime: PropTypes.string,
    arrivalDate: PropTypes.string,
    departureDate: PropTypes.string,
  }).isRequired,
  defaults: PropTypes.shape({
    origin: PropTypes.string,
    destination: PropTypes.string,
    arrivalTime: PropTypes.string,
    departureTime: PropTypes.string,
    arrivalDate: PropTypes.string,
    departureDate: PropTypes.string,
  }),
  expanded: PropTypes.bool,
  options: PropTypes.shape({
    destination: PropTypes.boolean,
    depTime: PropTypes.boolean,
    arrivTime: PropTypes.boolean,
    depDate: PropTypes.boolean,
    arrivDate: PropTypes.boolean
  }).isRequired,
  submitHandler: PropTypes.func.isRequired,
  nearHandler: PropTypes.func.isRequired
};

export default Search;
