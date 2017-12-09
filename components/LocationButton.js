import React from 'react';
import PropTypes from 'prop-types';

import { MaterialIcons } from '@expo/vector-icons';

const LocationButton = ({ handler, color }) => (
  <MaterialIcons name='my-location' size={40} onPress={handler} color={color} />
);

LocationButton.propTypes = {
  handler: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired
};

export default LocationButton;
