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
} from 'native-base';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import returnBoat from '../utils/return_boat';

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
      var statuses =
        (await AsyncStorage.getItem('bk_payment_statuses')) || null;

      var currencies = await new returnCurrency().onGetAllCurrencies();

      this.setState({
        selectedbooking: selectedbooking,
        currencies: currencies,
        statuses: statuses,
      });
    }
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
    ) : (
      <Container
        style={{
          backgroundColor: '#EEE',
          height: height,
          width: width,
          justifyContent: 'center',
        }}>
        <Content>
          {this.renderHeader()}
          {this.renderEditView()}
        </Content>
      </Container>
    );
  }
}
