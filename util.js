import { NORWICH_API } from './constants';

export const getAutoCompleteList = (url) => {
  return fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson.predictions;
    })
    .catch((error) => {
      console.error(error);
    });
};

export const getLatLng = (address) => {
  const url = NORWICH_API + '/geocode/' + address;
  return fetch(url)
    .then(response => response.json())
    .then(responseJson => { return responseJson; })
    .catch((error) => {
      console.error(error);
    });
};
