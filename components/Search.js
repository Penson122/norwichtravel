import React, { Component } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import AutoComplete from './AutoComplete';

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

class Search extends Component {
  constructor (props) {
    super(props);
    this.state = {
      expanded: props.expanded,
      defaults: { ...props.default },
      originText: '',
      destinationText: '',
      destinationAutoComplete: [],
      originAutoComplete: []
    };
    this.submit = this.submit.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
    this.onOriginSelect = this.onOriginSelect.bind(this);
    this.onDestinationSelect = this.onDestinationSelect.bind(this);
  }

  submit () {
    this.props.submitHandler({
      origin: this.state.originText,
      destination: this.state.destinationText
    });
  }

  onOriginSelect (text) {
    this.setState({ originText: text, originAutoComplete: [] });
  }

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
      const url = 'https://norwichtravelapi.herokuapp.com/autocomplete/' + text;
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
    return (
      <View style={styles.container}>
        <View>
          <TextInput
            style={styles.input}
            onChangeText={(text) => this.onTextChange(text, 'origin')}
            value={this.state.originText}
            returnKeyType='next'
          />
          <AutoComplete
            selectionHandler={this.onOriginSelect}
            style={styles.autocomplete}
            listItems={this.state.originAutoComplete}
          />
        </View>
        <View>
          <TextInput
            style={styles.input}
            onChangeText={(text) => this.onTextChange(text, 'dest')}
            value={this.state.destinationText}
            returnKeyType='next'
          />
          <AutoComplete
            selectionHandler={this.onDestinationSelect}
            style={styles.autocomplete}
            listItems={this.state.destinationAutoComplete}
          />
        </View>
        <Button
          onPress={this.submit}
          title='Submit'
          color='#841584'
          accessibilityLabel='Submit search terms'
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    marginBottom: '2%',
  },
  autocomplete: {
    zIndex: 10
  }
});

Search.propTypes = {
  default: PropTypes.shape({
    origin: PropTypes.string,
    destination: PropTypes.string,
    arrivalTime: PropTypes.string,
    departureTime: PropTypes.string,
    arrivalDate: PropTypes.string,
    departureDate: PropTypes.string,
  }),
  expanded: PropTypes.bool,
  options: PropTypes.shape({
    depTime: PropTypes.boolean,
    arrivTime: PropTypes.boolean,
    depDate: PropTypes.boolean,
    arrivDate: PropTypes.boolean
  }),
  submitHandler: PropTypes.func.isRequired
};

export default Search;
