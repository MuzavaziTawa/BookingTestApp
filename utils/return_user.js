import AsyncStorage from '@react-native-async-storage/async-storage';

onGetUser = async id => {
  var users = (await AsyncStorage.getItem('bk_users')) || null;
  if (users == null) {
    return null;
  } else {
    var decodedUsers = JSON.parse(users);
    var filteredUser = decodedUsers.filter(function (el) {
      return el.id == id;
    });

    return filteredUser;
  }
};
