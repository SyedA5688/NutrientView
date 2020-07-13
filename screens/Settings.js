import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import Header from '../components/header';
import * as firebase from 'firebase';


export default class SettingsScreen extends React.Component
{
  onSignoutPress = () => {
    firebase.auth().signOut();
  }

  render(){
    return (
      <View style={styles.container} >
        <Header />
        <View style={{marginTop: 80, marginLeft: 20}} >
          <Text>Settings Screen</Text>
          <Button title="Signout" onPress={this.onSignoutPress} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'papayawhip',
    alignItems: 'center',
  },
});