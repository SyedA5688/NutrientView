import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainTabNavigator from './navigation/MainTabNavigator';
import LoginStackNavigator from './navigation/LoginStackNavigator';
import ApiKeys from './constants/ApiKeys';
import * as firebase from 'firebase';


export default class App extends React.Component
{
  constructor(props){
    super(props);
    this.state = {
      isAuthenticated: false,
    };
    if (!firebase.apps.length){
      firebase.initializeApp(ApiKeys.firebaseConfig);
    }
    firebase.auth().onAuthStateChanged(this.onAuthChange);
  }

  onAuthChange = (user) => {
    this.setState({isAuthenticated: !!user});
  }

  render(){
    if (this.state.isAuthenticated){
      // If logged in, show Main Tab Navigator
      return (
        <NavigationContainer>
          <MainTabNavigator />
        </NavigationContainer>
      );
    } else {
      return (
        <NavigationContainer>
          <LoginStackNavigator />
        </NavigationContainer>
      );
    }
  }
}
