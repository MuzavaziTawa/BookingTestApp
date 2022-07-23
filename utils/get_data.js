import AsyncStorage from '@react-native-async-storage/async-storage';

class getData {
  onFetchAllAPIs = async () => {
    onGetCurrencies();
    onGetBoatTypes();
    onGetBoats();
    onGetBookings();
    onGetPaymentStatuses();
    onGetUsers();
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
            AsyncStorage.setItem('bk_currencies', JSON.stringify(result));
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
            AsyncStorage.setItem('bk_bookings', JSON.stringify(result));
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
            AsyncStorage.setItem('bk_payment_statuses', JSON.stringify(result));
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
            AsyncStorage.setItem('bk_boat_types', JSON.stringify(result));
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
            AsyncStorage.setItem('bk_boats', JSON.stringify(result));
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
            AsyncStorage.setItem('bk_users', JSON.stringify(result));
          });
        })
        .catch(err => {
          console.error(err);
        });
    } catch (e) {}
  };
}

export default getData;
