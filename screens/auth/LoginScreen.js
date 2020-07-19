import React from 'react';
import { StyleSheet, Text, View, TextInput, Dimensions, Alert, TouchableOpacity } from 'react-native';
import * as firebase from 'firebase';


export default class LoginScreen extends React.Component
{
  constructor(props){
    super(props);
    this.state = {
      email: "",
      password: "",
    }
  }

  onLoginPress = () => {
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        //console.log("Logged in successfully");
      }, (error) => {
        Alert.alert(error);
      });
  }

  onCreateAccountPress = () => {
    this.props.navigation.navigate("Signup");
  }

  onForgotPasswordPress = () => {
    this.props.navigation.navigate("Forgot Password");
  }

  render(){
    return (
      <View style={styles.container} >
        <View style={styles.content} >
          <Text style={styles.titleText} >Login or Signup Below to use NutrientView</Text>
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

          <View style={styles.buttonContainer} >
            <TouchableOpacity 
              style={[styles.buttonBox, {backgroundColor: 'mediumaquamarine',}]} 
              onPress={this.onLoginPress} 
            >
              <Text style={styles.buttonText} >Login</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.buttonBox, {backgroundColor: 'skyblue',}]} 
              onPress={this.onCreateAccountPress} 
            >
              <Text style={styles.buttonText} >Create An Account</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.buttonBox, {backgroundColor: 'lightpink',}]} 
              onPress={this.onForgotPasswordPress} 
            >
              <Text style={styles.buttonText} >Forgot Password</Text>
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
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 15,
  },
});