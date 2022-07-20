import React, {Component} from 'react';
import {
  Dimensions,
  FlatList,
  LogBox,
  Platform,
  StatusBar,
  Text,
} from 'react-native';
import {
  Card,
  Container,
  SectionList,
  Header,
  Left,
  Body,
  Right,
} from 'native-base';

import '../utils/return_bookings';
import '../utils/get_data';
import {SafeAreaView} from 'react-native-safe-area-context';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

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

      selectedyear: '2022',
    };
  }

  componentDidMount() {
    this.onGetData();
  }

  onGetData() {
    this.setState({isloading: true});

    //fetch from API
    onFetchAllAPIs();

    this.setState({isloading: false});
  }

  renderHeader() {
    return (
      <Header
        transparent
        style={{
          elevation: 0,
          backgroundColor: '#FFF',
          height: Platform.OS == 'ios' ? hp('12%') : hp('15%'),
        }}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
        <Left />
        <Body>
          <Text style={{fontSize: wp('4%'), fontWeight: 'bold'}}>Bookings</Text>
        </Body>
        <Right style={{marginRight: wp('3%')}}>
          <Text style={{fontSize: wp('4%'), fontWeight: 'bold', color: '#046'}}>
            Refresh
          </Text>
        </Right>
      </Header>
    );
  }

  renderYearView() {
    var data = onGetBookingYears();
    if (data == null) {
      return <Container />;
    } else {
      return (
        <FlatList
          scrollEnabled={true}
          horizontal={true}
          style={{marginTop: hp('1%'), marginBottom: hp('1%')}}
          data={data}
          keyExtractor={(item, index) => item + index}
          renderItem={({item}) => this.renderYearItem(item)}
        />
      );
    }
  }

  renderYearItem = () => {
    return (
      <TouchableOpacity onPress={() => this.setState({selectedyear: year})}>
        <Text
          style={{
            fontSize: wp('4%'),
            color: selectedyear == year ? '#046' : '#000',
          }}>
          {year}
        </Text>
      </TouchableOpacity>
    );
  };

  renderBookingsList() {
    var data = onGetBookings();
    if (data == null) {
      return <Container />;
    } else {
      var yearlybookings = data.filter(function (el) {
        return new Date(el.date).getFullYear() == selectedyear;
      });

      var monthlyBookings = [];

      for (var a = 0; a < yearlybookings.length; a++) {
        var date = yearlybookings[a].date;
        var monthnumber = new Date(date).getMonth();
        var monthname = months[monthnumber];

        if (!monthlyBookings.includes(monthname)) {
          var allmonthlybookings = yearlybookings.filter(function (el) {
            return new Date(el.date).getMonth() == monthnumber;
          });
          var bookingdata = {month: monthname, bookings: allmonthlybookings};
          monthlyBookings.push(bookingdata);
        }
      }

      return (
        <SectionList
          sections={monthlyBookings}
          keyExtractor={(item, index) => item.month}
          renderItem={({item}) => this.renderBookingCard(item)}
          renderSectionHeader={({section: {month}}) => <Text>{month}</Text>}
        />
      );
    }
  }

  renderBookingCard = item => {
    return (
      <Card>
        <Text>{item.data.id}</Text>
      </Card>
    );
  };

  render() {
    LogBox.ignoreAllLogs(true);
    return (
      <SafeAreaView style={{flex: 1}}>
        <Container
          style={{
            backgroundColor: '#FFF',
            height: height,
            width: width,
            justifyContent: 'center',
          }}>
          {this.renderHeader()},{this.renderYearView()},
        </Container>
      </SafeAreaView>
    );
  }
}
