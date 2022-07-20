import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Bookings from './screens/Bookings';
import Boats from './screens/Bookings';
import EditBooking from './screens/Bookings';

import {Icon} from 'native-base';
import {Platform, View} from 'react-native';
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
  const colors = {primary: '#501', accent: '#FFF'};
  return (
    <Tab.Navigator
      initialRouteName="Bookings"
      lazy={false}
      swipeEnabled={false}
      tabBarOptions={{
        showLabel: false,
        showIcon: true,
        indicatorStyle: {backgroundColor: '#FF9501'},
        style: {
          backgroundColor: colors.primary,
          height: hp('9%'),
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
            <Icon name="star" style={{fontSize: wp('10%'), color: color}} />
          ),
        }}
      />

      <Tab.Screen
        name="Boats"
        component={Boats}
        options={{
          tabBarLabel: 'Boats',
          tabBarIcon: ({color}) => (
            <Icon name="boat" style={{fontSize: wp('10%'), color: color}} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default App;
