import React from 'react';
import { StyleSheet, Text, View, Dimensions, Alert, TouchableOpacity, TextInput } from 'react-native';
import * as firebase from 'firebase';


export default class ForgotPassScreen extends React.Component
{
  constructor(props){
    super(props);
    this.state = {
      email: "",
    };
  }

  onForgotPassPress = () => {
    firebase.auth().sendPasswordResetEmail(this.state.email)
      .then(() => {
        Alert.alert("Password reset email was sent.")
      }, (error) => {
        Alert.alert(error.message);
      })
  }

  render(){
    return (
      <View style={styles.container} >
          <View style={styles.content} >
            <Text style={styles.titleText} >Enter Your Email Address Below to Receive a Password Reset Email</Text>
            <TextInput style={styles.textInput} 
              value={this.state.email}
              onChangeText={(text) => { this.setState({ email: text }) }}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />


          <View style={styles.buttonContainer} >
            <TouchableOpacity style={styles.buttonBox} onPress={this.onForgotPassPress} >
              <Text style={styles.buttonText} >Reset Password</Text>
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
    alignItems: 'center',
    padding: 35,
  },
  titleText: {
    fontSize: 22,
    marginTop: 20,
    marginBottom: 30,
    textAlign: 'center',
  },
  textInput: {
    width: (Dimensions.get('window').width * 2) / 3,
    height: 40,
    borderWidth: 1,
    marginBottom: 12,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 15,
  },
  buttonBox: {
    borderWidth: 1,
    borderRadius: 8,
    width: '50%',
    paddingVertical: 5,
    marginBottom: 8,
    backgroundColor: 'lightpink',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 15,
  },
});