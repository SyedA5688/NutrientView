import React from 'react';
import { StyleSheet, Text, View, Dimensions, Button, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import DropDownPicker from 'react-native-dropdown-picker';


export default class ImageModal extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      selectedMeal: "",
    }
  }

  toggleModalView = () => {
    this.props.toggleModal();
  }
  
  render(){
    return (
      <View>
        <Modal isVisible={this.props.showImageResultsModal} style={styles.modal} >
          <View style={styles.modalView} >
            <Text style={styles.modalText} >Food Entry:</Text>
            <DropDownPicker
              items={[
                  {label: 'Breakfast', value: 'Breakfast'},
                  {label: 'Lunch', value: 'Lunch', selected: true},
                  {label: 'Snack', value: 'Snack'},
                  {label: 'Dinner', value: 'Dinner'},
              ]}
              containerStyle={{ height: 40, width: 100, }}
              style={{ backgroundColor: '#fafafa' }}
              itemStyle={{ justifyContent: 'flex-start' }}
              dropDownStyle={{backgroundColor: '#fafafa'}}
              onChangeItem={item => this.setState({ selectedMeal: item.value })}
            />

            <Button title="Cancel" onPress={this.toggleModalView} />
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
  modalText: {
    fontSize: 20,
    textAlign: 'center',
  },
});

