import React from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, Button } from 'react-native';
import Header from '../components/header';
import dailyNutrientTotals from '../constants/dailyNutritionIntake';
import * as firebase from 'firebase';


const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", 
  "September", "October", "November", "December"];

export default class DailyReportScreen extends React.Component
{
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      nutrientTotals: {},
      mealInfo: {},
    }
  }

  componentDidMount() {
    this._isMounted = true;
    // Retrieve data from firebase, add listener to keep meal info and nutrient totals updated
    let uid = firebase.auth().currentUser.uid;
    let time = new Date();
    let monthNum = parseInt(time.getMonth()) + 1;
    let dateStr = monthNum.toString() + "-" + time.getDate()
    const databaseRef = firebase.database().ref('users/' + uid + "/NutritionReports/" + time.getFullYear() + "/" + monthNames[time.getMonth()] + "/" + dateStr);
    const mealRef = databaseRef.child("Meals");
    const nutritionRef = databaseRef.child("Nutrients");

    nutritionRef.on('value', (snapshot) => {
      // This method fires everytime database value at node changes
      //console.log(snapshot.val());
      if (snapshot.exists() && this._isMounted) {
        this.setState({ nutrientTotals: snapshot.val() });
      }
      // No else, because it is possible user hasn't entered any meals yet for the day, alert would come up for no reason
    });

    mealRef.on('value', (snapshot) => {
      if (snapshot.exists() && this._isMounted) {
        this.setState({ mealInfo: snapshot.val() });
      }
    })
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const nutrientComponentsList = (Object.keys(this.state.nutrientTotals).length > 0) ? (
      <View>
        {Object.keys(this.state.nutrientTotals).map(key => {
          let obj = this.state.nutrientTotals;
          let percent = obj[key].quantity / dailyNutrientTotals[key].quantity;
          if (percent >= 1) {
            percent = 1;
          }
          let widthNum = ((Dimensions.get('window').width * 4) / 7) * percent;
          //console.log(obj[key].label,obj[key].quantity, dailyNutrientTotals[key].quantity, percent, widthNum);
          return (
            <View style={styles.listItemContainer} key={key + "View"} >
              <Text style={styles.listItemText} key={key + "Text"} >{ obj[key].label }{/* ({ obj[key].unit }) */}: </Text>
              <View style={styles.listItemBar} key={key + "Bar"} >
                <View style={[styles.barFill, { width: widthNum }]} key={key + "Fill"} ></View>
              </View>
            </View>
          )
        })}
      </View>
    ) : (
      <View style={{ alignItems: 'center', padding: 20 }} >
        <Text style={{ textAlign: 'center', fontSize: 20, color: 'grey' }} >Add meal items in the Record Tab to see todays nutrient totals</Text>
      </View>
    );

    const mealList = (Object.keys(this.state.mealInfo).length > 0) ? (
      <View style={styles.mealsContainer} >
        {Object.keys(this.state.mealInfo).map((key) => {
          // Returns for each mealname in object
          return (
            <View style={styles.eachMealContainer} key={key + "View"} >
              <Text style={styles.mealNameText} key={key + "Text"} >{key}</Text>
              {Object.keys(this.state.mealInfo[key]).map((foodkey) => {
                // Returns for each food item in meal
                return (
                  <Text style={styles.foodItemText} key={key + foodkey + "Text"} >{this.state.mealInfo[key][foodkey]}</Text>
                )
              })}
            </View>
          )
        })}
      </View>
    ) : (<View></View>);

    return (
      <View style={styles.container} >
        <Header />
        <ScrollView>
          <View style={styles.content} >
            <View style={styles.section} >
              <View style={styles.titleTextContainer} >
                <Text style={styles.titleText} >Todays Progress</Text>
              </View>
              {nutrientComponentsList}
            </View>

            <View style={styles.section} >
              <View style={styles.titleTextContainer} >
                <Text style={styles.titleText} >Meal Items</Text>
              </View>
              {mealList}
            </View>
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
    marginHorizontal: 25,
  },
  section: {
    marginBottom: 20,
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
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 3,
  },
  listItemText: {
    fontSize: 16,
  },
  listItemBar: {
    width: (Dimensions.get('window').width * 4) / 7,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    height: 18,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: 'lightgray',
  },
  barFill: {
    backgroundColor: 'steelblue',
    borderColor: 'gray',
    borderRadius: 7
  },
  mealsContainer: {
    paddingHorizontal: 20,
  },
  eachMealContainer: {
    marginBottom: 12,
  },
  mealNameText: {
    fontSize: 24,
    marginBottom: 2,
  },
  foodItemText: {
    fontSize: 18,
    marginLeft: 20,
  },
});