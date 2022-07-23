import AsyncStorage from '@react-native-async-storage/async-storage';

class returnBoat {
  onGetAllBoats = async () => {
    var boats = (await AsyncStorage.getItem('bk_boats')) || null;
    if (boats == null) {
      return null;
    } else {
      var decodedboats = JSON.parse(boats);
      return decodedboats;
    }
  };
}

export default returnBoat;
