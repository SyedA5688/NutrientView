import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
// Screens
import Settings from '../screens/Settings';
import About from '../components/about';
import MoreInfo from '../components/moreInfo';


const Stack = createStackNavigator();

export default function LoginStackNavigator(){
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Settings" 
        component={Settings} 
        options={{
          title: 'NutrientView',
          headerStyle: {
            backgroundColor: 'burlywood',
            height: 90,
          },
          headerTitleStyle: {
            color: 'white',
            fontSize: 25,
            fontWeight: 'bold',
          }
        }}
      />
      <Stack.Screen 
        name="About" 
        component={About} 
        options={{
          title: 'NutrientView',
          headerStyle: {
            backgroundColor: 'burlywood',
            height: 90,
          },
          headerTitleStyle: {
            color: 'white',
            fontSize: 25,
            fontWeight: 'bold',
          },
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen 
        name="More Info" 
        component={MoreInfo} 
        options={{
          title: 'NutrientView',
          headerStyle: {
            backgroundColor: 'burlywood',
            height: 90,
          },
          headerTitleStyle: {
            color: 'white',
            fontSize: 25,
            fontWeight: 'bold',
          },
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  )
}