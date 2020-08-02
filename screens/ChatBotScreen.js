import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import Header from '../components/header';
import ApiKeys from '../constants/ApiKeys';
import { WebView } from 'react-native-webview';


export default class ChatbotScreen extends React.Component
{
  render() {
    return (
      <View style={styles.container} >
        <Header />
        <View style={styles.card} >
          <Text style={styles.cardText} >
            Type in the chat below "Tell me about..." to learn about different
            nutrients.
          </Text>
        </View>
        <View style={styles.webviewContainer} >

        {/* Web chat is embedded in an html file, deployed on firebase hosting.
            Code for html file not uploaded to github, use link to link in WebView */}
        <WebView 
          source={{ uri: 'https://nutrientview.firebaseapp.com/' }}
        />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  webviewContainer: {
    width: '100%',
    height: '100%',
    padding: 10,
  },
  card: {
    borderWidth: 0.5,
    borderColor: 'black',
    backgroundColor: 'papayawhip',
    borderRadius: 10,
    margin: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,

  },
  cardText: {
    fontSize: 18,
  }
});