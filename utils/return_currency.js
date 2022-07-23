import AsyncStorage from '@react-native-async-storage/async-storage';

class returnCurrency {
  onGetAllCurrencies = async () => {
    var currencies = (await AsyncStorage.getItem('bk_currencies')) || null;
    if (currencies == null) {
      return null;
    } else {
      var decodedcurrencies = JSON.parse(currencies);
      return decodedcurrencies;
    }
  };
}

export default returnCurrency;
