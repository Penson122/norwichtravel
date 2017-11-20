import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import BottomNavigation, { Tab } from 'react-native-material-bottom-navigation'

import { Ionicons } from '@expo/vector-icons';

const bus     = <Ionicons name="md-bus"   size={22} color="white" />
const train   = <Ionicons name="md-train" size={22} color="white" />
const home    = <Ionicons name="md-home"  size={22} color="white" />
const flights = <Ionicons name="md-plane" size={22} color="white" />
const car     = <Ionicons name="md-car"   size={22} color="white" />

const Navigation = ({pageHandler, activeTab}) => {
  return (
      <BottomNavigation
        labelColor="white"
        rippleColor="white"
        activeTab={activeTab}
        shifting={false}
        // innerStyle={{justifyContent: 'center'}}
        style={{ height: 56, elevation: 8, position: 'absolute', left: 0, bottom: 0, right: 0 }}
        onTabChange={pageHandler}
      >
        <Tab
          barBackgroundColor="#37474F"
          label="Bus"
          icon={bus}
        />
        <Tab
          barBackgroundColor="#00796B"
          label="Train"
          icon={train}
        />
        <Tab
          barBackgroundColor="#5D4037"
          label="Home"
          icon={home}
        />
        <Tab
          barBackgroundColor="#3E2723"
          label="Flights"
          icon={flights}
        />
        <Tab
          barBackgroundColor="#3E2723"
          label="Taxi"
          icon={car}
        />
      </BottomNavigation>
    );
};

export default Navigation;
