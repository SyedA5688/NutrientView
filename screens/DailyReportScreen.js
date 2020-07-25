import React from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, Button } from 'react-native';
import Header from '../components/header';
import * as firebase from 'firebase';


const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", 
  "September", "October", "November", "December"];

export default class DailyReportScreen extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      nutrientTotals: {},
      mealInfo: {},
    }
  }

  componentDidMount() {
    // Retrieve data from firebase, add listener to keep meal info and nutrient totals updated
    let uid = firebase.auth().currentUser.uid;
    let time = new Date();
    let dateStr = time.getMonth() + "-" + time.getDate()
    const databaseRef = firebase.database().ref().child('users/' + uid + "/NutritionReports").child(time.getFullYear()).child(monthNames[time.getMonth()]).child(dateStr);
    const mealRef = databaseRef.child("Meals");
    const nutritionRef = databaseRef.child("Nutrients");

    nutritionRef.on('value', (snapshot) => {
      // This method fires everytime database value at node changes
      //console.log(snapshot.val());
      if (snapshot.exists()) {
        this.setState({ nutrientTotals: snapshot.val() });
      }
      // No else, because it is possible user hasn't entered any meals yet for the day, alert would come up for no reason
    });

    mealRef.on('value', (snapshot) => {
      if (snapshot.exists()) {
        this.setState({ mealInfo: snapshot.val() });
      }
    })
  }

  render() {
    return (
      <View style={styles.container} >
        <Header />
        <ScrollView>
          <View style={styles.content} >
            <Text style={styles.titleText} >Nutrition Progress</Text>

            <Button title="Check State" onPress={() => { console.log(this.state.nutrientTotals) }} />
            {Object.keys(this.state.nutrientTotals).map(function (objKey) {
              return (
                <View style={styles.listItemContainer} key={objKey + "View"} >
                  <Text style={styles.listItemText} key={objKey + "Text"} >Nutrients: </Text>
                  <View style={styles.listItemBar} key={objKey + "Bar"} >
                    <View style={styles.barFill} key={objKey + "Fill"} ></View>
                  </View>
                </View>
              )
            })}

            {/* 
            <View style={styles.listItemContainer} >
              <Text style={styles.listItemText} >Nutrient:</Text>
              <View style={styles.listItemBar} >
                <View style={styles.barFill} ></View>
              </View>
            </View>
            */}
          </View>
        </ScrollView>
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
    marginVertical: 30,
    marginHorizontal: 30,
  },
  titleText:{
    fontSize: 35,
    color: 'grey',
    marginBottom: 25,
    marginLeft: 15,
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  listItemText: {
    fontSize: 18,
  },
  listItemBar: {
    width: (Dimensions.get('window').width * 3) / 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    height: 18,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: 'lightgray',
  },
  barFill: {
    backgroundColor: 'darkseagreen',
    borderColor: 'gray',
    borderTopLeftRadius: 7,
    borderBottomLeftRadius: 7,
    width: ((Dimensions.get('window').width * 3) / 5) * 0.7,
  },
});