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

export default class Boats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isloading: false,
      boats: null,
      boattypes: null,
      users: null,
      sorttype: 'asc',
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
      var boats = (await AsyncStorage.getItem('bk_boats')) || null;

      var boattypes = (await AsyncStorage.getItem('bk_boat_types')) || null;

      var users = (await AsyncStorage.getItem('bk_users')) || null;

      this.setState({
        boats: boats != null ? JSON.parse(boats) : [],
        boattypes: boattypes,
        users: users,
        isloading: false,
      });
    }
  };

  onFetchData = async () => {
    this.setState({isloading: true});

    //fetch from API
    await onFetchAllAPIs();

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
            Boats
          </Text>
        </Body>
        <Right style={{marginRight: wp('3%'), flex: 1}}>
          <TouchableOpacity
            onPress={() =>
              this.setState({
                sorttype: this.state.sorttype == 'asc' ? 'dsc' : 'asc',
              })
            }>
            <Text style={{fontSize: wp('3.5%'), color: '#0071EC'}}>
              Invert Sort
            </Text>
          </TouchableOpacity>
        </Right>
      </Header>
    );
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

  renderBoatList() {
    var data = this.state.boats;
    var sorttype = this.state.sorttype;

    if (data == null) {
      return <View />;
    } else {
      var boatsByType = [];
      var allTypes = [];

      if (data != null || data != undefined) {
        for (var a = 0; a < data.length; a++) {
          var type = data[a].type;
          var typename = this.getBoatType(type, 'title');

          if (!allTypes.includes(type)) {
            allTypes.push(type);
            var allboats = data.filter(function (el) {
              return el.type == type;
            });
            allboats.sort((a, b) => (a.name > b.name ? 1 : -1));
            var boatdata = {title: typename, data: allboats};
            boatsByType.push(boatdata);
          }
        }
      }

      if (sorttype == 'asc') {
        boatsByType.sort((a, b) => (a.title > b.title ? 1 : -1));
      } else {
        boatsByType.sort((a, b) => (b.title > a.title ? 1 : -1));
      }

      return (
        <SectionList
          sections={boatsByType}
          style={{marginTop: hp('1%')}}
          keyExtractor={(item, index) => index}
          renderItem={({item}) => this.renderBoatView(item)}
          renderSectionHeader={({section: {title}}) => (
            <Text
              style={{
                marginLeft: wp('5%'),
                marginTop: hp('1%'),
                textTransform: 'capitalize',
              }}>
              {title}
            </Text>
          )}
        />
      );
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

  invertSort = () => {
    boatsByType.sort((a, b) => (a.title > b.title ? 1 : -1));
  };

  renderBoatView = item => {
    return (
      <Card
        style={{
          marginBottom: hp('1%'),
          backgroundColor: '#FFF',
          marginLeft: wp('5%'),
          marginRight: wp('5%'),
          paddingHorizontal: wp('4%'),
          paddingVertical: hp('3%'),
        }}>
        <Col>
          <Text
            numberOfLines={1}
            style={{paddingBottom: 4, fontWeight: '300', fontSize: wp('3.5%')}}>
            {this.getUserDetails(item.owner, 'name')}
          </Text>

          <Text
            numberOfLines={1}
            style={{fontWeight: '700', fontSize: wp('4%')}}>
            {item.name + ' ' + this.getBoatType(item.type, 'title')}
          </Text>
        </Col>
      </Card>
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
          {this.renderBoatList()}
        </Content>
      </Container>
    );
  }
}
