import React from 'react';
import { StyleSheet, Text, View, Dimensions, Button, FlatList, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';


export default class ImageModal extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      selectedMeal: "",
      selectedId: null,
      selectedFood: null,
    }
  }

  toggleModalView = () => {
    this.props.toggleModal();
  }

  onEnterPress = () => {
    console.log("Meal: " + this.state.selectedMeal);
    console.log("Selected Food: " + this.state.selectedFood);
    // Close modal
    this.toggleModalView();
    // Reset state so that next call is not affected?
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
        <Modal isVisible={this.props.showImageResultsModal} style={styles.modal} >
          <View style={styles.modalView} >
            <View style={[styles.modalHeaderContainer,{...(Platform.OS !== 'android' && { zIndex: 10 })}]} >
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
            <View style={styles.flatListContainer} >
              <FlatList 
                data={this.props.imageRecognition}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                extraData={this.state.selectedId}
                style={{ width: '80%' }}
              />
            </View>

            <View style={styles.buttonContainer} >
              <Button title="Cancel" onPress={this.toggleModalView} />
              <Button title="Enter" onPress={this.onEnterPress} />
            </View>
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
    backgroundColor: 'white',
    borderRadius: 8,
    width: (Dimensions.get('window').width - 40),
    padding: 20,
    alignItems: 'center',
  },
  modalHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    //zIndex: 10,
  },
  modalText: {
    fontSize: 20,
    textAlign: 'center',
  },
  flatListContainer: {
    width: '100%', 
    alignItems: 'center',
    marginBottom: 10,
  },
  flatListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 5,
    borderColor: 'grey',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
  },
  flatListItemText: {
    fontSize: 15,
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 50,
    justifyContent: 'space-between'
  }
});

