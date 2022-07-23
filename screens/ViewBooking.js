import React, {Component} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  LogBox,
  Platform,
  SectionList,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import '../utils/return_boat';
import '../utils/get_data';

import {
  Header,
  Left,
  Body,
  Right,
  Content,
  Card,
  Col,
  Row,
  Container,
  Separator,
  Icon,
} from 'native-base';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import returnCurrency from '../utils/return_currency';
import ActionSheet from 'react-native-actionsheet';
import returnBookings from '../utils/return_bookings';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class ViewBooking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isloading: false,
      selectedbooking: null,
      statuses: null,
      currencies: null,
      boattypes: null,
      users: null,
      selectedcurrency: '',
      selectedstatus: '',
      stringStatuses: [],
      stringCurrencies: [],
    };
  }

  componentDidMount() {
    this.onGetSelectedBooking();
  }

  onGetSelectedBooking = async () => {
    var selectedbooking =
      (await AsyncStorage.getItem('bk_selected_booking')) || null;

    if (selectedbooking == null) {
    } else {
      this.setState({
        isloading: true,
      });
      var statuses =
        (await AsyncStorage.getItem('bk_payment_statuses')) || null;

      var boats = (await AsyncStorage.getItem('bk_boats')) || null;

      var currencies = await new returnCurrency().onGetAllCurrencies();

      var boattypes = (await AsyncStorage.getItem('bk_boat_types')) || null;

      var users = (await AsyncStorage.getItem('bk_users')) || null;

      this.setState({
        selectedbooking: JSON.parse(selectedbooking),
        boattypes: boattypes,
        boats: boats,
        users: users,
        currencies: currencies,
        statuses: JSON.parse(statuses),
        isloading: false,
      });

      var newCurArray = [];
      var newStArray = [];
      for (var a = 0; a < currencies.length; a++) {
        newCurArray.push(currencies[a].title_short.toUpperCase());
      }

      var allstatuses = JSON.parse(statuses);
      for (var a = 0; a < allstatuses.length; a++) {
        newStArray.push(allstatuses[a].title);
      }
      newCurArray.push('Cancel');
      newStArray.push('Cancel');

      this.setState({
        stringCurrencies: newCurArray,
        stringStatuses: newStArray,
      });
    }
  };

  onBackPressed = () => {
    this.props.navigation.push('BottomNavigator');
  };

  onSaveBooking = async () => {
    var selectedbooking = this.state.selectedbooking;
    var selectedcurrency =
      this.state.selectedcurrency == ''
        ? this.getCurrency(
            selectedbooking.currency,
            'title_short',
          ).toUpperCase()
        : this.state.selectedcurrency;
    var selectedstatus =
      this.state.selectedstatus == ''
        ? this.getStatusDetails(selectedbooking.payment_status, 'title')
        : this.state.selectedstatus;

    //get ids
    var currencyArray = this.state.currencies.filter(function (el) {
      return el.title_short.toLowerCase() == selectedcurrency.toLowerCase();
    });

    console.log(this.state.selectedstatus);

    var statusArray = this.state.statuses.filter(function (el) {
      return el.title.toLowerCase() == selectedstatus.toLowerCase();
    });

    var bookings = await new returnBookings().onGetBookings();

    for (var a = 0; a < bookings.length; a++) {
      if (bookings[a].id == selectedbooking.id) {
        bookings[a].currency = currencyArray[0].id;
        bookings[a].payment_status = statusArray[0].id;
      }
    }

    await AsyncStorage.setItem('bk_bookings', JSON.stringify(bookings));
    this.props.navigation.push('BottomNavigator');
  };

  renderHeader() {
    return (
      <Header
        transparent
        style={{
          elevation: 0,
          backgroundColor: '#FFF',
          alignContent: 'center',
          height: Platform.OS == 'ios' ? hp('10%') : hp('10%'),
        }}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
        <Left style={{flex: 1}}>
          <TouchableOpacity onPress={() => this.onBackPressed()}>
            <Text style={{fontSize: wp('3.5%'), color: '#0071EC'}}>Cancel</Text>
          </TouchableOpacity>
        </Left>
        <Body style={{alignSelf: 'center', flex: 1}}>
          <Text
            style={{
              fontSize: wp('4%'),
              alignSelf: 'center',
              fontWeight: 'bold',
            }}>
            Edit Booking
          </Text>
        </Body>
        <Right style={{marginRight: wp('3%'), flex: 1}}>
          <TouchableOpacity onPress={() => this.onSaveBooking()}>
            <Text style={{fontSize: wp('3.5%'), color: '#0071EC'}}>Save</Text>
          </TouchableOpacity>
        </Right>
      </Header>
    );
  }

  getUserDetails(id, type) {
    var users = this.state.users;
    var data = this.state.selectedbooking;
    if (users == null) {
      return null;
    } else {
      var decodedUsers = JSON.parse(users);
      var filteredUser = decodedUsers.filter(function (el) {
        return el.id == data['user'];
      });

      return type == 'id'
        ? filteredUser[0].id
        : type == 'name'
        ? filteredUser[0].first_name + ' ' + filteredUser[0].last_name
        : type == 'email'
        ? filteredUser[0].email
        : '';
    }
  }

  getBoatType(id, type) {
    var boatType = this.state.boattypes;
    if (boatType == null) {
      return null;
    } else {
      var decodedBoatType = JSON.parse(boatType);
      var filteredBoatType = decodedBoatType.filter(function (el) {
        return el.id == id;
      });

      return type == 'id'
        ? filteredBoatType[0].id
        : type == 'title'
        ? filteredBoatType[0].title
        : '';
    }
  }

  getBoatDetails(id, type) {
    var boats = this.state.boats;
    if (boats == null) {
      return null;
    } else {
      var decodedBoats = JSON.parse(boats);
      var filteredBoats = decodedBoats.filter(function (el) {
        return el.id == id;
      });

      return type == 'id'
        ? filteredBoats[0].id
        : type == 'name'
        ? filteredBoats[0].name
        : type == 'type'
        ? filteredBoats[0].type
        : type == 'owner'
        ? filteredBoats[0].owner
        : '';
    }
  }

  getCurrency(id, type) {
    var currencies = this.state.currencies;
    if (currencies == null) {
      return null;
    } else {
      var decodedcurrencies = currencies;
      var filteredCurrency = decodedcurrencies.filter(function (el) {
        return el.id == id;
      });

      return type == 'id'
        ? filteredCurrency[0].id
        : type == 'title'
        ? filteredCurrency[0].title
        : type == 'title_short'
        ? filteredCurrency[0].title_short
        : '';
    }
  }

  getStatusDetails(id, type) {
    var PaymentStatus = this.state.statuses;
    if (PaymentStatus == null) {
      return null;
    } else {
      var decodedPaymentStatus = PaymentStatus;
      var filteredPaymentStatus = decodedPaymentStatus.filter(function (el) {
        return el.id == id;
      });

      return type == 'id'
        ? filteredPaymentStatus[0].id
        : type == 'title'
        ? filteredPaymentStatus[0].title
        : '';
    }
  }

  renderEditView() {
    var data = this.state.selectedbooking;
    var selectedcurrency = this.getCurrency(
      data.currency,
      'title_short',
    ).toUpperCase();
    var status = this.getStatusDetails(data.payment_status, 'title');

    if (data == null) {
      return <View />;
    } else {
      return (
        <View
          style={{
            width: wp('100%'),
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: hp('5%'),
          }}>
          <Text style={{fontSize: wp('6%'), color: '#000000'}}>
            {this.getUserDetails(data.user, 'name')}
          </Text>
          <Text
            style={{
              fontSize: wp('3%'),
              color: '#000000',
              marginTop: hp('0.5%'),
            }}>
            {this.getBoatDetails(data.boat, 'name')}
          </Text>
          <Text
            style={{
              fontSize: wp('3%'),
              color: '#000000',
              marginTop: hp('0.2%'),
            }}>
            {this.getBoatType(this.getBoatDetails(data.boat, 'type'), 'title')}
          </Text>
          <Col
            style={{
              alignSelf: 'flex-start',
              marginLeft: wp('7%'),
              marginTop: hp('5%'),
            }}>
            <Text
              style={{
                fontSize: wp('3.6%'),
                color: '#000000',
                marginTop: hp('0.2%'),
              }}>
              Date
            </Text>
            <Text
              style={{
                fontSize: wp('4.5%'),
                color: '#000000',
                marginTop: hp('0.5%'),
                fontWeight: 'bold',
              }}>
              {new Date(data.date).toLocaleDateString()}
            </Text>
          </Col>
          <Separator
            style={{
              height: 1,
              marginTop: hp('2%'),
              backgroundColor: '#DDDDDD',
              width: wp('88%'),
            }}></Separator>
          <Row>
            <Col
              style={{
                alignSelf: 'flex-start',
                marginLeft: wp('7%'),
                marginTop: hp('5%'),
              }}>
              <Text
                style={{
                  fontSize: wp('3.6%'),
                  color: '#000000',
                  marginTop: hp('0.2%'),
                }}>
                Price
              </Text>
              <Text
                style={{
                  fontSize: wp('4.5%'),
                  color: '#000000',
                  marginTop: hp('0.5%'),
                  fontWeight: 'bold',
                }}>
                {data.price}
              </Text>
            </Col>
            <Row
              onPress={() => this.currencySheet.show()}
              style={{
                alignSelf: 'flex-start',
                marginLeft: wp('10%'),
                marginTop: hp('2.5%'),
              }}>
              <Col>
                <Text
                  style={{
                    fontSize: wp('3.6%'),
                    color: '#000000',
                    marginTop: hp('0.2%'),
                  }}>
                  Currency
                </Text>
                <Text
                  style={{
                    fontSize: wp('4.5%'),
                    color: '#000000',
                    marginTop: hp('0.5%'),
                    fontWeight: 'bold',
                  }}>
                  {this.state.selectedcurrency == ''
                    ? selectedcurrency
                    : this.state.selectedcurrency}
                </Text>
              </Col>
              <Col style={{alignItems: 'center', justifyContent: 'center'}}>
                <Icon
                  name="ios-chevron-down"
                  style={{fontSize: wp('4.5%'), color: '#000'}}
                />
              </Col>
            </Row>
          </Row>
          <Separator
            style={{
              height: 1,
              marginTop: hp('2%'),
              backgroundColor: '#DDDDDD',
              width: wp('88%'),
            }}></Separator>
          <Row
            onPress={() => this.statusSheet.show()}
            style={{
              alignSelf: 'flex-start',
              marginLeft: wp('4%'),
              marginTop: hp('2.5%'),
            }}>
            <Col>
              <Text
                style={{
                  fontSize: wp('3.6%'),
                  color: '#000000',
                  marginTop: hp('0.2%'),
                }}>
                Payment Status
              </Text>
              <Text
                style={{
                  fontSize: wp('4.5%'),
                  color: '#000000',
                  marginTop: hp('0.5%'),
                  fontWeight: 'bold',
                }}>
                {this.state.selectedstatus == ''
                  ? status
                  : this.state.selectedstatus}
              </Text>
            </Col>
            <Col
              style={{
                width: wp('50%'),
                alignItems: 'flex-end',
                marginRight: wp('5.2%'),
                justifyContent: 'center',
              }}>
              <Icon
                name="ios-chevron-down"
                style={{fontSize: wp('4.5%'), color: '#000'}}
              />
            </Col>
          </Row>
          <Separator
            style={{
              height: 1,
              marginTop: hp('2%'),
              backgroundColor: '#DDDDDD',
              width: wp('88%'),
            }}></Separator>
        </View>
      );
    }
  }

  render() {
    LogBox.ignoreAllLogs(true);

    var user = this.state.selectedbooking;

    return this.state.isloading || user == null ? (
      <Container
        style={{
          backgroundColor: '#EEE',
          alignSelf: 'center',
          justifyContent: 'center',
        }}>
        <ActivityIndicator color="#0071EC" size={'large'}></ActivityIndicator>
      </Container>
    ) : (
      <Container
        style={{
          height: height,
          width: width,
          backgroundColor: '#EEE',
          justifyContent: 'center',
        }}>
        {this.renderHeader()}
        <Content scrollEnabled>
          {this.renderEditView()}
          <ActionSheet
            ref={o => (this.currencySheet = o)}
            title={'Please select a currency'}
            options={this.state.stringCurrencies}
            cancelButtonIndex={3}
            destructiveButtonIndex={3}
            onPress={index => {
              if (index != 3) {
                this.setState({
                  selectedcurrency: this.state.stringCurrencies[index],
                });
              }
            }}
          />

          <ActionSheet
            ref={o => (this.statusSheet = o)}
            title={'Please select a payment status'}
            options={this.state.stringStatuses}
            cancelButtonIndex={3}
            destructiveButtonIndex={3}
            onPress={index => {
              if (index != 3) {
                this.setState({
                  selectedstatus: this.state.stringStatuses[index],
                });
              }
            }}
          />
        </Content>
      </Container>
    );
  }
}
