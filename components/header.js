import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Header(){
  return(
    <View style={styles.header} >
      <Text style={styles.title} >NutrientView</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    height: 90,
    width: '100%',
    backgroundColor: 'burlywood',
    paddingTop: 45,
  },
  title: {
    textAlign: 'center',
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
  }
});