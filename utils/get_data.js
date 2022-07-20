import AsyncStorage from '@react-native-async-storage/async-storage';

onFetchAllAPIs = async () => {
  this.onGetCurrencies();
  this.onGetBoatTypes();
  this.onGetBoats();
  this.onGetBookings();
  this.onGetPaymentStatuses();
  this.onGetUsers();
};

onGetCurrencies = async () => {
  try {
    await fetch(
      'https://hexis-test-api.s3.eu-central-1.amazonaws.com/currencies.json',
      {
        method: 'GET',
      },
    )
      .then(response => {
        response.json().then(result => {
          console.log(result);
          AsyncStorage.setItem('bk_currencies', result);
        });
      })
      .catch(err => {
        console.error(err);
      });
  } catch (e) {}
};

onGetBookings = async () => {
  try {
    await fetch(
      'https://hexis-test-api.s3.eu-central-1.amazonaws.com/bookings.json',
      {
        method: 'GET',
      },
    )
      .then(response => {
        response.json().then(result => {
          console.log(result);
          AsyncStorage.setItem('bk_bookings', result);
        });
      })
      .catch(err => {
        console.error(err);
      });
  } catch (e) {}
};

onGetPaymentStatuses = async () => {
  try {
    await fetch(
      'https://hexis-test-api.s3.eu-central-1.amazonaws.com/payment_statuses.json',
      {
        method: 'GET',
      },
    )
      .then(response => {
        response.json().then(result => {
          console.log(result);
          AsyncStorage.setItem('bk_payment_statuses', result);
        });
      })
      .catch(err => {
        console.error(err);
      });
  } catch (e) {}
};

onGetBoatTypes = async () => {
  try {
    await fetch(
      'https://hexis-test-api.s3.eu-central-1.amazonaws.com/boat_types.json',
      {
        method: 'GET',
      },
    )
      .then(response => {
        response.json().then(result => {
          console.log(result);
          AsyncStorage.setItem('bk_boat_types', result);
        });
      })
      .catch(err => {
        console.error(err);
      });
  } catch (e) {}
};

onGetBoats = async () => {
  try {
    await fetch(
      'https://hexis-test-api.s3.eu-central-1.amazonaws.com/boats.json',
      {
        method: 'GET',
      },
    )
      .then(response => {
        response.json().then(result => {
          console.log(result);
          AsyncStorage.setItem('bk_boats', result);
        });
      })
      .catch(err => {
        console.error(err);
      });
  } catch (e) {}
};

onGetUsers = async () => {
  try {
    await fetch(
      'https://hexis-test-api.s3.eu-central-1.amazonaws.com/users.json',
      {
        method: 'GET',
      },
    )
      .then(response => {
        response.json().then(result => {
          console.log(result);
          AsyncStorage.setItem('bk_users', result);
        });
      })
      .catch(err => {
        console.error(err);
      });
  } catch (e) {}
};
