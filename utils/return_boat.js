import AsyncStorage from '@react-native-async-storage/async-storage';

onGetBoat = async id => {
  var boats = (await AsyncStorage.getItem('bk_boats')) || null;
  if (boats == null) {
    return null;
  } else {
    var decodedboats = JSON.parse(boats);
    var filteredBoat = decodedboats.filter(function (el) {
      return el.id == id;
    });

    return filteredBoat;
  }
};

onGetAllBoats = async () => {
  var boats = (await AsyncStorage.getItem('bk_boats')) || null;
  if (boats == null) {
    return null;
  } else {
    var decodedboats = JSON.parse(boats);
    return decodedboats;
  }
};
