import React from 'react';
import { StyleSheet, View, Platform, StatusBar } from 'react-native';

import Navigation from './components/Navigation';
import Bus from './routes/Bus';
import Home from './routes/Home';
import Train from './routes/Train';
import Flights from './routes/Flights';
import Taxi from './routes/Taxi';
export default class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      activeTab: 2,
      currentPage: <Home />
    };
    this.switchPage = this.switchPage.bind(this);
  }

  switchPage (newIndex, oldIndex) {
    this.setState({ activeTab: newIndex });
    switch (newIndex) {
      case 0:
        this.setState({ currentPage: <Bus /> });
        break;
      case 1:
        this.setState({ currentPage: <Train /> });
        break;
      case 2:
        this.setState({ currentPage: <Home /> });
        break;
      case 3:
        this.setState({ currentPage: <Flights /> });
        break;
      case 4:
        this.setState({ currentPage: <Taxi /> });
        break;
    }
  }

  render () {
    return (
      <View style={styles.container}>
        {this.state.currentPage}
        <Navigation pageHandler={this.switchPage} activeTab={this.state.activeTab} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight + 1, // fix for padding in expo apps on android
    paddingLeft: '2%',
    paddingRight: '2%'
  },
});
