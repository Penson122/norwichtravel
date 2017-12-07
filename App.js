import React from 'react';

import { TabNavigator } from 'react-navigation';

import { Ionicons } from '@expo/vector-icons';

import Bus from './routes/Bus';
import Home from './routes/Home';
import Train from './routes/Train';
import Flights from './routes/Flights';
import Taxi from './routes/Taxi';

const App = TabNavigator({
  Bus: {
    screen: Bus,
    navigationOptions: {
      tabBarLabel: 'Bus',
      // eslint-disable-next-line
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons name='md-bus' size={focused ? 23 : 20} color={tintColor} />
      )
    }
  },

  Train: {
    screen: Train,
    navigationOptions: {
      tabBarLabel: 'Train',
      // eslint-disable-next-line
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons name='md-train' size={focused ? 23 : 20} color={tintColor} />
      )
    }
  },

  Home: {
    screen: Home,
    navigationOptions: {
      tabBarLabel: 'Home',
      // eslint-disable-next-line
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons name='md-home' size={focused ? 23 : 20} color={tintColor} />
      )
    }
  },

  Flights: {
    screen: Flights,
    navigationOptions: {
      tabBarLabel: 'Flights',
      // eslint-disable-next-line
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons name='md-plane' size={focused ? 23 : 20} color={tintColor} />
      )
    }
  },

  Taxi: {
    screen: Taxi,
    navigationOptions: {
      tabBarLabel: 'Taxi',
      // eslint-disable-next-line
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons name='md-car' size={focused ? 23 : 20} color={tintColor} />
      )
    }
  }
}, {
  tabBarPosition: 'bottom',
  initialRouteName: 'Home',
  tabBarOptions: {
    showIcon: true,
    activeTintColor: '#FFFFFF',
    labelStyle: {
      fontSize: 12
    },
    style: {
      backgroundColor: '#403F4C'
    }
  }
});

export default App;
