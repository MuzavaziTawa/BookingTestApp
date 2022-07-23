import AsyncStorage from '@react-native-async-storage/async-storage';

class returnBookings {
  onGetBookings = async () => {
    var bookings = (await AsyncStorage.getItem('bk_bookings')) || null;
    if (bookings == null) {
      return [];
    } else {
      var decodedbookings = JSON.parse(bookings);
      return decodedbookings;
    }
  };

  onGetBookingYears = async () => {
    var bookings = await new returnBookings().onGetBookings();
    if (bookings == null) {
      return [];
    } else {
      var years = [];
      for (var a = 0; a < bookings.length; a++) {
        var date = bookings[a].date;
        var fullyear = new Date(date).getFullYear();

        if (!years.includes(fullyear)) {
          years.push(fullyear);
        }
      }

      return years;
    }
  };
}

export default returnBookings;
