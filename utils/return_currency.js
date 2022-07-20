import AsyncStorage from '@react-native-async-storage/async-storage';

onGetCurrency = async id => {
  var currencies = (await AsyncStorage.getItem('bk_currencies')) || null;
  if (currencies == null) {
    return null;
  } else {
    var decodedcurrencies = JSON.parse(currencies);
    var filteredCurrency = decodedcurrencies.filter(function (el) {
      return el.id == id;
    });

    return filteredCurrency;
  }
};

onGetAllCurrencies = async () => {
  var currencies = (await AsyncStorage.getItem('bk_currencies')) || null;
  if (currencies == null) {
    return null;
  } else {
    var decodedcurrencies = JSON.parse(currencies);
    return decodedcurrencies;
  }
};
