import React from 'react';
import { StyleSheet, Text, View, Button, Linking } from 'react-native';

export default function MoreInfo(){
  return(
    <View style={styles.container} >
      <View style={styles.titleTextContainer} >
        <Text style={styles.titleText} >Nutrition Resources</Text>
      </View>
      <View style={styles.allCardsContainer} >
        <View style={styles.cardBox} >
          <Text style={styles.cardText} >
            For more information on major nutrient groups and the benefits of specific nutrients, 
            visit this web page from MedicalNewsToday:
          </Text>
          <Button title="MedicalNewsToday" onPress={() => { Linking.openURL('https://www.medicalnewstoday.com/articles/326132#vitamins') }} />
        </View>
        <View style={styles.cardBox} >
          <Text style={styles.cardText} >
            For a simple explanation of general dietary guidelines, visit this web page from
            Mayo clinic:
          </Text>
          <Button title="Mayo Clinic" onPress={() => { Linking.openURL('https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/dietary-guidelines/art-20045584#:~:text=Grains%2C%20at%20least%20half%20of,nuts%2C%20seeds%20and%20soy%20products') }} />
        </View>
        <View style={styles.cardBox} >
          <Text style={styles.cardText} >
            For a list of some nutrient-dense, healthy foods to incorporate into your diet, read 
            this article by Harvard Health Publishing
          </Text>
          <Button title="Harvard Article" onPress={() => { Linking.openURL('https://www.health.harvard.edu/staying-healthy/add-more-nutrient-dense-foods-to-your-diet') }} />
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
  allCardsContainer: {
    alignItems: 'center',
  },
  cardBox: {
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: 'honeydew',
    borderColor: 'grey',
    width: '90%',
    paddingTop: 8,
    paddingBottom: 2,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    textAlign: 'center',
  }
});