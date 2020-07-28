import React from 'react';
import { StyleSheet, Text, View, Dimensions, Button } from 'react-native';
import Modal from 'react-native-modal';


const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", 
  "September", "October", "November", "December"];

export default class CalendarModal extends React.Component
{
  handleClosePress = () => {
    this.props.clearState();
    this.props.toggleCalendarModal();
  }
  
  render(){
    const deficientList = (Object.keys(this.props.deficientList).length > 0) ? (
      <View>
        <Text style={styles.modalTitleText} >
          Nutrient deficiencies for {monthNames[this.props.modalDateInput.month - 1]} {this.props.modalDateInput.day}
          , {this.props.modalDateInput.year}:
        </Text>
        <View style={styles.nutrientItemsContainer} >
          {/* List */}
          {this.props.deficientList.map(obj => {
            return (
              <View style={styles.nutrientItemView} key={obj.name + "View"} >
                <Text style={styles.nutrientItemText} key={obj.name + "Text"} >
                  {obj.name} - Consumed {obj.percent}% of recommended intake
                </Text>
              </View>
            )
          })}
        </View>
      </View>
    ) : (
      <View>
        <Text style={styles.modalTitleText} >
          Unable find nutritient logs from {monthNames[this.props.modalDateInput.month - 1]} {this.props.modalDateInput.day}
          , {this.props.modalDateInput.year}
        </Text>
      </View>
    )

    return (
      <View>
        <Modal isVisible={this.props.showCalendarModal} style={styles.modal} >
          <View style={styles.modalView} >
            {/* Nutrition info */}
            {deficientList}

            <Button title="Close" onPress={this.handleClosePress} />
          </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  modal: {
    alignSelf: 'center',
  },
  modalView: {
    backgroundColor: 'linen',
    borderRadius: 8,
    width: (Dimensions.get('window').width - 40),
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  modalTitleText: {
    fontSize: 24,
    textAlign: 'center',
  },
  nutrientItemsContainer: {
    marginTop: 10,
    width: '100%',
  },
  nutrientItemView: {
    paddingVertical: 4,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: 'grey',
    width: '100%',
  },
  nutrientItemText: {
    fontSize: 18,
    textAlign: 'center',
  }
});

