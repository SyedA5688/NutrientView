import React from 'react';
import { StyleSheet, Text, View, Dimensions, Button } from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons'; 


export default class SuccessModal extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      selectedMeal: "Lunch",
      selectedId: null,
      selectedFood: null,
      quantity: "1",
    }
  }

  toggleModal = () => {
    this.props.toggleSuccessModal();
  }
  
  render(){
    return (
      <View>
        <Modal isVisible={this.props.showSuccessModal} style={styles.modal} >
          <View style={styles.modalView} >
            <View style={styles.content} >
              <Text style={styles.modalText} >Successfully added nutrition data from food entry</Text>
              <Ionicons name="ios-nutrition" size={45} color="darkorange" />
            </View>
            <Button title="OK" onPress={this.toggleModal} />
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
  content: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 20,
    textAlign: 'center',
    marginRight: 10,
  },
});

