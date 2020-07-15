import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Header(){
  return(
    <View style={styles.container} >
      <View style={styles.content} >
        <Text style={styles.text} >Loading...</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'papayawhip',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 30,
    textAlign: 'center'
  }
});