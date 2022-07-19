onGetPaymentStatus = async (id) => {
  var PaymentStatus = await AsyncStorage.getItem('bk_PaymentStatus') || null;
  if (PaymentStatus == null) {
    return null;
  } else {
    var decodedPaymentStatus = JSON.parse(PaymentStatus);
    var filteredPaymentStatus = decodedPaymentStatus.filter(function (el) {
      return el.id == id;
    });

    return filteredPaymentStatus;
  }
}

