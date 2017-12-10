import React from 'react';

import { TabNavigator } from 'react-navigation';

import { Ionicons } from '@expo/vector-icons';

import Bus from './routes/Bus';
import Train from './routes/Train';
import Taxi from './routes/Taxi';

const App = TabNavigator({
  Train: {
    screen: Train,
    navigationOptions: {
      tabBarLabel: 'Train',
      // eslint-disable-next-line react/prop-types
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons name='md-train' size={focused ? 23 : 20} color={tintColor} />
      )
    }
  },
  Bus: {
    screen: Bus,
    navigationOptions: {
      tabBarLabel: 'Bus',
      // eslint-disable-next-line react/prop-types
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons name='md-bus' size={focused ? 23 : 20} color={tintColor} />
      )
    }
  },

  Taxi: {
    screen: Taxi,
    navigationOptions: {
      tabBarLabel: 'Taxi',
      // eslint-disable-next-line react/prop-types
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons name='md-car' size={focused ? 23 : 20} color={tintColor} />
      )
    }
  },

}, {
  tabBarPosition: 'bottom',
  initialRouteName: 'Bus',
  tabBarOptions: {
    showIcon: true,
    activeTintColor: '#FFFFFF',
    labelStyle: {
      fontSize: 24
    },
    style: {
      backgroundColor: '#0b7f30',
    }
  }
});

export default App;
