import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Bookings from './screens/Bookings';
import Boats from './screens/Boats';
import EditBooking from './screens/ViewBooking';

import {Icon} from 'native-base';
import {NavigationContainer} from '@react-navigation/native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="BottomNavigator"
          component={BottomAppNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EditBooking"
          component={EditBooking}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function BottomAppNavigator() {
  const colors = {primary: '#F5F6F7F0', accent: '#0071EC'};
  return (
    <Tab.Navigator
      initialRouteName="Bookings"
      lazy={false}
      swipeEnabled={false}
      tabBarOptions={{
        shifting: true,
        showLabel: true,
        showIcon: true,
        indicatorStyle: {backgroundColor: '#FF9501'},
        style: {
          backgroundColor: colors.primary,
          paddingBottom: hp('0.7%'),
          paddingTop: hp('1%'),
        },
        inactiveBackgroundColor: colors.primary,
        activeBackgroundColor: colors.primary,
        inactiveTintColor: colors.accent,
        activeTintColor: colors.accent,
      }}>
      <Tab.Screen
        name="Bookings"
        component={Bookings}
        options={{
          tabBarLabel: 'Bookings',
          tabBarIcon: ({color}) => (
            <Icon
              name="ios-book-outline"
              style={{fontSize: wp('6%'), color: color}}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Boats"
        component={Boats}
        options={{
          tabBarLabel: 'Boats',
          tabBarIcon: ({color}) => (
            <Icon
              name="boat-outline"
              style={{fontSize: wp('6%'), color: color}}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default App;
