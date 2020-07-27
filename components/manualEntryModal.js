import React from 'react';
import { StyleSheet, Text, View, Dimensions, Button, TouchableOpacity,
          Alert, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Modal from 'react-native-modal';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';


export default class ManualEntrymageModal extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      selectedMeal: "Lunch",
      enteredFood: null,
      quantity: "1",
    }
  }

  toggleModal = () => {
    this.props.toggleManualEntryModal();
  }

  onEnterPress = () => {
    if (this.state.quantity == null || this.state.quantity == "0") {
      Alert.alert("Please enter a food quantity");
      return;
    }
    else if (this.state.enteredFood == null) {
      Alert.alert("Please enter the name of a food item, or cancel");
      return;
    }
    this.props.getNutritionData(this.state.quantity, this.state.enteredFood, this.state.selectedMeal);
    this.setState({ selectedMeal: "Lunch", enteredFood: null, quantity: "1" });
    this.toggleModal();
  }

  onCancelPress = () => {
    this.setState({ selectedMeal: "Lunch", selectedId: null, selectedFood: null, });
    this.toggleModal();
  }
  
  render(){
    const renderItem = ({ item }) => {
      const buttonColor = item.id === this.state.selectedId ? 'cornflowerblue' : 'grey';
      return (
        <TouchableOpacity 
          onPress={() => { this.setState({ selectedId: item.id, selectedFood: item.title }) }}
          style={styles.flatListItem}
        >
          <Ionicons name="ios-radio-button-on" size={16} color={buttonColor} />
          <Text style={styles.flatListItemText} >{item.title}</Text>
        </TouchableOpacity>
      )
    }

    return (
      <View>
        <Modal isVisible={this.props.showManualEntryModal} style={styles.modal} >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
            <View style={styles.modalView} >
              <View style={[styles.modalHeader,{...(Platform.OS !== 'android' && { zIndex: 10 })}]} >
                <Text style={styles.modalText} >Food Entry for </Text>
                <DropDownPicker
                  items={[
                      {label: 'Breakfast', value: 'Breakfast'},
                      {label: 'Lunch', value: 'Lunch', selected: true},
                      {label: 'Snack', value: 'Snack'},
                      {label: 'Dinner', value: 'Dinner'},
                  ]}
                  containerStyle={{ height: 40, width: 100, marginLeft: 10 }}
                  style={{ backgroundColor: '#fafafa' }}
                  itemStyle={{ justifyContent: 'flex-start' }}
                  dropDownStyle={{backgroundColor: '#fafafa'}}
                  onChangeItem={item => this.setState({ selectedMeal: item.value })}
                />
              </View>

              <View style={styles.quantityInputContainer} >
                <Text style={styles.modalText} >Quantity: </Text>
                <TextInput style={styles.quantityInput} 
                  value={this.state.quantity}
                  onChangeText={(text) => { this.setState({ quantity: text }) }}
                  keyboardType="number-pad"
                  autoCorrect={false}
                  textAlign={'center'}
                />
              </View>

              <View style={styles.textInputContainer} >
              <TextInput style={styles.textInput} 
                value={this.state.email}
                onChangeText={(text) => { this.setState({ enteredFood: text }) }}
                placeholder="Food Item"
                autoCapitalize="none"
                autoCorrect={false}
              />
              </View>

              <View style={styles.buttonContainer} >
                <Button title="Cancel" onPress={this.onCancelPress} />
                <Button title="Enter" onPress={this.onEnterPress} />
              </View>
            </View>
          </TouchableWithoutFeedback>
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
    backgroundColor: 'white',
    borderRadius: 8,
    width: (Dimensions.get('window').width - 40),
    padding: 20,
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 20,
    textAlign: 'center',
  },
  quantityInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  quantityInput: {
    height: 40,
    width: 40,
    marginLeft: 10,
    backgroundColor: '#fafafa',
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 5,
  },
  textInputContainer: {
    width: '100%',
    marginBottom: 15,
    alignItems: 'center',
  },
  textInput: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 5
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 50,
    justifyContent: 'space-between'
  }
});

