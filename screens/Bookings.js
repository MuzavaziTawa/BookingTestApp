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

import '../utils/return_bookings';
import '../utils/get_data';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
} from 'native-base';
import returnBookings from '../utils/return_bookings';
import returnCurrency from '../utils/return_currency';
import getData from '../utils/get_data';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default class Bookings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isloading: false,
      selectedyear: '',
      years: null,
      bookings: null,
      users: null,
      boats: null,
      statuses: null,
      currencies: null,
      truncSelectionData: [],
      truncSelectionMonth: '',
      viewAllInitiated: false,
    };
  }

  componentDidMount() {
    this.onGetSavedData();
  }

  onGetSavedData = async () => {
    var isDataSaved = (await AsyncStorage.getItem('bk_data_saved')) || null;

    if (isDataSaved == null) {
      await this.onFetchData();
    } else {
      this.setState({isloading: true});
      //get years
      var years = await new returnBookings().onGetBookingYears();
      years.sort();

      //get bookings
      var bookings = await new returnBookings().onGetBookings();

      //get users
      var users = (await AsyncStorage.getItem('bk_users')) || null;

      var boats = (await AsyncStorage.getItem('bk_boats')) || null;

      var statuses =
        (await AsyncStorage.getItem('bk_payment_statuses')) || null;

      var currencies = await new returnCurrency().onGetAllCurrencies();

      this.setState({
        selectedyear: '' + new Date().getFullYear(),
        years: years,
        bookings: bookings,
        users: users,
        boats: boats,
        statuses: statuses,
        currencies: currencies,
        isloading: false,
      });
    }
  };

  onGetTimeLapse(date) {
    var msDiff = new Date(date).getTime() - new Date().getTime(); //Future date - current date
    var diffDays = Math.floor(msDiff / (1000 * 60 * 60 * 24));

    if (diffDays < 1) {
      diffDays *= -1;
      return '(' + diffDays + ' days ago)';
    } else {
      return '(in ' + diffDays + ' days)';
    }
  }

  onFetchData = async () => {
    this.setState({isloading: true});

    //fetch from API
    new getData().onFetchAllAPIs();

    //save configuration
    await AsyncStorage.setItem('bk_data_saved', 'saved');

    //load data from storage
    this.onGetSavedData();

    this.setState({isloading: false});
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
        <Left style={{flex: 1}} />
        <Body style={{alignSelf: 'center', flex: 1}}>
          <Text
            style={{
              fontSize: wp('4%'),
              alignSelf: 'center',
              fontWeight: 'bold',
            }}>
            Bookings
          </Text>
        </Body>
        <Right style={{marginRight: wp('3%'), flex: 1}}>
          <TouchableOpacity onPress={() => this.onFetchData()}>
            <Text style={{fontSize: wp('3.5%'), color: '#0071EC'}}>
              Refresh
            </Text>
          </TouchableOpacity>
        </Right>
      </Header>
    );
  }

  renderViewAllHeader() {
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
          <TouchableOpacity
            onPress={() => this.setState({viewAllInitiated: false})}>
            <Text style={{fontSize: wp('3.5%'), color: '#0071EC'}}>Back</Text>
          </TouchableOpacity>
        </Left>
        <Body style={{alignSelf: 'center', flex: 1}}>
          <Text
            style={{
              fontSize: wp('4%'),
              alignSelf: 'center',
              fontWeight: 'bold',
            }}>
            {this.state.truncSelectionMonth + ' ' + this.state.selectedyear}
          </Text>
        </Body>
        <Right style={{marginRight: wp('3%'), flex: 1}}>
          <TouchableOpacity onPress={() => this.onFetchData()}>
            <Text style={{fontSize: wp('3.5%'), color: '#0071EC'}}>
              Refresh
            </Text>
          </TouchableOpacity>
        </Right>
      </Header>
    );
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

  getUserDetails(id, type) {
    var users = this.state.users;
    if (users == null) {
      return null;
    } else {
      var decodedUsers = JSON.parse(users);
      var filteredUser = decodedUsers.filter(function (el) {
        return el.id == id;
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

  getStatusDetails(id, type) {
    var PaymentStatus = this.state.statuses;
    if (PaymentStatus == null) {
      return null;
    } else {
      var decodedPaymentStatus = JSON.parse(PaymentStatus);
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

  onViewAllBookings = (booking, month) => {
    this.setState({
      truncSelectionData: booking,
      truncSelectionMonth: month,
      viewAllInitiated: true,
    });
  };

  renderYearView() {
    var data = this.state.years;
    if (data == null) {
      return <View />;
    } else {
      return (
        <FlatList
          scrollEnabled={true}
          horizontal={true}
          contentContainerStyle={{alignItems: 'center'}}
          style={{
            marginTop: hp('1%'),
            marginBottom: hp('1%'),
            alignSelf: 'center',
            paddingTop: hp('1%'),
          }}
          data={data}
          keyExtractor={(item, index) => index}
          renderItem={({item}) => this.renderYearItem(item)}
        />
      );
    }
  }

  renderYearItem = year => {
    return (
      <TouchableOpacity onPress={() => this.setState({selectedyear: year})}>
        <Text
          style={{
            fontSize: wp('4.5%'),
            color: this.state.selectedyear == year ? '#0071EC' : '#000',
            fontWeight: '200',
            marginHorizontal: wp('5%'),
          }}>
          {year}
        </Text>
      </TouchableOpacity>
    );
  };

  onEditBooking = async item => {
    await AsyncStorage.setItem(
      'bk_selected_booking',
      JSON.stringify(item),
    ).then(() => this.props.navigation.push('EditBooking'));
  };

  renderBookingsList() {
    var data = this.state.bookings;
    var selectedyear = this.state.selectedyear;
    if (data == null) {
      return <View />;
    } else {
      var yearlybookings = data.filter(function (el) {
        return new Date(el.date).getFullYear() == selectedyear;
      });

      var monthlyBookings = [];
      var monthlyBookingsNumber = [];

      if (yearlybookings != null || yearlybookings != undefined) {
        for (var a = 0; a < yearlybookings.length; a++) {
          var date = yearlybookings[a].date;
          var monthnumber = new Date(date).getMonth();
          var monthname = months[monthnumber];

          if (!monthlyBookingsNumber.includes(monthnumber)) {
            monthlyBookingsNumber.push(monthnumber);
            var allmonthlybookings = yearlybookings.filter(function (el) {
              return new Date(el.date).getMonth() == monthnumber;
            });

            allmonthlybookings.sort((a, b) =>
              new Date(a.date).getTime() > new Date(b.date).getTime() ? 1 : -1,
            );

            var partview = [];
            if (allmonthlybookings.length > 3) {
              partview = allmonthlybookings.slice(0, 3);
            }

            var bookingdata = {
              title: monthname,
              data:
                allmonthlybookings.length > 3 ? partview : allmonthlybookings,
              allbookings: allmonthlybookings,
              month: monthnumber,
              truncate: allmonthlybookings.length > 3 ? true : false,
            };
            monthlyBookings.push(bookingdata);
          }
        }
      }

      monthlyBookings.sort((a, b) => (a.month > b.month ? 1 : -1));

      if (monthlyBookings != null) {
        return (
          <SectionList
            sections={monthlyBookings}
            keyExtractor={(item, index) => index}
            initialNumToRender={3}
            style={{marginTop: hp('2%')}}
            renderItem={({item, index}) =>
              this.renderBookingView(
                item,
                monthlyBookings[index],
                index,
                monthlyBookings[index].allbookings.length,
              )
            }
            renderSectionHeader={({section: {title}}) => (
              <Text
                style={{
                  marginLeft: wp('5.2%'),
                  marginTop: hp('1%'),
                  marginBottom: hp('1%'),
                  textTransform: 'capitalize',
                  fontSize: wp('3.5%'),
                }}>
                {title}
              </Text>
            )}
            renderSectionFooter={({section: {title, allbookings, truncate}}) =>
              truncate ? (
                <TouchableOpacity
                  onPress={() => this.onViewAllBookings(allbookings, title)}
                  style={{
                    marginBottom: hp('1.5%'),
                    backgroundColor: '#0071EC',
                    marginLeft: wp('5%'),
                    marginRight: wp('5%'),
                    paddingHorizontal: wp('4%'),
                    paddingVertical: hp('2%'),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{fontSize: wp('4%'), color: '#ffffff'}}>
                    {'View All (' + allbookings.length + ')'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <Container style={{height: 0}} />
              )
            }
          />
        );
      }
    }
  }

  renderViewAllList() {
    var data = this.state.truncSelectionData;

    if (data == null) {
      return <View />;
    } else {
      return (
        <FlatList
          scrollEnabled={true}
          horizontal={false}
          style={{
            marginTop: hp('1%'),
            marginBottom: hp('1%'),
            paddingTop: hp('1%'),
          }}
          data={data}
          keyExtractor={(item, index) => '' + index}
          renderItem={({item, index}) =>
            this.renderBookingView(item, data[index], index, data.length)
          }
        />
      );
    }
  }

  renderBookingView = (item, singlebooking) => {
    return (
      <TouchableOpacity onPress={() => this.onEditBooking(item)}>
        <Card
          style={{
            marginBottom: hp('1.5%'),
            backgroundColor: '#FFF',
            marginLeft: wp('5%'),
            marginRight: wp('5%'),
            paddingHorizontal: wp('4%'),
            paddingVertical: hp('3%'),
          }}>
          <Col>
            <Text style={{paddingBottom: 3, fontSize: wp('3%')}}>
              {new Date(item.date).toLocaleDateString() +
                ' ' +
                this.onGetTimeLapse(item.date)}
            </Text>
            <Text
              numberOfLines={1}
              style={{paddingBottom: 7, fontWeight: '700', fontSize: wp('4%')}}>
              {this.getUserDetails(item.user, 'name') +
                ' @ ' +
                this.getBoatDetails(item.boat, 'name')}
            </Text>
            <Row>
              <Text
                style={{width: '50%', fontWeight: '700', fontSize: wp('4%')}}>
                {item.price +
                  ' ' +
                  this.getCurrency(item.currency, 'title_short').toUpperCase()}
              </Text>
              <Text
                style={{
                  width: '50%',
                  fontWeight: '700',
                  textAlign: 'right',
                  color:
                    item.payment_status == 1
                      ? '#DF2929'
                      : item.payment_status == 2
                      ? '#ECA130'
                      : '#23B443',
                }}>
                {this.getStatusDetails(
                  item.payment_status,
                  'title',
                ).toUpperCase()}
              </Text>
            </Row>
          </Col>
        </Card>
      </TouchableOpacity>
    );
  };

  render() {
    LogBox.ignoreAllLogs(true);
    return this.state.isloading ? (
      <Container
        style={{
          backgroundColor: '#EEE',
          alignSelf: 'center',
          justifyContent: 'center',
        }}>
        <ActivityIndicator color="#0071EC" size={'large'}></ActivityIndicator>
      </Container>
    ) : this.state.viewAllInitiated ? (
      <Container
        style={{
          backgroundColor: '#EEE',
          width: width,
          justifyContent: 'center',
        }}>
        {this.renderViewAllHeader()}
        <Content scrollEnabled>{this.renderViewAllList()}</Content>
      </Container>
    ) : (
      <Container
        style={{
          backgroundColor: '#EEE',
          width: width,
          justifyContent: 'center',
        }}>
        {this.renderHeader()}
        <Content scrollEnabled>
          {this.renderYearView()}
          {this.renderBookingsList()}
        </Content>
      </Container>
    );
  }
}
