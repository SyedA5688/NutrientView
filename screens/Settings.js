import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import Header from '../components/header';
import { SimpleLineIcons } from '@expo/vector-icons'; 
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
        <View style={styles.content} >
          <Text style={styles.titleText} >Settings</Text>
          <TouchableOpacity style={[styles.card, {borderTopWidth: 1}]} >
            <Text style={styles.cardText} >About App</Text>
            <SimpleLineIcons name="arrow-right" size={18} color="grey" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} >
            <Text style={styles.cardText} >Profile</Text>
            <SimpleLineIcons name="arrow-right" size={18} color="grey" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.card, {borderBottomWidth: 1}]} >
            <Text style={styles.cardText} >Account</Text>
            <SimpleLineIcons name="arrow-right" size={18} color="grey" />
          </TouchableOpacity>

          <View style={styles.signoutContainer} >
            <TouchableOpacity style={styles.signoutButton} onPress={this.onSignoutPress} >
              <Text style={styles.signoutButtonText} >Signout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'papayawhip',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  titleText: {
    fontSize: 35,
    color: 'grey',
    marginBottom: 20,
    marginLeft: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: 'grey',
    paddingVertical: 2,
    paddingHorizontal: 10,
  },
  cardText: {
    fontSize: 20,
    color: 'grey',
  },
  signoutContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  signoutButton: {
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'lightgrey',
    borderRadius: 10,
    paddingVertical: 3,
    width: '30%'
  },
  signoutButtonText: {
    fontSize: 20,
    textAlign: 'center',
  }
});