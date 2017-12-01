import React from 'react';
import { Text, FlatList } from 'react-native';
import PropTypes from 'prop-types';

const AutoComplete = ({ listItems, selectionHandler, style }) => {
  return (
    <FlatList style={style}
      data={listItems}
      renderItem={({ item }) => <AutoCompleteItem select={selectionHandler} text={item.description} key={item.key} />}
    />
  );
};

const AutoCompleteItem = ({ select, text }) => {
  return (
    <Text onPress={() => select(text)}>{text}</Text>
  );
};

AutoComplete.propTypes = {
  listItems: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.number.isRequired,
      description: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  selectionHandler: PropTypes.func.isRequired,
  style: PropTypes.number
};

AutoCompleteItem.propTypes = {
  select: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired
};

export default AutoComplete;