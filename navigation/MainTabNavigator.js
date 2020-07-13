import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
// Screens
import DailyReportScreen from '../screens/DailyReportScreen';
import CalendarScreen from '../screens/CalendarScreen';
import RecordScreen from '../screens/RecordScreen';
import ChatBotScreen from '../screens/ChatBotScreen';
import SettingsScreen from '../screens/Settings';


const Tab = createBottomTabNavigator();

export default function MainTabNavigator(){
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Daily Report"){
            iconName = 'ios-paper';
          }
          else if (route.name === "Calendar"){
            iconName = 'ios-calendar';
          }
          else if (route.name === "Record"){
            iconName = focused ? 'ios-add-circle' : 'ios-add-circle-outline';
          }
          else if (route.name === "Chat"){
            iconName = 'ios-chatbubbles'
          }
          else if (route.name === "Settings"){
            iconName = 'ios-settings';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'steelblue',
        inactiveTintColor: 'gray',
        style: {
          backgroundColor: 'ghostwhite',
        }
      }}
    >
      <Tab.Screen name="Daily Report" component={DailyReportScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Record" component={RecordScreen} />
      <Tab.Screen name="Chat" component={ChatBotScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  )
}