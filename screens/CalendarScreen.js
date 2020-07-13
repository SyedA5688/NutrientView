import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Header from '../components/header';


export default function CalendarScreen(){
  return (
    <View style={styles.container} >
      <Header />
      <View style={{marginTop: 80, marginLeft: 20}} >
        <Text>Calendar Screen</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'papayawhip',
    alignItems: 'center',
  },
});