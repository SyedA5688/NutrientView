import React from 'react';
import { StyleSheet, Text, View, Dimensions, Alert, TouchableOpacity, TextInput } from 'react-native';
import * as firebase from 'firebase';


export default class SignupScreen extends React.Component
{
  constructor(props){
    super(props);
    this.state = {
      email: "",
      password: "",
      passwordConfirm: "",
    };
  }

  onSignupPress = () => {
    if (this.state.password !== this.state.passwordConfirm){
      Alert.alert("Passwords do not match");
      return;
    }
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        // Successful signup handled in MonitorScreen.js by onAuthChange event listener
      }, (error) => {
        Alert.alert(error.message);
      });
  }

  render(){
    return (
      <View style={styles.container} >
          <View style={styles.content} >
            <Text style={styles.titleText} >Create an Account Below by entering your Email and Choosing a Password</Text>
            <TextInput style={styles.textInput} 
              value={this.state.email}
              onChangeText={(text) => { this.setState({ email: text }) }}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TextInput style={styles.textInput} 
              value={this.state.password}
              onChangeText={(text) => { this.setState({ password: text }) }}
              placeholder="Password"
              secureTextEntry={true}
              autoCorrect={false}
            />

            <TextInput style={styles.textInput}
              value={this.state.passwordConfirm}
              onChangeText={(text) => { this.setState({ passwordConfirm: text }) }}
              placeholder="Confirm Password"
              secureTextEntry={true}
              autoCorrect={false}
            />

            <View style={styles.buttonContainer} >
              <TouchableOpacity style={styles.buttonBox} onPress={this.onSignupPress} >
                <Text style={styles.buttonText} >Signup</Text>
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
    backgroundColor: 'skyblue',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 15,
  },
});