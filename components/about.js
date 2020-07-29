import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function About(){
  return(
    <View style={styles.container} >
      <View style={styles.titleTextContainer} >
        <Text style={styles.titleText} >About page</Text>
      </View>
      <View style={styles.mainTextContainer} >
        <View style={styles.section} >
          <Text style={styles.mainTextHeader} >Developed by:</Text>
          <Text style={styles.mainText} >Syed Rizvi</Text>
        </View>
        <View style={styles.section} >
          <Text style={styles.mainTextHeader} >Framework:</Text>
          <Text style={styles.mainText} >React Native/Expo CLI</Text>
        </View>
        <View style={styles.section} >
          <Text style={styles.mainTextHeader} >Services Used:</Text>
          <Text style={styles.mainText} >IBM Watson food image recognition</Text>
          <Text style={styles.mainText} >Edamam Nutrition Analysis API</Text>
          <Text style={styles.mainText} >Firebase authentication service</Text>
        </View>
        <View style={styles.section} >
          <Text style={styles.mainTextHeader} >Backend and Data Storage:</Text>
          <Text style={styles.mainText} >Firebase Realtime Database</Text>
          <Text style={styles.mainText} >Firebase Storage</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'papayawhip',
    paddingVertical: 30,
    paddingHorizontal: 25,
  },
  titleTextContainer: {
    borderBottomWidth: 1,
    borderColor: 'grey',
    paddingBottom: 10,
    marginBottom: 15,
    marginTop: 5,
  },
  titleText:{
    fontSize: 35,
    color: 'grey',
    marginLeft: 15,
  },
  mainTextContainer: {
    width: '90%',
    alignSelf: 'center',
  },
  section: {
    marginBottom: 20,
  },
  mainTextHeader: {
    fontSize: 24,
    color: 'steelblue',
  },
  mainText: {
    fontSize: 20,
    marginLeft: 15,
    marginTop: 2,
  },
});