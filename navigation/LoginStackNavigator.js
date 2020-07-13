import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ForgotPassScreen from '../screens/auth/ForgotPassScreen';


const Stack = createStackNavigator();

export default function LoginStackNavigator(){
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login" 
        component={LoginScreen} 
        options={{
          title: 'NutrientView',
          headerStyle: {
            backgroundColor: 'moccasin',
            height: 90,
          },
          headerTitleStyle: {
            color: 'steelblue',
            fontSize: 25,
            fontWeight: 'bold',
          }
        }}
      />
      <Stack.Screen 
        name="Signup" 
        component={SignupScreen} 
        options={{
          title: 'Signup',
          headerStyle: {
            backgroundColor: 'moccasin',
            height: 90,
          },
          headerTitleStyle: {
            color: 'steelblue',
            fontSize: 25,
            fontWeight: 'bold',
          },
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen 
        name="Forgot Password" 
        component={ForgotPassScreen} 
        options={{
          title: 'Forgot Password',
          headerStyle: {
            backgroundColor: 'moccasin',
            height: 90,
          },
          headerTitleStyle: {
            color: 'steelblue',
            fontSize: 25,
            fontWeight: 'bold',
          },
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  )
}