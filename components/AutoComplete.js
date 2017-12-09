import React from 'react';
import { Text, FlatList, ViewPropTypes, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  text: {
    marginBottom: '1.5%',
    textAlign: 'center',
    fontSize: 22
  }
});

const AutoComplete = ({ listItems, selectionHandler, style }) => {
  return (
    <FlatList style={style}
      onMagicTap={() => selectionHandler(listItems[0].description)}
      data={listItems}
      renderItem={({ item }) => <AutoCompleteItem select={selectionHandler} text={item.description} key={item.key} />}
    />
  );
};

const AutoCompleteItem = ({ select, text }) => {
  return (
    <Text style={styles.text} onPress={() => select(text)}>{text}</Text>
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
  style: ViewPropTypes.style
};

AutoCompleteItem.propTypes = {
  select: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired
};

export default AutoComplete;
