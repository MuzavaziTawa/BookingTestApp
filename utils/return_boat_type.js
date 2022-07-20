import AsyncStorage from '@react-native-async-storage/async-storage';

onGetBoatType = async id => {
  var boatType = (await AsyncStorage.getItem('bk_boat_types')) || null;
  if (boatType == null) {
    return null;
  } else {
    var decodedBoatType = JSON.parse(boatType);
    var filteredBoatType = decodedBoatType.filter(function (el) {
      return el.id == id;
    });

    return filteredBoatType;
  }
};
