import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Header from '../components/header';
import CalendarModal from '../components/calendarModal';
import dailyNutrientTotals from '../constants/dailyNutritionIntake';
import * as firebase from 'firebase';


const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", 
  "September", "October", "November", "December"];

export default class CalendarScreen extends React.Component
{
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      showCalendarModal: false,
      modalDateInput: {},
      nutritionInfo: {},
      allPercentList: [],
      deficientList: [],
    }
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onDatePress = (day) => {
    this.setState({ modalDateInput: day });
    this.getDateNutritionData(day);
  }

  getDateNutritionData = (dayObj) => {
    let uid = firebase.auth().currentUser.uid;
    let dateStr = dayObj.month + "-" + dayObj.day;
    //console.log("Ran for", dateStr);
    const databaseRef = firebase.database().ref('users/' + uid + "/NutritionReports/" + dayObj.year + "/" + monthNames[dayObj.month - 1] + "/" + dateStr + "/Nutrients");
    databaseRef.once('value', (snapshot) => {
      if (snapshot.exists() && this._isMounted) {
        this.setState({ nutritionInfo: snapshot.val() });
      }
    }).then(() => {
      if (Object.keys(this.state.nutritionInfo).length > 0) {
        let num = 0;
        let list = Object.keys(this.state.nutritionInfo).map(key => {
          let percent = this.state.nutritionInfo[key].quantity / dailyNutrientTotals[key].quantity;
          num += 1;
          let formattedPercent = Math.round((percent*100));
          let obj = {
            "name": this.state.nutritionInfo[key].label,
            "percent": formattedPercent,
          }
          return obj;
        });
        //console.log(list);
        this.setState({ allPercentList: list });
      }
    }).then(() => {
      if (this.state.allPercentList.length > 0) {
        let deficList = this.state.allPercentList.filter(obj => obj.percent < 40);
        this.setState({ deficientList: deficList });
        //console.log("deficList: ", deficList);
      }
    }).then(() => { this.toggleCalendarModal(); });
  }

  clearState = () => {
    if (this._isMounted) {
      this.setState({
        nutritionInfo: {},
        allPercentList: [],
        deficientList: [],
      })
    }
  }

  toggleCalendarModal = () => {
    this.setState({ showCalendarModal: !this.state.showCalendarModal });
  }

  render() {
    return (
      <View style={styles.container} >
        <Header />
        <CalendarModal 
          {...this.state} 
          toggleCalendarModal={this.toggleCalendarModal} 
          clearState={this.clearState} 
        />

        <View style={styles.content} >
          <View style={styles.titleTextContainer} >
            <Text style={styles.titleText} >Calendar Screen</Text>
          </View>
          <View style={styles.calendarContainer} >
            <Calendar
              onDayPress={this.onDatePress}
            />
          </View>
          <View style={styles.cardContainer} >
            <Text style={styles.cardText} >
              Click on a day to view what nutrients you missed on that day, along
              with some nutritional information
            </Text>
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
    marginVertical: 30,
    marginHorizontal: 25,
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
  calendarContainer: {
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 5,
    padding: 5,
    backgroundColor: '#fafafa'
  },
  cardContainer: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
    backgroundColor: 'ivory',
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: '90%',
    alignSelf: 'center',
  },
  cardText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'black',
  },
});