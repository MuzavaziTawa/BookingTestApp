onGetBookings = async () => {
  var bookings = await AsyncStorage.getItem('bk_bookings') || null;
  if (bookings == null) {
    return null;
  } else {
    var decodedbookings = JSON.parse(bookings);
    return decodedbookings;
  }
}

onGetBookingYears = async () => {
  var bookings = await onGetBookings();
  if (bookings == null) {
    return [];
  } else {
    var years = [];
    for (var a = 0; a < bookings.length; a++){
      var date = bookings[a].date;
      var fullyear = new Date(date).getFullYear();

      //check if it exists in the array
      var filteredYears = years.filter(function (year) {
        return year == full;
      });

      if (filteredYears == null) {
        years.push(fullyear);
      } 
    }

    return years;
  }
}